import { DolColorClass } from "@erikmuir/dol-lib/types";
import { twMerge } from "tailwind-merge";

interface PageNoteProps {
  color?: DolColorClass;
  className?: string;
  children?: React.ReactNode;
}

export const PageNote = ({
  color = "dol-dark",
  className,
  children,
}: PageNoteProps) => {
  const isDark = color === "dol-dark";
  const adjustedColor = isDark ? "dol-light" : color;
  const borderPercentage = isDark ? 25 : 100;
  const bgPercentage = isDark ? 10 : 50;
  return (
    <div className={twMerge(
      "flex flex-col gap-2",
      "w-full py-2 px-3 text-sm rounded-md border border-transparent",
      getDolColorTwClass("border", adjustedColor, borderPercentage),
      getDolColorTwClass("bg", adjustedColor, bgPercentage),
      className,
    )}>
      {children}
    </div>);
};

// TODO : Move this stuff to the dol-lib

export type TwColorClassType = "bg" | "border" | "text";
export type TwColorClassPercentage = 0 | 10 | 25 | 33 | 50 | 66 | 75 | 100;

export function getDolColorTwClass(
  type: TwColorClassType,
  color: DolColorClass,
  percentage: TwColorClassPercentage = 100
) {
  return percentage === 100 ? `${type}-${color}` : `${type}-${color}/${percentage}`;
}
