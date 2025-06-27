"use client";

import useSWR from "swr";
import { Review } from "@erikmuir/dol-lib/types";
import { fetchStandardJson } from "@/utils";

export function useReviewsByDate(date: string) {
  const { data, isLoading, error } = useSWR<Review[]>(
    `/api/reviews/${date}`,
    fetchStandardJson
  );
  return { reviews: data, reviewsLoading: isLoading, reviewsError: error };
}
