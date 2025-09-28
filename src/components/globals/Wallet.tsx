import { useCallback, useState } from "react";
import { getDappConfig } from "@erikmuir/dol-lib/common/dapp";
import { useIsTokenAssociated, useWalletInterface } from "@/hooks";
import { openWalletConnectModal } from "@/wallet";
import { DolButton } from "../common/DolButton";
import Modal from "./Modal";

export const Wallet = () => {
  const { hfbCollectionId } = getDappConfig();
  const [open, setOpen] = useState(false);
  const { accountId, walletInterface } = useWalletInterface();
  const { isAssociated, mutateIsAssociated } = useIsTokenAssociated(hfbCollectionId, accountId);

  const handleAccountClick = async () => {
    setOpen(!open);
  };

  const handleConnectClick = useCallback(async () => {
    openWalletConnectModal();
    setOpen(false);
  }, []);

  const handleDisconnectClick = useCallback(async () => {
    await walletInterface?.disconnect();
    setOpen(false);
  }, [walletInterface]);

  const handleAssociateClick = useCallback(async () => {
    const success = await walletInterface?.associateToken(hfbCollectionId);
    if (success) {
      mutateIsAssociated(true);
    }
    setOpen(false);
  }, [walletInterface, mutateIsAssociated, hfbCollectionId]);

  const handleLinkClick = useCallback(() => {
    setOpen(false);
  }, []);

  const handleCancelClick = useCallback(() => {
    setOpen(false);
  }, []);

  return (
    <div>
      <DolButton color="gray" size="sm" roundedFull onClick={handleAccountClick}>
        {accountId || "Account"}
      </DolButton>
      <Modal
        id="wallet"
        show={open}
        onClose={handleCancelClick}
        className="justify-end items-start pt-10"
      >
        <div className="flex flex-col gap-3 w-48">
          {accountId ? (
            <DolButton color="red" onClick={handleDisconnectClick}>Disconnect</DolButton>
          ) : (
            <DolButton color="green" onClick={handleConnectClick}>Connect Wallet</DolButton>
          )}
          {accountId && !isAssociated && (
            <DolButton color="green" onClick={handleAssociateClick}>Associate Token</DolButton>
          )}
          <DolButton color="blue" href="/terms-of-service" onClick={handleLinkClick}>Terms of Service</DolButton>
          <DolButton color="yellow" href="/privacy-policy" onClick={handleLinkClick}>Privacy Policy</DolButton>
          <DolButton color="dark" onClick={handleCancelClick}>Cancel</DolButton>
        </div>
      </Modal>
    </div>
  );
};
