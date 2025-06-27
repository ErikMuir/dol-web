import { DolColorHex } from "@erikmuir/dol-lib/types";
import { Donut } from "@/components/common/Shapes";

export const BackgroundDonut = (): React.ReactNode => {
  return (
    <>
      <Donut
        color={DolColorHex.Red}
        sizeInPixels={500}
        className="fixed -z-10 opacity-[.1] top-1/2 left-1/2 translate-x-[-250px] translate-y-[-250px]"
      />
    </>
  );
};
