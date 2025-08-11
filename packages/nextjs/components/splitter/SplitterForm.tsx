import React, { useEffect, useMemo, useState } from "react";
import { AmountInput } from "./AmountInput";
import { RecipientInput } from "./RecipientInput";
import { TokenSelector } from "./TokenSelector";
import { createPublicClient, http, isAddress, parseEther } from "viem";
import { mainnet } from "viem/chains";
import { normalize } from "viem/ens";
import { GlassCard, GradientButton } from "~~/components/ui";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
import { saveContacts } from "~~/utils/ethSplitter";

interface SplitterFormProps {
  mode: "eth" | "token";
  splitKind: "equal" | "unequal";
}

const TOKENS = [
  { symbol: "DG", name: "DreadGang", address: "0x4aA47eD29959c7053996d8f7918db01A62D02ee5" },
  { symbol: "UP", name: "UnlockProtocolToken", address: "0xac27fa800955849d6d17cc8952ba9dd6eaa66187" },
  { symbol: "USDC", name: "USD Coin", address: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913" },
  { symbol: "CUSTOM", name: "Custom", address: "" },
];

export function SplitterForm({ mode, splitKind }: SplitterFormProps) {
  // Token state
  const [selectedToken] = useState(TOKENS[0]); // setSelectedToken unused for now
  const [] = useState(""); // customToken and setCustomToken unused for now
  const [tokenContract, setTokenContract] = useState("");

  // Split form state
  const [amountEach, setAmountEach] = useState("");
  const [recipients, setRecipients] = useState("");
  const [unequalCsv, setUnequalCsv] = useState("");

  // Derived state
  const [wallets, setWallets] = useState<string[]>([]);
  const [walletsFilter, setWalletsFilter] = useState<string[]>([]);
  const [, setTotalAmount] = useState(""); // totalAmount unused
  const [totalTokenAmount, setTotalTokenAmount] = useState("");
  const [totalEthAmount, setTotalEthAmount] = useState("");
  const [invalidAddresses, setInvalidAddresses] = useState<string[]>([]);
  const [loadingAddresses, setLoadingAddresses] = useState(false);

  const publicClient = createPublicClient({
    chain: mainnet,
    transport: http(),
  });

  // const tokenAddress = useMemo(
  //   () => (selectedToken.symbol === "CUSTOM" ? customToken.trim() : selectedToken.address),
  //   [selectedToken, customToken],
  // ); // unused for now

  // const recipientList = useMemo(() => {
  //   return recipients
  //     .split(/\s|,|\n/g)
  //     .map(r => r.trim())
  //     .filter(Boolean);
  // }, [recipients]); // unused for now

  const unequalAmounts = useMemo(() => {
    return unequalCsv
      .split(/\s|,|\n/g)
      .map(v => v.trim())
      .filter(Boolean);
  }, [unequalCsv]);

  // Contract interactions
  const { writeContractAsync: splitEqualETH } = useScaffoldWriteContract("DGTokenSplitter");
  const { writeContractAsync: splitEqualERC20, isMining: splitErc20Loading } =
    useScaffoldWriteContract("DGTokenSplitter");

  const canSplit = useMemo(() => {
    if (wallets.length === 0) return false;
    if (splitKind === "equal") return Number(amountEach) > 0;
    return unequalAmounts.length === wallets.length && unequalAmounts.every(v => Number(v) > 0);
  }, [wallets, splitKind, amountEach, unequalAmounts]);

  const resolveEns = async (name: string) => {
    try {
      const ensAddress = await publicClient.getEnsAddress({
        name: normalize(name),
      });
      return String(ensAddress);
    } catch {
      return "null";
    }
  };

  const getEnsName = async (address: string) => {
    try {
      const ensName = await publicClient.getEnsName({
        address: normalize(address) as `0x${string}`,
      });
      return String(ensName);
    } catch {
      return "null";
    }
  };

  async function addMultipleAddress(value: string) {
    const validateAddress = (address: string) => isAddress(address);
    const cleanAddress = (str: string) => str.replace(/\n|\s/g, "");
    const splitAddresses = (value: string) =>
      value.trim().includes(",") ? value.split(",").map(cleanAddress) : value.split(/\s+/).map(cleanAddress);

    const addresses = splitAddresses(value).filter(
      address => !wallets.includes(address) && !walletsFilter.includes(address),
    );
    const resolvedAddresses: string[] = [];

    setInvalidAddresses([]);

    const isLoading =
      addresses[addresses.length - 1]?.endsWith(".eth") || addresses[addresses.length - 1]?.startsWith("0x");
    if (isLoading && addresses[addresses.length - 1] !== wallets[wallets.length - 1]) {
      setLoadingAddresses(true);
    }

    await Promise.all(
      addresses.map(async address => {
        if (address.endsWith(".eth")) {
          const resolvedAddress = await resolveEns(address);
          if (resolvedAddress === "null") {
            setInvalidAddresses(prevState => [...new Set([...prevState, address])]);
          } else {
            setWalletsFilter(prevState => [...new Set([...prevState, address])]);
          }
          resolvedAddresses.push(resolvedAddress);
        } else {
          resolvedAddresses.push(address);
        }

        if (address.startsWith("0x") && !validateAddress(address)) {
          setInvalidAddresses(prevState => [...new Set([...prevState, address])]);
        }
      }),
    );

    const uniqueAddresses = [...new Set(resolvedAddresses.filter(validateAddress))];
    setWallets(prevState => [...new Set([...prevState, ...uniqueAddresses])]);
    setLoadingAddresses(false);
  }

  const removeWalletField = async (index: number) => {
    setLoadingAddresses(true);
    const ensName = await getEnsName(wallets[index]);
    const newWallets = [...wallets];
    const newFilter = walletsFilter.filter(
      wallet => wallet !== wallets[index] && wallet.toLowerCase() !== ensName.toLowerCase(),
    );

    newWallets.splice(index, 1);
    setWallets(newWallets);
    setWalletsFilter(newFilter);
    setLoadingAddresses(false);
  };

  const handleSplit = async () => {
    try {
      if (mode === "eth") {
        await splitEqualETH({
          functionName: "splitEqualETH",
          args: [wallets as `0x${string}`[]],
          value: parseEther(totalEthAmount.toString()),
        });
      } else {
        await splitEqualERC20({
          functionName: "splitEqualERC20",
          args: [tokenContract as `0x${string}`, wallets as `0x${string}`[], BigInt(totalTokenAmount)],
        });
      }
      saveContacts(wallets);
    } catch {
      console.error("Split failed");
    }
  };

  // Calculate total amounts
  useEffect(() => {
    let totalAmount: any = 0;
    for (let index = 0; index < wallets.length; index++) {
      if (wallets[index] === "" || amountEach === "") {
        return;
      }
      totalAmount += parseFloat(amountEach);
    }
    if (mode === "token") {
      totalAmount = parseEther(totalAmount.toFixed(18));
      setTotalTokenAmount(totalAmount.toString());
    } else {
      totalAmount = totalAmount.toFixed(18);
      setTotalEthAmount(totalAmount);
    }
    setTotalAmount(totalAmount.toString());
  }, [amountEach, wallets, mode]);

  return (
    <GlassCard className="mx-auto max-w-xl">
      {/* Title + rate row */}
      <div className="mb-4">
        <div className="text-lg font-semibold text-slate-100">Split</div>
        <div className="text-[11px] text-slate-400 mt-1">Fast token distribution to multiple wallets</div>
      </div>

      {/* Token selector (only for token mode) */}
      {mode === "token" && (
        <TokenSelector
          tokenContract={tokenContract}
          setTokenContract={setTokenContract}
          splitErc20Loading={splitErc20Loading}
        />
      )}

      {/* Amount input */}
      <AmountInput
        mode={mode}
        splitKind={splitKind}
        amountEach={amountEach}
        setAmountEach={setAmountEach}
        unequalCsv={unequalCsv}
        setUnequalCsv={setUnequalCsv}
        selectedToken={selectedToken}
      />

      {/* Recipients */}
      <RecipientInput
        recipients={recipients}
        setRecipients={setRecipients}
        wallets={wallets}
        removeWalletField={removeWalletField}
        addMultipleAddress={addMultipleAddress}
        loadingAddresses={loadingAddresses}
        invalidAddresses={invalidAddresses}
      />

      {/* Primary action */}
      <GradientButton onClick={handleSplit} disabled={!canSplit}>
        {mode === "token" ? "Split Tokens" : "Split ETH"}
      </GradientButton>
    </GlassCard>
  );
}
