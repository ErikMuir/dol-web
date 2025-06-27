import { twMerge } from "tailwind-merge";
import { DolColorClass, LyricLine } from "@erikmuir/dol-lib/types";
import {
  getDolTextColorClass,
  getPseudoRandomDolColorClass,
} from "@erikmuir/dol-lib/common/dapp";

export type LyricProps = {
  lines?: LyricLine[];
  highlightColor?: DolColorClass;
};

export const Lyric = ({
  lines = [],
  highlightColor,
}: LyricProps): React.ReactElement => {
  highlightColor ??= getPseudoRandomDolColorClass();
  const highlightClass = getDolTextColorClass(highlightColor);
  return (
    <div className="flex flex-col items-center justify-center">
      {lines.map((segments, lineIndex) => (
        <div
          className="flex items-center justify-center gap-2"
          key={`line-${lineIndex}`}
        >
          {segments.map((segment, segmentIndex) => (
            <div
              className={twMerge(
                "text-balance",
                segment.highlight ? highlightClass : ""
              )}
              key={`segment-${segmentIndex}`}
            >
              {segment.text}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};
