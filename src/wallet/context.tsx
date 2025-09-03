"use client";

import { createContext, useState, ReactNode, Context } from "react";

export type WalletContext = {
  accountId: string;
  setAccountId: (newValue: string) => void;
  isConnected: boolean;
  setIsConnected: (newValue: boolean) => void;
};

const defaultContext: WalletContext = {
  accountId: "",
  setAccountId: () => {},
  isConnected: false,
  setIsConnected: () => {},
};

export const WalletConnectContext: Context<WalletContext> =
  createContext(defaultContext);

export const WalletConnectContextProvider = (props: {
  children: ReactNode | undefined;
}) => {
  const [accountId, setAccountId] = useState(defaultContext.accountId);
  const [isConnected, setIsConnected] = useState(defaultContext.isConnected);

  return (
    <WalletConnectContext.Provider
      value={{
        accountId,
        setAccountId,
        isConnected,
        setIsConnected,
      }}
    >
      {props.children}
    </WalletConnectContext.Provider>
  );
};
