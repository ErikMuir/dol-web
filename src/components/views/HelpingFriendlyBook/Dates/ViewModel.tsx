import { Show } from "@erikmuir/dol-lib/types";
import { getMonthName } from "@erikmuir/dol-lib/common/utils";
import { NoShowsFound } from "@/components/common/NoShowsFound";
import { ShowsForMonth } from "@/components/views/HelpingFriendlyBook/Dates/ShowsForMonth";
import {
  DateShowCount,
  DateType,
  EraName,
  EraYears,
  MonthShows,
  YearMonths,
} from "./types";
import { Date } from "./Date";

export class ViewModel {
  private currentEra?: string;
  private currentYear?: string;
  private currentMonth?: string;
  private currentDate: string;
  private listItemType: DateType;
  private eraYears: EraYears;
  private yearMonths: YearMonths;
  private monthShows: MonthShows;
  private shows: Show[];
  private listItems: DateShowCount[];
  private jumpTo: (name: string, value: string) => void;

  public component: React.ReactElement;

  constructor(
    shows: Show[],
    jumpTo: (name: string, value: string) => void,
    currentEra?: string,
    currentYear?: string,
    currentMonth?: string
  ) {
    this.currentEra = currentEra;
    this.currentYear = currentYear;
    this.currentMonth = currentMonth;
    this.currentDate = currentMonth || currentYear || currentEra || "Eras";
    this.listItemType = currentYear ? "month" : currentEra ? "year" : "era";
    this.jumpTo = jumpTo;
    this.eraYears = this.mapEraYears(shows);
    this.yearMonths = this.eraYears[currentEra ?? ""] ?? {};
    this.monthShows = this.yearMonths[currentYear ?? ""] ?? {};
    this.shows = this.monthShows[currentMonth ?? ""] ?? [];
    this.shows.sort(this.showsByDate);
    this.listItems = currentMonth
      ? []
      : this.currentYear
      ? this.getTargetsForYear()
      : this.currentEra
      ? this.getTargetsForEra()
      : this.getTargetsForEras();
    this.component = this.getCurrentDate();
  }

  private getCurrentDate = (): React.ReactElement => {
    const noShowsFound = this.currentMonth
      ? this.shows.length === 0
      : this.listItems.length === 0;
    const content: React.ReactElement = noShowsFound ? (
      <NoShowsFound header={this.currentDate} />
    ) : this.currentMonth ? (
      <ShowsForMonth
        header={getMonthName(this.currentDate)}
        shows={this.shows}
      />
    ) : (
      <Date
        name={this.currentDate}
        dateType={this.listItemType}
        targets={this.listItems}
        jumpTo={this.jumpTo}
      />
    );
    return content;
  };

  private getEra = (year: string): EraName => {
    const yearInt = parseInt(year);
    if (yearInt <= 2000) return "1.0";
    if (yearInt <= 2004) return "2.0";
    if (yearInt <= 2020) return "3.0";
    return "4.0";
  };

  private mapEraYears = (shows: Show[]): EraYears => {
    const eraYears: EraYears = {};
    for (const show of shows) {
      const [year, month] = show.showDate.split("-");
      const era = this.getEra(year);
      if (!eraYears[era]) eraYears[era] = {};
      if (!eraYears[era][year]) eraYears[era][year] = {};
      if (!eraYears[era][year][month]) eraYears[era][year][month] = [];
      eraYears[era][year][month].push(show);
    }
    return eraYears;
  };

  private getShowCountByMonth = (
    era = "",
    year = "",
    month: string
  ): number => {
    return this.eraYears[era][year][month].length;
  };

  private getShowCountByYear = (era = "", year: string): number =>
    Object.keys(this.eraYears[era][year])
      .map((month) => this.getShowCountByMonth(era, year, month))
      .reduce((acc, val) => acc + val, 0);

  private getShowCountByEra = (era: string): number =>
    Object.keys(this.eraYears[era])
      .map((year) => this.getShowCountByYear(era, year))
      .reduce((acc, val) => acc + val, 0);

  private getTargetsForEras = (): DateShowCount[] => {
    const targets: DateShowCount[] = Object.keys(this.eraYears).map((era) => [
      era,
      this.getShowCountByEra(era),
    ]);
    targets.sort(this.datesByName);
    return targets;
  };

  private getTargetsForEra = (): DateShowCount[] => {
    const targets: DateShowCount[] = Object.keys(
      this.eraYears[this.currentEra ?? ""]
    ).map((year) => [year, this.getShowCountByYear(this.currentEra, year)]);
    targets.sort(this.datesByName);
    return targets;
  };

  private getTargetsForYear = (): DateShowCount[] => {
    const targets: DateShowCount[] = Object.keys(
      this.eraYears[this.currentEra ?? ""][this.currentYear ?? ""]
    ).map((month) => [
      month,
      this.getShowCountByMonth(this.currentEra, this.currentYear, month),
    ]);
    targets.sort(this.datesByName);
    return targets;
  };

  private datesByName = (a: DateShowCount, b: DateShowCount): number => {
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
