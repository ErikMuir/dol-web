"use client";

import EventEmitter from "events";
import { useCallback, useContext, useEffect } from "react";
import {
  AccountId,
  LedgerId,
  TokenAssociateTransaction,
  TokenId,
  NftId,
  Transaction,
} from "@hashgraph/sdk";
import {
  DAppConnector,
  HederaJsonRpcMethod,
  HederaSessionEvent,
  HederaChainId,
} from "@hashgraph/hedera-wallet-connect";
import { getDappConfig } from "@erikmuir/dol-lib/common/dapp";
import { sleep } from "@erikmuir/dol-lib/common/utils";
import { WalletConnectContext } from "./context";
import { WalletInterface } from "./wallet-interface";
import { fetchJson } from "@/utils";

// Created refreshEvent because `dappConnector.walletConnectClient.on(eventName, syncWithWalletConnectContext)` would not call syncWithWalletConnectContext
// Reference usage from walletconnect implementation https://github.com/hashgraph/hedera-wallet-connect/blob/main/src/lib/dapp/index.ts#L120C1-L124C9
const refreshEvent = new EventEmitter();

const { name, description, url, icons, network, projectId } = getDappConfig();

const dappConnector = new DAppConnector(
  { name, description, url, icons },
  LedgerId.fromString(network),
  projectId,
  Object.values(HederaJsonRpcMethod),
  [HederaSessionEvent.ChainChanged, HederaSessionEvent.AccountsChanged],
  [network === "mainnet" ? HederaChainId.Mainnet : HederaChainId.Testnet]
);

// ensure walletconnect is initialized only once
let walletConnectInitPromise: Promise<void> | undefined;
const initializeWalletConnect = async () => {
  if (walletConnectInitPromise === undefined) {
    walletConnectInitPromise = dappConnector.init();
  }
  await walletConnectInitPromise;
};

export const openWalletConnectModal = async () => {
  await initializeWalletConnect();
  await dappConnector.openModal().then(() => {
    refreshEvent.emit("sync");
  });
};

export const auditClient = async (
  action: "NFT_PURCHASE" | "TOKEN_ASSOCIATE",
  success: boolean,
  accountId: AccountId,
  context: any = {}
) => {
  await fetchJson(`/api/audit/${accountId.toString()}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      action,
      success,
      accountId: accountId.toString(),
      context,
    }),
  });
};

class WalletConnectWallet implements WalletInterface {
  private getSigner() {
    if (dappConnector.signers.length === 0) {
      throw new Error("No signers found!");
    }
    return dappConnector.signers[0];
  }

  private getAccountId() {
    // Need to convert from walletconnect's AccountId to hashgraph/sdk's AccountId because they are not the same!
    return AccountId.fromString(this.getSigner().getAccountId().toString());
  }

  async associateToken(tokenId: TokenId) {
    const associateTokenTransaction = new TokenAssociateTransaction()
      .setAccountId(this.getAccountId())
      .setTokenIds([tokenId]);
    const signer = this.getSigner();
    await associateTokenTransaction.freezeWithSigner(signer);
    const txResult = await associateTokenTransaction.executeWithSigner(signer);
    const txReceipt = await txResult.getReceiptWithSigner(signer);
    const success = txReceipt?.status.toString() === "SUCCESS";
    await auditClient("TOKEN_ASSOCIATE", success, this.getAccountId(), {
      tokenId: tokenId.toString(),
    });
    return success;
  }

  async purchaseNft(
    tx: Transaction,
    nftId: NftId,
    showDate: string,
    position: number
  ): Promise<boolean> {
    let success = false;
    try {
      const signer = this.getSigner();
      await sleep(1000); // is this needed?
      const signedTx = await tx.signWithSigner(signer);
      const txResult = await signedTx.executeWithSigner(signer);
      const txReceipt = await txResult.getReceiptWithSigner(signer);
      success = txReceipt?.status.toString() === "SUCCESS";
    } catch (err) {
      console.error("Failed transfer transaction:", err);
    } finally {
      await auditClient("NFT_PURCHASE", success, this.getAccountId(), {
        tokenId: nftId.tokenId.toString(),
        serial: nftId.serial.toNumber(),
        showDate,
        position,
      });
    }
    return success;
  }

  async disconnect() {
    dappConnector.disconnectAll().then(() => {
      refreshEvent.emit("sync");
    });
  }
}

export const walletConnectWallet = new WalletConnectWallet();

// this component will sync the walletconnect state with the context
export const WalletConnectClient = () => {
  // use the HashpackContext to keep track of the hashpack account and connection
  const { setAccountId, setIsConnected } = useContext(WalletConnectContext);

  // sync the walletconnect state with the context
  const syncWithWalletConnectContext = useCallback(() => {
    const accountId = dappConnector.signers[0]?.getAccountId()?.toString();
    if (accountId) {
      setAccountId(accountId);
      setIsConnected(true);
    } else {
      setAccountId("");
      setIsConnected(false);
    }
  }, [setAccountId, setIsConnected]);

  useEffect(() => {
    // Sync after walletconnect finishes initializing
    refreshEvent.addListener("sync", syncWithWalletConnectContext);

    initializeWalletConnect().then(() => {
      syncWithWalletConnectContext();
    });

    return () => {
      refreshEvent.removeListener("sync", syncWithWalletConnectContext);
    };
  }, [syncWithWalletConnectContext]);

  return null;
};
