import { useState } from "react";
import { twMerge } from "tailwind-merge";
import { useWalletInterface } from "@/hooks";
import { openWalletConnectModal } from "@/wallet";
import Modal from "./Modal";
import Link from "next/link";

export const Wallet = () => {
  const [open, setOpen] = useState(false);
  const { accountId, walletInterface } = useWalletInterface();

  const handleAccountClick = async () => {
    setOpen(!open);
  };

  return (
    <div>
      <button
        type="button"
        className={twMerge(
          "bg-gray-medium/25 hover:bg-gray-medium/50 duration-500",
          "py-1 px-4 rounded-full",
          "text-xs uppercase"
        )}
        onClick={handleAccountClick}
      >
        {accountId || "Account"}
      </button>
      <Modal
        id="disconnect-wallet"
        show={open}
        onClose={() => setOpen(false)}
        className="justify-end items-start pt-10"
      >
        <div className="flex flex-col gap-3 w-48">
          {!accountId && (
            <button
              type="button"
              className={twMerge(
                "bg-dol-green/50 hover:bg-dol-green/75 duration-500",
                "p-2 rounded w-full",
                "text-dol-white text-center uppercase tracking-wide text-xs"
              )}
              onClick={() => {
                openWalletConnectModal();
                setOpen(false);
              }}
            >
              Connect Wallet
            </button>
          )}
          {accountId && (
            <button
              type="button"
              className={twMerge(
                "bg-dol-red/50 hover:bg-dol-red/75 duration-500",
                "p-2 rounded w-full",
                "text-dol-white text-center uppercase tracking-wide text-xs"
              )}
              onClick={() => {
                walletInterface?.disconnect();
                setOpen(false);
              }}
            >
              Disconnect
            </button>
          )}
          <Link
            href="/terms-of-service"
            onClick={() => setOpen(false)}
            className={twMerge(
              "bg-dol-blue/50 hover:bg-dol-blue/75 duration-500",
              "p-2 rounded w-full",
              "text-dol-white text-center uppercase tracking-wide text-xs",
              "flex justify-center gap-2"
            )}
          >
            Terms of Service
          </Link>
          <Link
            href="/privacy-policy"
            onClick={() => setOpen(false)}
            className={twMerge(
              "bg-dol-yellow/50 hover:bg-dol-yellow/75 duration-500",
              "p-2 rounded w-full",
              "text-white text-center uppercase tracking-wide text-xs",
              "flex justify-center gap-2"
            )}
          >
            Privacy Policy
          </Link>
          <button
            type="button"
            className={twMerge(
              "bg-transparent hover:bg-gray-dark-2 duration-500",
              "border border-gray-dark-2",
              "p-2 rounded w-full",
              "text-dol-white text-center uppercase tracking-wide text-xs"
            )}
            onClick={() => setOpen(false)}
          >
            Cancel
          </button>
        </div>
      </Modal>
    </div>
  );
};
