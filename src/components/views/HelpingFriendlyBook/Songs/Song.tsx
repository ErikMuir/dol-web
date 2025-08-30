import { usePathname } from "next/navigation";
import { useSetlistsBySongSlug } from "@/hooks";
import { Loading } from "@/components/common/Loading";
import Link from "next/link";
import { twMerge } from "tailwind-merge";
import { toFriendlyDate } from "@erikmuir/dol-lib/common/utils";
import { getVenueLocation } from "@erikmuir/dol-lib/common/dapp";

export const Song = (): React.ReactElement => {
  const pathname = usePathname();
  const pathParts = pathname.split("/");
  const slug = pathParts.at(-1) ?? "";

  const { setlists, setlistsLoading } = useSetlistsBySongSlug(slug);

  if (setlistsLoading) {
    return <Loading />
  }

  if (!setlists || setlists.length === 0) {
    return <div className="text-center text-lg text-dol-red">No performances found</div>;
  }

  const setlistItems = setlists.map((setlist, index) => {
    const { showDate, position, venue, city, state, country } = setlist;
    return (
      <Link
        key={index}
        href={`/shows/${showDate}/${position}`}
        className={twMerge(
          "flex flex-col p-2 w-full",
          "border-b border-gray-dark",
          index === 0 && "border-t",
          "hover:bg-gray-dark duration-300",
        )}
      >
        <div className="text-lg text-center text-balance">
          {toFriendlyDate(showDate)}
        </div>
        <div className="text-sm text-center text-balance text-dol-yellow/75">
          {venue}, {getVenueLocation(city, state, country)}
        </div>
      </Link>
    );
  });

  return (
    <div className="w-80 mt-4 mx-auto flex flex-col">
      <div className="mb-8">
        <div className="text-center text-4xl text-balance">
          {setlists[0].song}
        </div>
        <div className="text-center text-sm text-gray-medium">
          {setlists?.length} Performances Found
        </div>
      </div>
      <div className="flex flex-col items-center justify-center">
        {setlistItems}
      </div>
    </div>
  );
};