"use client";

import useSWR from "swr";
import { Setlist } from "@erikmuir/dol-lib/types";
import { fetchStandardJson } from "@/utils";

export function useSetlists(date: string) {
  const { data, isLoading, error } = useSWR<Setlist[]>(
    `/api/setlists/${date}`,
    fetchStandardJson
  );
  return { setlists: data, setlistsLoading: isLoading, setlistsError: error };
}

export function useSetlistsBySongId(songId: number | string) {
  const { data, isLoading, error } = useSWR<Setlist[]>(
    `/api/songs/${songId}/setlists`,
    fetchStandardJson
  );
  return { setlists: data, setlistsLoading: isLoading, setlistsError: error };
}

export function useSetlist(date: string, position: string) {
  const { data, isLoading, error } = useSWR<Setlist>(
    `/api/setlists/${date}/${position}`,
    fetchStandardJson
  );
  return { setlist: data, setlistLoading: isLoading, setlistError: error };
}
