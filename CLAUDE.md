# CLAUDE.md

**Purpose:** Enable Claude Code to safely understand, extend, and maintain this Scaffold‑ETH 2 codebase without breaking its architecture. Follow these directives when reading, generating, or modifying code.

---

## 1) Architecture Overview

**Monorepo layout**

- `packages/nextjs/` – Next.js 13+ (App Router), Tailwind v3, daisyUI v4, RainbowKit + Wagmi + viem.
- `packages/hardhat/` *or* `packages/foundry/` – Solidity framework (one chosen at project init). Contains contracts, deploy scripts, tests.

**Key cross‑package contracts mapping**

- `packages/nextjs/contracts/deployedContracts.ts` – **Auto‑generated** on `yarn deploy`. Do **not** hand‑edit.
- `packages/nextjs/contracts/externalContracts.ts` – Manually curated addresses/ABIs for third‑party contracts.
- `packages/nextjs/scaffold.config.ts` – Dapp config (target networks, polling, provider keys, burner wallet behavior, etc.).

**UI system**

- Styling: Tailwind + daisyUI. Global config at `packages/nextjs/tailwind.config.js` and `packages/nextjs/styles/globals.css`.
- Shared components: `packages/nextjs/components/scaffold-eth/*` (use these before building new primitives).

**Wallets / Providers**

- RainbowKit setup in `packages/nextjs/providers/RainbowKitProvider.tsx`.
- Wagmi/viem underpins reads/writes/events; custom hooks wrap Wagmi for type‑safe DX.

---

## 2) Interaction Patterns (Read / Write / Events)

Prefer the project’s **custom hooks** over raw Wagmi unless you need lower‑level control:

- **Read**: `useScaffoldReadContract({ contractName, functionName, args? })`
- **Write**: `useScaffoldWriteContract(contractName)` → `writeContractAsync({ functionName, args?, value? }, { onBlockConfirmation? })`
- **Events (historical)**: `useScaffoldEventHistory({ contractName, eventName, fromBlock, filters?, blockData?, transactionData?, receiptData?, watch? })`
- **Events (live)**: `useScaffoldWatchContractEvent({ contractName, eventName, onLogs })`
- **Contract instance**: `useScaffoldContract({ contractName, walletClient?, chainId? })` (only when you truly need direct `read`/`write`).
- **UX wrapper for tx feedback**: `useTransactor()` – wraps `sendTransaction` or `writeContractAsync` to show success/error toasts & wait for confirmations.

**Autocompletion depends on**:

- `deployedContracts.ts` (auto‑generated)
- `externalContracts.ts` (manual)
- `scaffold.config.ts` (`targetNetworks` must include your deployed chain)

> ⚠️ When multiple `targetNetworks` are present, **contract names must match** across chains listed—types are inferred from `targetNetworks[0]`.

---

## 3) Components to Prefer (web3‑ready)

Located at `packages/nextjs/components/scaffold-eth/`:

- `Address` – ENS + blockie + explorer link. Props: `address`, `format`, `size`, `onlyEnsOrAddress`, `disableAddressLink`.
- `AddressInput` – Address/ENS input with validation & avatar. Props: `value`, `onChange`, `placeholder`, `disabled`.
- `Balance` – Native token balance (ETH + USD). Prop: `address`.
- `BlockieAvatar` – Deterministic address icon; optional `ensImage` override.
- `EtherInput` – ETH/USD switcher input. Value stored in ETH; shows USD mapping.
- `InputBase` – Styled input primitive with `error`/`disabled`.
- `IntegerInput` – Integer validator; includes quick `× 10^18` to convert to wei.
- `RainbowKitCustomConnectButton` – Enhanced connect modal with balance, chain badge, QR, copy, explorer link, disconnect.

> ✅ Use these components to keep UX consistent. Only build new primitives if requirements aren’t covered by the above.

---

## 4) Networks & Chains

**Where to configure**

- App: `packages/nextjs/scaffold.config.ts` → `targetNetworks`, `pollingInterval`, `NEXT_PUBLIC_ALCHEMY_API_KEY`, `NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID`, burner wallet behavior.
- Frontend custom chains: `packages/nextjs/utils/customChains.ts` via `defineChain(...)`.
- Solidity framework:
  - **Hardhat**: `packages/hardhat/hardhat.config.ts` → `networks` object.
  - **Foundry**: `packages/foundry/foundry.toml` → `[rpc_endpoints]`.

**Rule of thumb**

- If a chain isn’t in `viem/chains`, define it via `defineChain` and add to `targetNetworks`.
- Ensure deploy scripts & config for the same chain exist on the Solidity side.

---

## 5) Environment & Running Locally

**Requirements**

- Node ≥ `v20.18.3`, Yarn (1 or 2+), Git.

**Development workflow (3 terminals)**

1. Local chain

```bash
yarn chain
```

2. Deploy contracts (to local chain by default)

```bash
yarn deploy
```

3. Run web app

```bash
yarn start
# visit http://localhost:3000
```

**Editing hotspots**

- Contracts: `packages/hardhat/contracts` or `packages/foundry/contracts`
- Deploy scripts: `packages/hardhat/deploy` or `packages/foundry/script`
- Frontend entry: `packages/nextjs/app/page.tsx`
- App config: `packages/nextjs/scaffold.config.ts`
- Tests: `packages/hardhat/test` (`yarn hardhat:test`) or `packages/foundry/test` (`yarn foundry:test`)

**Provider/API keys (production‑grade)**

- Next.js: `packages/nextjs/.env.local`
  - `NEXT_PUBLIC_ALCHEMY_API_KEY`
  - `NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID`
- Solidity side:
  - Hardhat: `packages/hardhat/.env` → `ALCHEMY_API_KEY`, `ETHERSCAN_API_KEY`
  - Foundry: `packages/foundry/.env` → `ETHERSCAN_API_KEY`

---

## 6) Deploying Contracts

**Account management**

```bash
yarn generate          # create encrypted deployer key (Hardhat)
yarn account:import    # import existing private key
yarn account           # inspect balances (prompts for password)
```

**Contract deployment**

```bash
yarn deploy                          # default network (local)
yarn deploy --network <name>         # deploy to a specific network
# Hardhat: tag selection
yarn deploy --network sepolia --tags tagExample
# Foundry: specific script
yarn deploy --network sepolia --file DeployMyContract.s.sol
```

**Verification**

```bash
yarn verify --network <name>
# Hardhat: optionally
yarn hardhat-verify --network <name> <address> "<arg1>"
```

> After deployment, `deployedContracts.ts` is regenerated. Do not edit it manually.

---

## 7) Deploying the Next.js App

**Vercel**

```bash
yarn vercel:login
yarn vercel         # preview URL
yarn vercel --prod  # deploy to production
```

**Skip type/lint checks (last resort)**

- Local pre‑commit: comment out `yarn lint-staged --verbose` in `.husky/pre-commit`.
- Vercel CLI ignore: `yarn vercel:yolo`.
- Vercel env var: set `NEXT_PUBLIC_IGNORE_BUILD_ERROR=true`.
- GitHub Actions: remove `.github/` if you must disable CI lint/type checks. Prefer fixing errors instead.

> ⚠️ These bypasses are for emergencies only. Prefer to resolve type/lint errors to keep DX and safety high.

---

## 8) External Contracts

Add third‑party ABIs/addresses in `packages/nextjs/contracts/externalContracts.ts` under the correct `chainId`. Keep `scaffold.config.ts` `targetNetworks` in sync so TypeScript autocompletion works.

Example shape:

```ts
const externalContracts = {
  1: {
    DAI: { address: "0x...", abi: [...] },
    WETH:{ address: "0x...", abi: [...] },
  },
  5: {
    DAI: { address: "0x...", abi: [...] },
    WETH:{ address: "0x...", abi: [...] },
  },
} as const;
```

---

## 9) Extensions (optional but supported)

Extensions can only be added at project creation time:

```bash
npx create-eth@latest -e <github-username>/<extension-repo>[:branch]
```

- Authoring advanced extensions uses `create-eth`’s templating (`*.args.mjs`) to patch base files. See the extension README if present in this repo.

---

## 10) Contribution Workflow & Code Quality

**Issues & PRs**

- One concern per PR (feature/bug OR style, not both).
- Use descriptive branch names, clear titles, and structured descriptions with bullet points & screenshots.
- Link related issues. Keep commit messages concise and meaningful.
- Expect review questions; resolve threads as you address feedback. We squash‑merge.

**Formatting / Linting**

- Respect existing Prettier/ESLint configs. Configure your IDE to auto‑format on save.
- Do not bypass pre‑commit or CI unless explicitly authorized.

**When editing generated or core files**

- **Never** hand‑edit `deployedContracts.ts`.
- Prefer adding new code to components/hooks rather than modifying shared primitives unless necessary.
- If changing shared primitives, ensure all usages are updated and covered by basic manual tests.

---

## 11) Common Recipes (copy/paste‑ready)

**Read uint from contract**

```tsx
import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";

const { data: totalCounter, isLoading } = useScaffoldReadContract({
  contractName: "YourContract",
  functionName: "totalCounter",
});
```

**Read with arg (connected user)**

```tsx
import { useAccount } from "wagmi";
import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";

const { address } = useAccount();
const { data: userCount } = useScaffoldReadContract({
  contractName: "YourContract",
  functionName: "userGreetingCounter",
  args: [address],
});
```

**Write with feedback (Scaffold hook)**

```tsx
import { parseEther } from "viem";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

const { writeContractAsync, isPending } = useScaffoldWriteContract("YourContract");

await writeContractAsync(
  {
    functionName: "setGreeting",
    args: ["Hello"],
    value: parseEther("0.01"),
  },
  {
    onBlockConfirmation: (receipt) => console.log(receipt.blockHash),
  }
);
```

**Write with Wagmi + transactor**

```tsx
import { parseEther } from "viem";
import { useWriteContract } from "wagmi";
import { useTransactor } from "~~/hooks/scaffold-eth";
import DeployedContracts from "~~/contracts/deployedContracts";

const { writeContractAsync, isPending } = useWriteContract();
const writeTx = useTransactor();

const call = () => writeContractAsync({
  address: DeployedContracts[31337].YourContract.address,
  abi: DeployedContracts[31337].YourContract.abi,
  functionName: "setGreeting",
  value: parseEther("0.01"),
  args: ["Hello"],
});

await writeTx(call, { blockConfirmations: 1 });
```

**Event history (with filters + watch)**

```tsx
import { useScaffoldEventHistory } from "~~/hooks/scaffold-eth";

const { data: events } = useScaffoldEventHistory({
  contractName: "YourContract",
  eventName: "GreetingChange",
  fromBlock: 31231n,
  watch: true,
  filters: { greetingSetter: "0x..." },
  blockData: true,
  transactionData: true,
  receiptData: true,
});
```

---

## 12) Guardrails & Pitfalls

- Keep `targetNetworks` aligned with where contracts are actually deployed. Missing chains → broken types & hooks.
- If RPC event streaming is flaky, prefer `useScaffoldEventHistory({ watch: true })` or adjust `pollingInterval` in `scaffold.config.ts`.
- Always convert BigInt/wei to human units for display (e.g., `formatEther`).
- Use `EtherInput`/`IntegerInput` for reliability when capturing numeric values.
- Do not leak private keys. Use encrypted deployers and environment variables.
- Only disable type/lint checks when truly blocked and document why in your PR.

---

## 13) Minimal Glossary

- **Wagmi**: React hooks for EVM wallets/contracts.
- **viem**: Type‑safe EVM client/tooling (used under Wagmi and directly in custom hooks).
- **RainbowKit**: Wallet UI & connectors.
- **Burner Wallet**: Lightweight dev wallet (scope controlled by `onlyLocalBurnerWallet`).
- **Extensions**: Scaffolding addons installed at project creation.

---

## 14) What Claude Should Do by Default

1. **Favor custom hooks & scaffold components** to maintain consistency.
2. **Update config** (chains, env keys) instead of hardcoding provider URLs in components.
3. **Create new components in feature folders** and re‑export from `components/scaffold-eth` only if they become shared.
4. **Write typed code** (TS first). Use types from hooks and contracts.
5. **Add examples/tests** for new contract functions and keep deploy scripts deterministic.
6. **Document new env vars and config flags** in this file and `.env.example` if present.

---

## 15) Quick Checklists

**Adding a new chain**

-

**Adding a new contract**

-

**Integrating an external contract**

-

---

*This CLAUDE.md is the single source of truth for code generation conventions in this repo. If you must diverge, explain why in your PR description and update this file.*

