import Link from "next/link";
import { usePathname } from "next/navigation";
import { twMerge } from "tailwind-merge";
import { Setlist, DolPerformance } from "@erikmuir/dol-lib/types";
import { getSetText, sortByPosition } from "@erikmuir/dol-lib/common/dapp";
import {
  daysUntil,
  toFriendlyDate,
  toFriendlyDateTime,
  sanitizeText,
} from "@erikmuir/dol-lib/common/utils";
import { Loading } from "@/components/common/Loading";
import { useSetlists } from "@/hooks/use-setlists";
import { useReviewsByDate } from "@/hooks/use-reviews";
import { useShow } from "@/hooks/use-shows";
import { usePerformances } from "@/hooks/use-performances";
import { Error } from "../Error";

export const Show = (): React.ReactElement => {
  const pathname = usePathname();
  const pathParts = pathname.split("/");
  const date = pathParts.at(-1) ?? "";
  const { performances, performancesLoading } = usePerformances(date);
  const { setlists, setlistsLoading } = useSetlists(date);
  const { reviews } = useReviewsByDate(date);
  const { show } = useShow(date);
  const daysUntilShow = daysUntil(date);

  if (daysUntilShow >= 0) {
    return (
      <Error
        message={`Just ${daysUntilShow} ${
          daysUntilShow === 1 ? "day" : "days"
        } left!`}
      />
    );
  }

  if (setlistsLoading) {
    return <Loading showLyric />;
  }

  if (!setlists || setlists.length === 0) {
    return <Error code={404} message="Show not found" />;
  }

  const getShowHeader = (): React.ReactNode => {
    const { showDate, venue, city, state, country } = setlists[0];
    return (
      <div className="flex flex-col items-center text-center pb-6">
        <div className="text-2xl">{toFriendlyDate(showDate)}</div>
        <div className="">{sanitizeText(venue)}</div>
        <div className="">{sanitizeText(`${city}, ${state || country}`)}</div>
      </div>
    );
  };

  const getDistinctSets = (): string[] => [
    ...new Set(setlists.sort(sortByPosition).map((setlist) => setlist.set)),
  ];

  const getSongText = (setlist: Setlist) => {
    const { song, transition, transMark } = setlist;
    return (
      <div>
        {song}
        {transition !== 1 ? transMark : ""}
      </div>
    );
  };

  const getMintStatusText = (performance: DolPerformance) => {
    switch (true) {
      case performance === undefined:
        return null;
      case Boolean(performance.serial):
        return "Claimed";
      case Boolean(
        performance.lockedUntil && performance.lockedUntil > Date.now()
      ):
        return "Locked";
      default:
        return "Available";
    }
  };

  const getMintStatusDiv = (setlist: Setlist) => {
    if (performancesLoading) {
      return (
        <div className="relative pr-4">
          <Loading sizeInPixels={20} />
        </div>
      );
    }
    const { showDate, position } = setlist;
    const performance = performances?.find(
      (x) => x.showDate === showDate && x.position === position
    );
    if (!performance) return null;
    const mintStatus = getMintStatusText(performance);
    return (
      <div
        className={twMerge(
          "uppercase tracking-widest text-xs text-gray-medium",
          performance.serial ? "text-dol-yellow" : "text-dol-green"
        )}
      >
        {mintStatus}
      </div>
    );
  };

  const getSongRow = (setlist: Setlist) => {
    const { id, showDate, position } = setlist;
    const href = `/setlists/${showDate}/${position}`;
    return (
      <div
        key={id}
        className="border-t border-gray-dark-2 cursor-pointer hover:bg-gray-dark-2"
      >
        <Link href={href}>
          <div className="p-3 px-4 flex items-center justify-between">
            {getSongText(setlist)}
            {getMintStatusDiv(setlist)}
          </div>
        </Link>
      </div>
    );
  };

  return (
    <div className="w-[320px] md:w-[500px] lg:w-[680px] mx-auto flex flex-col items-center mt-8">
      {getShowHeader()}
      <div className="flex flex-col items-center gap-8 pb-16 w-full">
        {getDistinctSets().map((set) => {
          return (
            <div
              key={set}
              className="w-full bg-gray-dark rounded overflow-hidden"
            >
              <div className="bg-dol-blue uppercase tracking-widest text-center text-sm rounded-t p-1">
                {getSetText(set)}
              </div>
              {setlists
                .filter((s) => s.set === set)
                .sort(sortByPosition)
                .map((setlist) => getSongRow(setlist))}
            </div>
          );
        })}
      </div>
      {show && show.setlistNotes && (
        <div className="flex flex-col items-center gap-4 pb-16">
          <div className="text-2xl uppercase tracking-widest text-center">
            Setlist Notes
          </div>
          <div>{sanitizeText(show.setlistNotes)}</div>
        </div>
      )}
      {reviews && reviews.length > 0 && (
        <div className="flex flex-col items-center gap-8">
          <div className="text-2xl uppercase tracking-widest">Reviews</div>
          {reviews.map((review) => (
            <div
              key={review.id}
              className="bg-gray-dark p-6 md:p-8 rounded w-full"
            >
              <div className="text-sm">{sanitizeText(review.reviewText)}</div>
              <div className="text2xl text-right pt-2">
                -- {review.username}
              </div>
              <div className="text-xs text-right">
                {toFriendlyDateTime(review.postedAt)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
