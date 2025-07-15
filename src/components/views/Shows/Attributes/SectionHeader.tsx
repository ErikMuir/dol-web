import { twMerge } from "tailwind-merge";

export type SectionHeaderProps = {
  text: string;
  borderClass?: string;
  backgroundClass?: string;
};

export const SectionHeader = ({
  text,
  borderClass,
  backgroundClass,
}: SectionHeaderProps): React.ReactNode => {
  return (
    <h3 className="flex flex-wrap justify-center gap-2 items-center pt-12 pb-4">
      <div
        className={twMerge(
          "rounded-full p-2 border",
          borderClass,
          backgroundClass
        )}
      ></div>
      <div className="text-xl">{text}</div>
    </h3>
  );
};
