"use client";

import useSWR from "swr";
import { Track } from "@erikmuir/dol-lib/types";
import { fetchStandardJson } from "@/utils";

export function useTrack(date: string, position: string) {
  const { data, isLoading, error } = useSWR<Track>(
    `/api/tracks/${date}/${position}`,
    fetchStandardJson
  );
  return { track: data, trackLoading: isLoading, trackError: error };
}
