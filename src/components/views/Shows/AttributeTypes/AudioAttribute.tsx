import { twMerge } from "tailwind-merge";
import { AnimatedDonut } from "@/components/common/AnimatedDonut";
import {
  getDolAudioPlayerColorClass,
  getDolBorderColorClass,
  getDolTextColorClass,
  getDolTranslucentBackgroundColorClass,
  getLabelTextColorClass,
} from "@erikmuir/dol-lib/common/dapp";
import { BaseAttributeProps } from "./types";

export type AudioAttributeProps = BaseAttributeProps & {
  src?: string;
};

export const AudioAttribute = ({
  label,
  src,
  loading,
  fullWidth,
  textColor = "dol-light",
  attributeColor,
}: AudioAttributeProps): React.ReactNode => {
  const getContent = () => {
    if (loading) {
      return <AnimatedDonut sizeInPixels={20} className="mt-[2px]" />;
    }

    if (!src) {
      return <div className="text-gray-medium">--null--</div>;
    }

    return (
      <div className={twMerge("relative", fullWidth ? "w-full" : "w-[300px]")}>
        <audio
          controls
          className={twMerge(
            getDolAudioPlayerColorClass(attributeColor || textColor),
            getDolTextColorClass(textColor),
            "font-mono"
          )}
        >
          <source src={src} type="audio/mp3" />
          Your browser does not support the audio element.
        </audio>
      </div>
    );
  };

  return (
    <div
      className={twMerge(
        "border rounded p-2 whitespace-nowrap text-center self-stretch",
        fullWidth ? "w-full" : "",
        getDolBorderColorClass(attributeColor),
        getDolTranslucentBackgroundColorClass(attributeColor)
      )}
    >
      {label && (
        <div
          className={twMerge(
            "text-[10px] uppercase text-gray-medium",
            getLabelTextColorClass(attributeColor)
          )}
        >
          {label}
        </div>
      )}
      <div className="flex flex-col items-center justify-center">
        {getContent()}
      </div>
    </div>
  );
};
