import { twMerge } from "tailwind-merge";
import {
  getDolBorderColorClass,
  getDolTextColorClass,
  getDolTranslucentBackgroundColorClass,
  getLabelTextColorClass,
} from "@erikmuir/dol-lib/common/dapp";
import { AnimatedDonut } from "@/components/common/AnimatedDonut";
import { BaseAttributeProps } from "./types";

export type BooleanAttributeProps = BaseAttributeProps & {
  bool?: boolean;
};

export const BooleanAttribute = ({
  label,
  bool = false,
  loading,
  textColor = "dol-light",
  attributeColor,
  fullWidth,
}: BooleanAttributeProps): React.ReactNode => {
  const content = loading ? (
    <AnimatedDonut sizeInPixels={20} className="mt-[2px]" />
  ) : (
    <div>{bool ? "true" : "false"}</div>
  );

  return (
    <div
      className={twMerge(
        "border rounded p-2 whitespace-nowrap text-center self-stretch",
        fullWidth ? "w-full" : "w-fit",
        getDolBorderColorClass(attributeColor),
        getDolTranslucentBackgroundColorClass(attributeColor)
      )}
    >
      {label && (
        <div
          className={twMerge(
            "text-[10px] uppercase",
            getLabelTextColorClass(attributeColor)
          )}
        >
          {label}
        </div>
      )}
      <div
        className={twMerge(
          "flex flex-col items-center justify-center font-mono",
          getDolTextColorClass(textColor)
        )}
      >
        {content}
      </div>
    </div>
  );
};
