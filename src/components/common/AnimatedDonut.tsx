import { twMerge } from "tailwind-merge";
import { DolColorClass } from "@erikmuir/dol-lib/types";
import { getDolBorderColorClass } from "@erikmuir/dol-lib/common/dapp";

type AnimatedDonutProps = {
  sizeInPixels?: number;
  color?: DolColorClass;
  twAnimation?: string;
  className?: string;
};

export const AnimatedDonut = ({
  sizeInPixels = 60,
  color = "dol-red",
  twAnimation = "animate-spin border-l-gray-dark",
  className,
}: AnimatedDonutProps): React.ReactElement => {
  const borderColor = getDolBorderColorClass(color);
  return (
    <div
      className={twMerge("rounded-full", borderColor, twAnimation, className)}
      style={{
        width: `${sizeInPixels}px`,
        height: `${sizeInPixels}px`,
        borderWidth: `${Math.floor(sizeInPixels / 4)}px`,
      }}
    />
  );
};
