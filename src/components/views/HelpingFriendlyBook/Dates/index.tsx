import { useCallback } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useShows } from "@/hooks/use-shows";
import { Loading } from "@/components/common/Loading";
import { ViewModel } from "./ViewModel";

export const Dates = (): React.ReactElement => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { shows, showsLoading } = useShows();

  const currentEra = searchParams.get("era") || undefined;
  const currentYear = searchParams.get("year") || undefined;
  const currentMonth = searchParams.get("month") || undefined;

  const jumpTo = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      switch (name) {
        case "era":
          params.delete("month");
          params.delete("year");
          break;
        case "year":
          params.delete("month");
          break;
      }
      params.set(name, value);
      router.push(pathname + "?" + params.toString());
    },
    [searchParams, pathname, router]
  );

  if (showsLoading || !shows) {
    return <Loading showLyric />;
  }

  const viewModel = new ViewModel(
    shows,
    jumpTo,
    currentEra,
    currentYear,
    currentMonth
  );

  return viewModel.component;
};
