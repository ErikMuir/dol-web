import "dotenv/config";

export const isWhiteList = (accountId: string | null): boolean => {
  return accountId ? `${process.env.NEXT_PUBLIC_WHITE_LIST}`.includes(accountId) : false;
};
