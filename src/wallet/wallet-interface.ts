import { NftId, TokenId, TransferTransaction } from "@hashgraph/sdk";

export interface WalletInterface {
  associateToken: (tokenId: TokenId) => Promise<boolean>;
  purchaseNft: (
    transaction: TransferTransaction,
    nftId: NftId,
    showDate: string,
    position: number
  ) => Promise<boolean>;
  disconnect: () => Promise<void>;
}
