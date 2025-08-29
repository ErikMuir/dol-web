"use client";

import useSWR from "swr";
import { Song } from "@erikmuir/dol-lib/types";
import { fetchStandardJson } from "@/utils";

export function useSong(songId?: number | string) {
  const { data, isLoading, error } = useSWR<Song>(
    songId ? `/api/songs/${songId}` : null,
    fetchStandardJson,
    {
      // Prevents fetching when songId is null
      shouldRetryOnError: false,
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  return { song: data, songLoading: isLoading, songError: error };
}

export function useSongs() {
  const { data, isLoading, error } = useSWR<Song[]>('/api/songs', fetchStandardJson);
  return { songs: data, songsLoading: isLoading, songsError: error };
}
