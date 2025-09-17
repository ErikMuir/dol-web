import { twMerge } from "tailwind-merge";
import { getDappConfig } from "@erikmuir/dol-lib/common/dapp";
import { useWalletInterface } from "@/hooks/use-wallet-interface";
import { openWalletConnectModal } from "@/wallet";
import { LogSection } from "./LogSection";

export default function DukesLog(): React.ReactElement {
  const { dappAccountId } = getDappConfig();
  const { accountId } = useWalletInterface();

  const handleConnectClick = async () => {
    openWalletConnectModal();
  };

  const ConnectWalletButton = (): React.ReactNode => (
    <div className="text-center">
      <button
        type="button"
        className={twMerge(
          "bg-dol-dark rounded-full px-4 py-1",
          "px-4 py-1",
          "text-lg text-dol-yellow",
          "hover:bg-gray-extra-dark transition duration-500 ease-in-out"
        )}
        onClick={handleConnectClick}
      >
        Connect your wallet
      </button>
    </div>
  );

  return (
    <div className="w-full max-w-[1024px] mx-auto">
      <div className="text-4xl uppercase tracking-[4px] text-center my-8">
        Audit Logs
      </div>
      <div className="flex flex-col items-center gap-8">
        {accountId ? (
          <LogSection title="Your Actions" logKey={accountId} />
        ) : (
          <ConnectWalletButton />
        )}
        <LogSection title="Duke's Actions" logKey={dappAccountId} />
      </div>
    </div>
  );
}
