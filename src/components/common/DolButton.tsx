import { twMerge } from "tailwind-merge";
import { DolColorExtended, DolSize } from "./types";
import Link from "next/link";

export interface DolButtonProps {
  size?: DolSize;
  color?: DolColorExtended;
  href?: string;
  roundedFull?: boolean;
  className?: string;
  onClick?: () => void;
  children?: React.ReactNode;
};

export const DolButton = ({
  size = "md",
  color = "gray",
  href,
  roundedFull = false,
  className,
  onClick,
  children
}: DolButtonProps) => {

  className = twMerge(
    getSizeClasses(size),
    getColorClasses(color),
    roundedFull ? "rounded-full" : "rounded",
    "duration-500 w-full text-center uppercase px-4",
    className);

  return href
    ? <Link href={href} className={className} onClick={onClick}>{children}</Link>
    : <button type="button" className={className} onClick={onClick}>{children}</button>;
};

function getColorClasses(color: DolColorExtended): string {
  switch (color) {
    case "blue":
    case "green":
    case "red":
    case "yellow":
      return twMerge(`hover:text-white bg-dol-${color}/50 hover:bg-dol-${color}/75`);
    case "dark":
      return twMerge(`hover:text-white bg-dol-dark/50 hover:bg-dol-light/10 border border-gray-dark-2`);
    case "light":
      return twMerge(`hover:text-dol-dark/50 bg-dol-light/50 hover:bg-dol-light`);
    case "gray":
      return twMerge(`hover:text-white bg-gray-medium/25 hover:bg-gray-medium/50`);
    default:
      return "";
  }
}

function getSizeClasses(size: DolSize): string {
  switch (size) {
    case "sm":
      return twMerge("text-xs py-1 tracking-wide");
    case "md":
      return twMerge("text-xs py-2 tracking-wider");
    case "lg":
      return twMerge("text-lg py-3 tracking-widest");
    default:
      return "";
  }
}