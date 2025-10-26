"use client";

import useSWR from "swr";
import { NftMetadata, MirrorNft } from "@erikmuir/dol-lib/types";
import { fetchStandardJson } from "@/utils";
import { sortBySerialAscending } from "@erikmuir/dol-lib/dapp";

export function useIsTokenAssociated(
  tokenId: string,
  accountId: string | null
) {
  const { data, isLoading, error, mutate } = useSWR<boolean>(
    accountId ? `/api/mirror/accounts/${accountId}/tokens/${tokenId}` : null,
    fetchStandardJson
  );
  return {
    isAssociated: data,
    isAssociatedLoading: isLoading,
    isAssociatedError: error,
    mutateIsAssociated: mutate,
  };
}

export function useAccountNfts(tokenId: string, accountId: string | null) {
  const url = accountId
    ? `/api/mirror/accounts/${accountId}/nfts/${tokenId}`
    : null;
  const { data, isLoading, error } = useSWR<MirrorNft[]>(
    url,
    fetchStandardJson
  );
  return {
    nfts: data?.sort(sortBySerialAscending),
    nftsLoading: isLoading,
    nftsError: error,
  };
}

export function useNftMetadata(tokenId: string, serial?: number) {
  const url = serial ? `/api/mirror/tokens/${tokenId}/nfts/${serial}` : null;
  const { data, isLoading, error } = useSWR<NftMetadata>(
    url,
    fetchStandardJson
  );
  return {
    metadata: data,
    metadataLoading: isLoading,
    metadataError: error,
  };
}
