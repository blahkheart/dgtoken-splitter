import { Dispatch, SetStateAction } from "react";
// import { GetAccountResult } from "@wagmi/core"; // deprecated

export type UiJsxProps = {
  splitItem: string;
  account: any; // account type
  splitterContract: string;
};

export type TokenDataJsxProps = {
  splitErc20Loading: boolean;
  account: any; // account type
  splitterContract: string;
  setTokenContract: Dispatch<SetStateAction<string>>;
  tokenContract: string;
};
