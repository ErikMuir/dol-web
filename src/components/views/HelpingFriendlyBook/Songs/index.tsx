import { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";
import { Song } from "@erikmuir/dol-lib/types";
import { SearchBar } from "@/components/common/SearchBar";
import { useSongs } from "@/hooks";
import Link from "next/link";
import { Loading } from "@/components/common/Loading";

export const Songs = (): React.ReactElement => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<Song[]>([]);
  const { songs, songsLoading } = useSongs();

  useEffect(() => {
    if (!songs || songs.length === 0 || !searchTerm || searchTerm.length < 3) {
      setSearchResults([]);
    } else {
      const normalizedSearchTerm = searchTerm.toLowerCase();
      const results = songs.filter((s) => {
        const normalizedName = s.name?.toLowerCase() ?? "";
        return normalizedName.includes(normalizedSearchTerm);
      });
      setSearchResults(results);
    }
  }, [songs, searchTerm]);

  const getContent = () => {
    if (songsLoading) {
      return <Loading />;
    }

    if (searchTerm.length < 3) {
      return <div className="text-center text-gray-dark">Please enter at least 3 characters</div>;
    }

    if (searchResults.length === 0) {
      return <div className="text-center text-gray-dark">No results found</div>;
    }

    return searchResults.map((song, index) => {
      return (
        <Link
          key={index}
          href={`/helping-friendly-book/songs/${song.slug}`}
          className={twMerge(
            "flex flex-col p-2",
            "border-b border-gray-dark",
            index === 0 && "border-t",
            "hover:bg-gray-dark duration-300",
          )}
        >
          <div className="text-xl text-center text-balance">{song.name}</div>
          <div className="text-sm text-center text-dol-yellow/75">{song.artist}</div>
        </Link>
      );
    });
  };

  return (
    <div className="w-80 mt-4 mx-auto flex flex-col">
      <SearchBar
        value={searchTerm}
        onChange={setSearchTerm}
        placeholder="Search song titles..."
        disabled={songsLoading}
      />
      <div className="flex flex-col w-full mt-8">{getContent()}</div>
    </div>
  );
};
