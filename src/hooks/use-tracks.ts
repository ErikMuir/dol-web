"use client";

import useSWR from "swr";
import { Track } from "@erikmuir/dol-lib/types";
import { fetchStandardJson } from "@/utils";
import { useEffect, useState } from "react";

export function useTrack(date: string, position: number) {
  const [track, setTrack] = useState<Track>();
  const { tracks, tracksLoading, tracksError } = useTracks(date);
  useEffect(() => {
    if (tracks) {
      const foundTrack = tracks.find((t) => t.position === position);
      setTrack(foundTrack);
    }
  }, [tracks, position]);
  return { track, trackLoading: tracksLoading, trackError: tracksError };
}

export function useTracks(date: string) {
  const { data, isLoading, error } = useSWR<Track[]>(
    `/api/tracks/${date}`,
    fetchStandardJson
  );
  return { tracks: data, tracksLoading: isLoading, tracksError: error };
}
