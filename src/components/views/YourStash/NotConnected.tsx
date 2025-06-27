import { twMerge } from "tailwind-merge";
import { openWalletConnectModal } from "@/wallet";

export const NotConnected = (): React.ReactNode => (
  <div className="flex flex-col items-center justify-center w-full h-[calc(100vh-220px)] gap-4">
    <h1 className="text-[60px] text-center">Build Your Collection</h1>
    <div className="text-xl text-balance text-center">
      Here is where you'll find all the pages of the Helping Friendly Book for
      which you've laid claim.
    </div>
    <div>&nbsp;</div>
    <button
      type="button"
      className={twMerge(
        "py-2 px-4 rounded-full text-sm uppercase tracking-widest",
        "bg-dol-blue/25 hover:bg-dol-blue/75 duration-500"
      )}
      onClick={openWalletConnectModal}
    >
      Connect your wallet
    </button>
  </div>
);
