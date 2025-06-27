import { useState } from "react";
import { twMerge } from "tailwind-merge";
import { useWalletInterface } from "@/hooks";
import { openWalletConnectModal } from "@/wallet";
import Modal from "./Modal";

export const Wallet = () => {
  const [open, setOpen] = useState(false);
  const { accountId, walletInterface } = useWalletInterface();

  const handleWalletClick = async () => {
    if (accountId) {
      setOpen(true);
    } else {
      openWalletConnectModal();
    }
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
        onClick={handleWalletClick}
      >
        {accountId || "Connect"}
      </button>
      <Modal
        id="disconnect-wallet"
        show={open}
        onClose={() => setOpen(false)}
        className="justify-end items-start pt-10"
      >
        <div className="flex flex-col items-center gap-2 w-48">
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
