import { twMerge } from "tailwind-merge";
import { DolColorExtended, DolSize } from "./types";
import Link from "next/link";

export interface DolButtonProps {
  size?: DolSize;
  color?: DolColorExtended;
  href?: string;
  roundedFull?: boolean;
  outline?: boolean;
  className?: string;
  onClick?: () => void;
  children?: React.ReactNode;
};

export const DolButton = ({
  size = "md",
  color = "gray",
  href,
  roundedFull = false,
  outline = false,
  className = "",
  onClick,
  children
}: DolButtonProps) => {
  const mergedClassName = buildClassName(size, roundedFull, color, outline, className);
  return href
    ? <Link href={href} className={mergedClassName} onClick={onClick}>{children}</Link>
    : <button type="button" className={mergedClassName} onClick={onClick}>{children}</button>;
};

function buildClassName(
  size: DolSize,
  roundedFull: boolean,
  color: DolColorExtended,
  outline: boolean,
  className: string) {

  let backgroundColor = "";
  let backgroundHoverColor = "";
  let borderColor = "";

  switch (color) {
    case "blue":
      backgroundColor = "bg-dol-blue/50";
      backgroundHoverColor = "hover:bg-dol-blue/75";
      borderColor = "border-dol-blue";
      break;
    case "green":
      backgroundColor = "bg-dol-green/50";
      backgroundHoverColor = "hover:bg-dol-green/75";
      borderColor = "border-dol-green";
      break;
    case "red":
      backgroundColor = "bg-dol-red/50";
      backgroundHoverColor = "hover:bg-dol-red/75";
      borderColor = "border-dol-red";
      break;
    case "yellow":
      backgroundColor = "bg-dol-yellow/50";
      backgroundHoverColor = "hover:bg-dol-yellow/75";
      borderColor = "border-dol-yellow";
      break;
    case "dark":
      backgroundColor = "bg-dol-dark/50";
      backgroundHoverColor = "hover:bg-dol-dark/75";
      borderColor = "border-dol-dark";
      break;
    case "light":
      backgroundColor = "bg-dol-light/50";
      backgroundHoverColor = "hover:bg-dol-light/75";
      borderColor = "border-dol-light";
      break;
    default:
      backgroundColor = "bg-gray-medium/25";
      backgroundHoverColor = "hover:bg-gray-medium";
      borderColor = "border-gray-medium";
      break;
  }

  let sizeClasses = "";

  switch (size) {
    case "sm": sizeClasses = "text-xs py-1 tracking-wide"; break;
    case "md": sizeClasses = "text-xs py-2 tracking-wider"; break;
    case "lg": sizeClasses = "text-lg py-3 tracking-widest"; break;
    default: sizeClasses = ""; break;
  }

  return twMerge(
    sizeClasses,
    "w-full px-4",
    roundedFull ? "rounded-full" : "rounded",
    color === "light"
      ? "text-dol-dark/50 hover:text-dol-dark"
      : "text-dol-light hover:text-white",
    "text-center uppercase",
    outline ? "bg-transparent" : backgroundColor,
    backgroundHoverColor,
    "duration-500",
    outline ? `border ${borderColor}` : "",
    className
  );
}
