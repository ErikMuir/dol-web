import { Heading } from "./Heading";
import { Overview } from "./Overview";
import { Features } from "./Features";
import { Closing } from "./Closing";
import { BackgroundDonut } from "./BackgroundDonut";
import { Shapes } from "@/components/common/Shapes";
import { DiscordLink } from "@/components/common/DiscordLink";

export const Home = (): React.ReactElement => {
  return (
    <div className="flex flex-col items-center gap-12 max-w-[640px] mt-8 px-4">
      <BackgroundDonut />
      <Heading />
      <Overview />
      <Features />
      <Closing />
      <DiscordLink sizeInPixels={60} includeText />
      <Shapes />
    </div>
  );
};
