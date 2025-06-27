import { Show } from "@erikmuir/dol-lib/types";
import { getStateName } from "@erikmuir/dol-lib/common/dapp";
import { ShowsVenueDict } from "@/hooks/use-shows";
import { NoShowsFound } from "@/components/common/NoShowsFound";
import {
  CityVenues,
  CountryStates,
  LocationShowCount,
  LocationType,
  StateCities,
  VenueShows,
} from "./types";
import { Location } from "./Location";
import { ShowsForVenue } from "@/components/views/HelpingFriendlyBook/Locations/ShowsForVenue";

export class ViewModel {
  private currentCountry?: string;
  private currentState?: string;
  private currentCity?: string;
  private currentVenue?: string;
  private currentLocation: string;
  private listItemType: LocationType;
  private countryStates: CountryStates;
  private stateCities: StateCities;
  private cityVenues: CityVenues;
  private venueShows: VenueShows;
  private shows: Show[];
  private listItems: LocationShowCount[];
  private jumpTo: (name: string, value: string) => void;

  public component: React.ReactElement;

  constructor(
    showsByVenue: ShowsVenueDict,
    jumpTo: (name: string, value: string) => void,
    currentCountry?: string,
    currentState?: string,
    currentCity?: string,
    currentVenue?: string
  ) {
    this.currentCountry = currentCountry;
    this.currentState = currentState;
    this.currentCity = currentCity;
    this.currentVenue = currentVenue;
    this.currentLocation =
      currentVenue || currentCity || currentState || currentCountry || "Earth";
    this.listItemType = currentCity
      ? "venue"
      : currentState || (currentCountry && currentCountry !== "USA")
      ? "city"
      : currentCountry
      ? "state"
      : "country";
    this.jumpTo = jumpTo;
    this.countryStates = this.mapCountryStates(showsByVenue);
    this.stateCities = this.countryStates[currentCountry ?? ""] ?? {};
    this.cityVenues = this.stateCities[currentState ?? ""] ?? {};
    this.venueShows = this.cityVenues[currentCity ?? ""] ?? {};
    this.shows = this.venueShows[currentVenue ?? ""] ?? [];
    this.shows.sort(this.showsByDate);
    this.listItems = currentVenue
      ? []
      : this.currentCity
      ? this.getTargetsForCity()
      : this.currentState
      ? this.getTargetsForState()
      : this.currentCountry
      ? this.getTargetsForCountry()
      : this.getTargetsForEarth();
    this.component = this.getCurrentLocation();
  }

  private getCurrentLocation = (): React.ReactElement => {
    const noShowsFound = this.currentVenue
      ? this.shows.length === 0
      : this.listItems.length === 0;
    const content: React.ReactElement = noShowsFound ? (
      <NoShowsFound header={this.currentLocation} />
    ) : this.currentVenue ? (
      <ShowsForVenue header={this.currentLocation} shows={this.shows} />
    ) : (
      <Location
        name={this.currentLocation}
        locationType={this.listItemType}
        targets={this.listItems}
        jumpTo={this.jumpTo}
      />
    );
    return content;
  };

  private mapCountryStates = (showsByVenue: ShowsVenueDict): CountryStates => {
    const countryStates: CountryStates = {};
    for (const venue of Object.keys(showsByVenue)) {
      let { city, state, country } = showsByVenue[venue][0];
      state ??= "";
      state = getStateName(state);
      if (!countryStates[country]) countryStates[country] = {};
      if (!countryStates[country][`${state}`])
        countryStates[country][`${state}`] = {};
      if (!countryStates[country][`${state}`][city])
        countryStates[country][`${state}`][city] = {};
      countryStates[country][`${state}`][city][venue] = showsByVenue[venue];
    }
    return countryStates;
  };

  private getShowCountByVenue = (
    country: string = "",
    state: string = "",
    city: string = "",
    venue: string
  ): number => {
    return this.countryStates[country][state][city][venue].length;
  };

  private getShowCountByCity = (
    country: string = "",
    state: string = "",
    city: string
  ): number =>
    Object.keys(this.countryStates[country][state][city])
      .map((venue) => this.getShowCountByVenue(country, state, city, venue))
      .reduce((acc, val) => acc + val, 0);

  private getShowCountByState = (country: string = "", state: string): number =>
    Object.keys(this.countryStates[country][state])
      .map((city) => this.getShowCountByCity(country, state, city))
      .reduce((acc, val) => acc + val, 0);

  private getShowCountByCountry = (country: string): number =>
    Object.keys(this.countryStates[country])
      .map((state) => this.getShowCountByState(country, state))
      .reduce((acc, val) => acc + val, 0);

  private getTargetsForEarth = (): LocationShowCount[] => {
    const targets: LocationShowCount[] = Object.keys(this.countryStates).map(
      (x) => [x, this.getShowCountByCountry(x)]
    );
    targets.sort(this.locationsByShowCount);
    return targets;
  };

  private getTargetsForCountry = (): LocationShowCount[] => {
    const targets: LocationShowCount[] =
      this.currentCountry === "USA"
        ? Object.keys(this.stateCities).map((state) => [
            state,
            this.getShowCountByState(this.currentCountry, state),
          ])
        : Object.keys(this.cityVenues).map((city) => [
            city,
            this.getShowCountByCity(this.currentCountry, "", city),
          ]);
    targets.sort(this.locationsByName);
    return targets;
  };

  private getTargetsForState = (): LocationShowCount[] => {
    const targets: LocationShowCount[] = Object.keys(this.cityVenues).map(
      (city) => [
        city,
        this.getShowCountByCity(this.currentCountry, this.currentState, city),
      ]
    );
    targets.sort(this.locationsByName);
    return targets;
  };

  private getTargetsForCity = (): LocationShowCount[] => {
    const targets: LocationShowCount[] = Object.keys(this.venueShows).map(
      (venue) => [
        venue,
        this.getShowCountByVenue(
          this.currentCountry,
          this.currentState,
          this.currentCity,
          venue
        ),
      ]
    );
    targets.sort(this.locationsByName);
    return targets;
  };

  private locationsByShowCount = (
    a: LocationShowCount,
    b: LocationShowCount
  ): number => {
    if (a[1] > b[1]) return -1;
    if (a[1] < b[1]) return 1;
    return 0;
  };

  private locationsByName = (
    a: LocationShowCount,
    b: LocationShowCount
  ): number => {
    if (a[0] > b[0]) return 1;
    if (a[0] < b[0]) return -1;
    return 0;
  };

  private showsByDate = (a: Show, b: Show): number => {
    if (a.showDate > b.showDate) return 1;
    if (a.showDate < b.showDate) return -1;
    return 0;
  };
}
