import { getDappConfig } from "@erikmuir/dol-lib/common/dapp";
import { useAccountNfts, useWalletInterface } from "@/hooks";
import { Loading } from "@/components/common/Loading";
import { NoPages } from "./NoPages";
import { NotConnected } from "./NotConnected";
import { AddToStashItem, StashItem } from "./StashItem";

const { hfbCollectionId } = getDappConfig();

export default function YourPages(): React.ReactElement {
  const { accountId } = useWalletInterface();
  const { nfts, nftsLoading } = useAccountNfts(hfbCollectionId, accountId);

  const getContent = (): React.ReactNode => {
    if (!accountId) {
      return <NotConnected />;
    }

    if (nftsLoading) {
      return <Loading sizeInPixels={90} />;
    }

    if (!nfts || nfts.length === 0) {
      return <NoPages />;
    }

    return (
      <div className="flex flex-col items-center justify-center w-full h-full">
        <div className="text-4xl uppercase tracking-[4px] text-center my-12">
          Your Stash
        </div>
        <div className="flex flex-wrap justify-center gap-4">
          {nfts.map((nft) => {
            const tokenId = nft.token_id;
            const serial = nft.serial_number;
            return (
              <StashItem
                key={`${tokenId}:${serial}`}
                tokenId={tokenId}
                serial={serial}
              />
            );
          })}
          <AddToStashItem />
        </div>
      </div>
    );
  };

  return (
    <div className="w-full md:w-[500px] lg:w-[680px] mx-auto">
      {getContent()}
    </div>
  );
}
