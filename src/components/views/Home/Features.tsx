import { twMerge } from "tailwind-merge";

export const Features = (): React.ReactElement => {
  return (
    <div className="flex flex-col items-center gap-8">
      <div className="text-2xl">What Lies Within These Walls?</div>
      <div className="flex flex-wrap justify-center gap-8">
        <Feature
          twTextColor="text-dol-blue"
          title="A grand collection"
          content="Each NFT represents a page from the Helping Friendly Book,
            chronicling a single, unique live performance of a Phish song."
        />
        <Feature
          twTextColor="text-dol-green"
          title="A seeker's tool"
          content="Filter the chronicles by date or location and find the performances
            that resonate with you."
        />
        <Feature
          twTextColor="text-dol-red"
          title="Sacred knowledge"
          content="Each NFT holds detailed lore—setlists, metadata, and links to ancient
            texts and hidden sounds."
        />
        <Feature
          twTextColor="text-dol-yellow"
          title="A quest of your own"
          content="Connect your Hedera wallet and claim your piece of history. The book
            grows only as the worthy inscribe its pages."
        />
      </div>
    </div>
  );
};

export type FeatureProps = {
  twTextColor?: string;
  title: string;
  content: string;
};

export const Feature = ({
  twTextColor = "text-dol-white",
  title,
  content,
}: FeatureProps): React.ReactElement => {
  return (
    <div className="rounded bg-[rgba(51,51,51,0.65)] grow flex flex-col items-center gap-4 p-8 w-2/5 min-w-60 max-w-80">
      <div className={twMerge("text-2xl uppercase text-center", twTextColor)}>
        {title}
      </div>
      <div>{content}</div>
    </div>
  );
};
