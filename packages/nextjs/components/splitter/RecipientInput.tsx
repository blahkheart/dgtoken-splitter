import React from "react";
import { TrashIcon } from "@heroicons/react/24/outline";
import { FieldLabel } from "~~/components/ui";
import { Address } from "~~/components/scaffold-eth";

interface RecipientInputProps {
  recipients: string;
  setRecipients: (value: string) => void;
  wallets: string[];
  removeWalletField: (index: number) => void;
  addMultipleAddress: (value: string) => void;
  loadingAddresses: boolean;
  invalidAddresses: string[];
}

export function RecipientInput({
  recipients,
  setRecipients,
  wallets,
  removeWalletField,
  addMultipleAddress,
  loadingAddresses,
  invalidAddresses,
}: RecipientInputProps) {
  return (
    <>
      <div className="mb-4 rounded-xl border border-white/10 bg-black/20 p-3">
        <div className="flex items-center justify-between">
          <FieldLabel>Recipient Wallets</FieldLabel>
          <button
            className="text-[11px] rounded-full border border-white/10 px-2 py-1 bg-white/5 hover:bg-white/10 text-slate-300"
            onClick={() => alert("Hook this into your contacts book.")}
          >
            CONTACTS
          </button>
        </div>
        <textarea
          rows={4}
          value={recipients}
          onChange={(e) => {
            setRecipients(e.target.value);
            addMultipleAddress(e.target.value);
          }}
          placeholder="Separate each address with a comma, space or new line"
          className="w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2.5 outline-none focus:ring-2 focus:ring-cyan-500/40 text-white"
        />
        <div className="mt-1 text-[11px] text-slate-400">{wallets.length} recipient(s)</div>
      </div>

      {/* Valid addresses list */}
      {wallets.length > 0 && (
        <div className="mb-4 rounded-xl border border-white/10 bg-black/20 p-3">
          <FieldLabel>Valid Addresses: {wallets.length}</FieldLabel>
          <div className="flex justify-center">
            {loadingAddresses && <span className="loading loading-infinity loading-lg"></span>}
          </div>
          <div className="space-y-2 mt-2">
            {wallets.map((wallet, index) => (
              <div className="flex items-center justify-between px-2 py-1 rounded bg-white/5" key={index}>
                <Address address={wallet} size="lg" />
                <button
                  type="button"
                  onClick={() => removeWalletField(index)}
                  className="text-red-400 hover:text-red-300 p-1"
                >
                  <TrashIcon className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Invalid addresses */}
      {invalidAddresses.length > 0 && (
        <div className="mb-4 rounded-xl border border-red-500/20 bg-red-500/10 p-3">
          <FieldLabel>Invalid Addresses/ENS: {invalidAddresses.length}</FieldLabel>
          <div className="space-y-1 mt-2">
            {invalidAddresses.map((address, index) => (
              <div key={index} className="text-red-300 text-sm px-2">
                {index + 1}. {address}
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}