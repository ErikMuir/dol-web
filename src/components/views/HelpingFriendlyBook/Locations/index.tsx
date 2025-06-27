import { useCallback } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useShowsByVenue } from "@/hooks/use-shows";
import { Loading } from "@/components/common/Loading";
import { ViewModel } from "./ViewModel";

export const Locations = (): React.ReactElement => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { showsByVenue, showsLoading } = useShowsByVenue();

  const currentCountry = searchParams.get("country") || undefined;
  const currentState = searchParams.get("state") || undefined;
  const currentCity = searchParams.get("city") || undefined;
  const currentVenue = searchParams.get("venue") || undefined;

  const jumpTo = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      switch (name) {
        case "country":
          params.delete("venue");
          params.delete("city");
          params.delete("state");
          break;
        case "state":
          params.delete("venue");
          params.delete("city");
          break;
        case "city":
          params.delete("venue");
          break;
      }
      params.set(name, value);
      router.push(pathname + "?" + params.toString());
    },
    [searchParams, pathname, router]
  );

  if (showsLoading || !showsByVenue) {
    return <Loading showLyric />;
  }

  const viewModel = new ViewModel(
    showsByVenue,
    jumpTo,
    currentCountry,
    currentState,
    currentCity,
    currentVenue
  );

  return viewModel.component;
};
