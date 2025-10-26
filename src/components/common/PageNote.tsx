import { getTwDolColor } from "@erikmuir/dol-lib/dapp";
import { DolColor, TwColorClassPrefix } from "@erikmuir/dol-lib/types";
import { twMerge } from "tailwind-merge";

interface PageNoteProps {
  color?: DolColor;
  className?: string;
  children?: React.ReactNode;
}

export const PageNote = ({
  color = "dark",
  className,
  children,
}: PageNoteProps) => {
  const isDark = color === "dark";
  const adjustedColor = isDark ? "light" : color;
  const borderPercentage = isDark ? 25 : 100;
  const bgPercentage = isDark ? 10 : 50;
  return (
    <div className={twMerge(
      "flex flex-col gap-2",
      "w-full py-2 px-3 text-sm rounded-md border border-transparent",
      getTwDolColor(adjustedColor, TwColorClassPrefix.Border, borderPercentage),
      getTwDolColor(adjustedColor, TwColorClassPrefix.Background, bgPercentage),
      className,
    )}>
      {children}
    </div>);
};
