import Link from "next/link";
import { usePathname } from "next/navigation";
import { twMerge } from "tailwind-merge";

export enum FilterType {
  Date = "Dates",
  Song = "Songs",
  Location = "Locations",
}

export type FilterTypePickerProps = {
  disabled?: boolean;
};

export const FilterTypePicker = ({
  disabled,
}: FilterTypePickerProps): React.ReactElement => {
  const pathname = usePathname();
  const baseOptionClassName =
    "py-1 w-1/3 text-center cursor-pointer transition duration-250 border-x border-gray-dark-2";
  return (
    <div className="w-80 mx-auto rounded-full bg-gray-dark border border-gray-dark-2 flex items-center">
      <Link
        href="/helping-friendly-book/dates"
        aria-disabled={disabled}
        tabIndex={disabled ? -1 : undefined}
        className={twMerge(
          baseOptionClassName,
          "rounded-l-full",
          pathname.startsWith("/helping-friendly-book/dates") ? "bg-dol-blue" : "hover:bg-gray-dark-2",
          disabled ? "pointer-events-none" : ""
        )}
      >
        {FilterType.Date}
      </Link>
      <Link
        href="/helping-friendly-book/locations"
        aria-disabled={disabled}
        tabIndex={disabled ? -1 : undefined}
        className={twMerge(
          baseOptionClassName,
          pathname.startsWith("/helping-friendly-book/locations") ? "bg-dol-blue" : "hover:bg-gray-dark-2",
          disabled ? "pointer-events-none" : ""
        )}
      >
        {FilterType.Location}
      </Link>
      <Link
        href="/helping-friendly-book/songs"
        aria-disabled={disabled}
        tabIndex={disabled ? -1 : undefined}
        className={twMerge(
          baseOptionClassName,
          "rounded-r-full",
          pathname.startsWith("/helping-friendly-book/songs") ? "bg-dol-blue" : "hover:bg-gray-dark-2",
          disabled ? "pointer-events-none" : ""
        )}
      >
        {FilterType.Song}
      </Link>
    </div>
  );
};
