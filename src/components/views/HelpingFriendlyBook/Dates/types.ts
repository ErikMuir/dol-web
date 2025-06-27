import { Show } from "@erikmuir/dol-lib/types";

export type EraName = "1.0" | "2.0" | "3.0" | "4.0";
export type DateType = "era" | "year" | "month";
export type MonthShows = Record<string, Show[]>;
export type YearMonths = Record<string, MonthShows>;
export type EraYears = Record<string, YearMonths>;
export type DateShowCount = [string, number];
