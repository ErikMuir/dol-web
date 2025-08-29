import { usePathname } from "next/navigation";
import { useSetlistsBySongSlug } from "@/hooks";
import { Loading } from "@/components/common/Loading";

export const Song = (): React.ReactElement => {
  const pathname = usePathname();
  const pathParts = pathname.split("/");
  const slug = pathParts.at(-1) ?? "";

  const { setlists, setlistsLoading, setlistsError } = useSetlistsBySongSlug(slug);

  if (setlistsLoading) {
    return <Loading />
  }

  if (!setlists || setlists.length === 0) {
    return <div className="text-center text-lg text-dol-red">No performances found</div>;
  }

  const setlistItems = setlists.map((setlist) => {
    return <div key={setlist.id}>{setlist.showDate}</div>;
  });

  return (
    <div className="w-96 mt-4 mx-auto flex flex-col">
      <div className="mb-8">
        <div className="text-center text-2xl">{setlists[0].song}</div>
        <div className="text-center text-sm text-gray-medium">{setlists?.length} Performances Found</div>
      </div>
      <div className="flex flex-col items-center justify-center">
        {setlistItems}
      </div>
    </div>
  );
};