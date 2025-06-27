import { getLyricByCategory } from "@erikmuir/dol-lib/common/dapp";
import { AnimatedDonut } from "./AnimatedDonut";
import { Lyric } from "./Lyric";

type LoadingProps = {
  sizeInPixels?: number;
  showLyric?: boolean;
};

export const Loading = ({
  sizeInPixels = 120,
  showLyric = false,
}: LoadingProps) => {
  const lyric = getLyricByCategory("waiting");
  const half = Math.floor(sizeInPixels / 2);

  return (
    <>
      <div
        className="absolute"
        style={{ top: `calc(50% - ${half}px)`, left: `calc(50% - ${half}px)` }}
      >
        <AnimatedDonut sizeInPixels={sizeInPixels} />
      </div>
      {showLyric && (
        <div
          className="absolute w-full px-4 text-center left-0 text-xl"
          style={{ top: `calc(50% - ${14 * lyric.length}px)` }}
        >
          <Lyric lines={lyric} highlightColor="dol-yellow" />
        </div>
      )}
    </>
  );
};
