import { useEffect, useState } from "react";
import { erc20Abi, formatEther, parseEther } from "viem";
import { useAccount, useChainId, useReadContract, useWriteContract } from "wagmi";
import { useTransactor } from "~~/hooks/scaffold-eth";
import { useDeployedContractInfo } from "~~/hooks/scaffold-eth";
import { notification } from "~~/utils/scaffold-eth";

export const useApproveForSplitting = ({
  tokenAddress,
  amount,
  isTransferLoading,
}: {
  tokenAddress: string;
  amount: number;
  isTransferLoading?: boolean;
}) => {
  const { address } = useAccount();
  const chainId = useChainId();
  const { writeContractAsync } = useWriteContract();
  const writeTx = useTransactor();
  const [isLoading, setIsLoading] = useState(false);
  const { data: deployedContract } = useDeployedContractInfo("DGTokenSplitter");

  // Read token allowance
  const { data: allowanceData, refetch: refetchAllowance } = useReadContract({
    address: tokenAddress as `0x${string}`,
    abi: erc20Abi,
    functionName: "allowance",
    args: [address!, deployedContract?.address!],
    query: {
      enabled: !!(tokenAddress && address && deployedContract && !isTransferLoading),
    },
  });

  // Read token balance
  const { data: balanceData } = useReadContract({
    address: tokenAddress as `0x${string}`,
    abi: erc20Abi,
    functionName: "balanceOf",
    args: [address!],
    query: {
      enabled: !!(tokenAddress && address && !isTransferLoading),
    },
  });

  // Read token symbol
  const { data: symbolData } = useReadContract({
    address: tokenAddress as `0x${string}`,
    abi: erc20Abi,
    functionName: "symbol",
    query: {
      enabled: !!(tokenAddress && !isTransferLoading),
    },
  });

  // Read token name
  const { data: nameData } = useReadContract({
    address: tokenAddress as `0x${string}`,
    abi: erc20Abi,
    functionName: "name",
    query: {
      enabled: !!(tokenAddress && !isTransferLoading),
    },
  });

  const sendContractWriteTx = async () => {
    if (!chainId) {
      notification.error("Please connect your wallet");
      return;
    }

    if (deployedContract && tokenAddress) {
      try {
        setIsLoading(true);
        const approveAmount = parseEther((amount * 1.01).toString());

        await writeContractAsync({
          address: tokenAddress as `0x${string}`,
          abi: erc20Abi,
          functionName: "approve",
          args: [deployedContract.address, approveAmount],
        });

        // Refetch allowance after approval
        setTimeout(() => {
          refetchAllowance();
        }, 2000);
      } catch (e: any) {
        notification.error(e.message || "Approval failed");
      } finally {
        setIsLoading(false);
      }
    } else {
      notification.error("Contract writer error. Try again.");
    }
  };

  // Format the data for return
  const allowance = allowanceData ? parseFloat(formatEther(allowanceData)).toFixed(2) : "0.00";
  const balance = balanceData ? parseFloat(formatEther(balanceData)) : undefined;
  const tokenSymbol = symbolData || "";
  const tokenName = nameData || "";

  return {
    writeAsync: sendContractWriteTx,
    allowance,
    balance,
    tokenSymbol,
    tokenName,
    isLoading,
  };
};
