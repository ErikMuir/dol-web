import { Show } from "@erikmuir/dol-lib/types";

export type LocationType = "country" | "state" | "city" | "venue";
export type VenueShows = Record<string, Show[]>;
export type CityVenues = Record<string, VenueShows>;
export type StateCities = Record<string, CityVenues>;
export type CountryStates = Record<string, StateCities>;
export type LocationShowCount = [string, number];
