import "dotenv/config";

////////////////////////////////////////////////////////////
// TODO : Move this stuff to dol-lib

const trueValues = ["true", "1", "yes", "y"];
const falseValues = ["false", "0", "no", "n", ""];
const standardValues = [...trueValues, ...falseValues];

export const envToBoolean = (value: string = "0", strict = false) => {
  const formattedValue = value.trim().toLowerCase();
  if (standardValues.includes(formattedValue)) {
    return trueValues.includes(formattedValue);
  }
  if (strict) {
    throw new Error(`Invalid boolean value in strict mode: ${value}`);
  }
  return Boolean(formattedValue);
};

export const isWhiteList = (accountId: string | null): boolean =>
  accountId ? NEXT_PUBLIC_WHITE_LIST.split(",").includes(accountId) : false;

////////////////////////////////////////////////////////////

export const AWS_ACCESS_KEY_ID = `${process.env.AWS_ACCESS_KEY_ID}`;
export const AWS_REGION = `${process.env.AWS_REGION}`;
export const AWS_SECRET_ACCESS_KEY = `${process.env.AWS_SECRET_ACCESS_KEY}`;
export const CACHE_DURATION_IN_SECONDS = `${process.env.CACHE_DURATION_IN_SECONDS}`;
export const MIRROR_NODE_API_KEY = `${process.env.MIRROR_NODE_API_KEY}`;
export const NEXT_PUBLIC_API_TOKEN = `${process.env.NEXT_PUBLIC_API_TOKEN}`;
export const NEXT_PUBLIC_APP_URL = `${process.env.NEXT_PUBLIC_APP_URL}`;
export const NEXT_PUBLIC_HFB_COLLECTION_ID = `${process.env.NEXT_PUBLIC_HFB_COLLECTION_ID}`;
export const NEXT_PUBLIC_HFB_HBAR_PRICE = `${process.env.NEXT_PUBLIC_HFB_HBAR_PRICE}`;
export const NEXT_PUBLIC_MINT_ENABLED = `${process.env.NEXT_PUBLIC_MINT_ENABLED}`;
export const NEXT_PUBLIC_MIRROR_NODE_URL = `${process.env.NEXT_PUBLIC_MIRROR_NODE_URL}`;
export const NEXT_PUBLIC_NETWORK = `${process.env.NEXT_PUBLIC_NETWORK}`;
export const NEXT_PUBLIC_PROJECT_ID = `${process.env.NEXT_PUBLIC_PROJECT_ID}`;
export const NEXT_PUBLIC_TREASURY_ACCOUNT = `${process.env.NEXT_PUBLIC_TREASURY_ACCOUNT}`;
export const NEXT_PUBLIC_WHITE_LIST = `${process.env.NEXT_PUBLIC_WHITE_LIST}`;
export const PHISH_NET_API_KEY = `${process.env.PHISH_NET_API_KEY}`;
export const PINATA_GATEWAY = `${process.env.PINATA_GATEWAY}`;
export const PINATA_HFB_GROUP_ID = `${process.env.PINATA_HFB_GROUP_ID}`;
export const PINATA_JWT = `${process.env.PINATA_JWT}`;
export const TREASURY_KEY = `${process.env.TREASURY_KEY}`;

export const mintEnabled = envToBoolean(NEXT_PUBLIC_MINT_ENABLED);
