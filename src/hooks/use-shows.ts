"use client";

import { useEffect, useState } from "react";
import useSWR from "swr";
import { sortByShowDate } from "@erikmuir/dol-lib/dapp";
import { Show } from "@erikmuir/dol-lib/types";
import { padLeft } from "@erikmuir/dol-lib/utils";
import { fetchStandardJson } from "@/utils";

export function useShows() {
  const { data, isLoading, error } = useSWR<Show[]>(
    "/api/shows",
    fetchStandardJson
  );
  return { shows: data, showsLoading: isLoading, showsError: error };
}

export function useShow(date: string) {
  const { data, isLoading, error } = useSWR<Show>(
    date ? `/api/shows/${date}` : null,
    fetchStandardJson
  );
  return { show: data, showLoading: isLoading, showError: error };
}

export function useShowsByDate() {
  const [showsByDate, setShowsByDate] = useState<ShowsDateDict>();
  const { shows, showsLoading, showsError } = useShows();

  useEffect(() => {
    if (!shows) return;
    const dict: ShowsDateDict = {};
    for (const show of shows) {
      const { showYear: year, showMonth, showDay } = show;
      const month = padLeft(`${showMonth}`, 2);
      const day = padLeft(`${showDay}`, 2);
      if (!dict[year]) dict[year] = {};
      if (!dict[year][month]) dict[year][month] = {};
      if (!dict[year][month][day]) dict[year][month][day] = show;
    }
    setShowsByDate(dict);
  }, [shows]);

  return {
    showsByDate,
    showsLoading,
    showsError,
  };
}

export function useShowsByVenue() {
  const [showsByVenue, setShowsByVenue] = useState<ShowsVenueDict>({});
  const { shows, showsLoading, showsError } = useShows();

  useEffect(() => {
    if (!shows) return;
    const dict: ShowsVenueDict = {};
    for (const show of shows) {
      const { venue } = show;
      if (!dict[venue]) dict[venue] = [];
      dict[venue].push(show);
      dict[venue].sort(sortByShowDate); // is this needed?
    }
    setShowsByVenue(dict);
  }, [shows]);

  return {
    showsByVenue,
    showsLoading,
    showsError,
  };
}

export type Days = Record<string, Show>;
export type Months = Record<string, Days>;
export type ShowsDateDict = Record<string, Months>;
export type ShowsVenueDict = Record<string, Show[]>;
