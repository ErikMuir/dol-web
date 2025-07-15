import { PerformanceAttributes, Song } from "@erikmuir/dol-lib/types";
import { AudioAttribute } from "../AttributeTypes/AudioAttribute";
import { DataAttribute } from "../AttributeTypes/DataAttribute";
import { TextAttribute } from "../AttributeTypes";

export type FixedAttributesProps = {
  attributes: PerformanceAttributes;
  trackLoading?: boolean;
  setlistLoading?: boolean;
  setlistsLoading?: boolean;
  songLoading?: boolean;
  song?: Song;
};

export const FixedAttributes = ({
  attributes,
  trackLoading,
  setlistLoading,
  setlistsLoading,
  songLoading,
}: FixedAttributesProps): React.ReactNode => {

  const getFootnoteAttribute = () => {
    const footnoteText = attributes.footnote;
    const hasLongFootnote = footnoteText && footnoteText.length > 32;
    return hasLongFootnote ? (
      <TextAttribute
        label="Footnote"
        text={footnoteText}
        loading={setlistLoading}
        attributeColor={"dol-blue"}
        fullWidth
        textCentered
      />
    ) : (
      <DataAttribute
        label="Footnote"
        data={footnoteText}
        loading={setlistLoading}
        attributeColor={"dol-blue"}
      />
    );
  };

  return (
    <div className="flex flex-wrap justify-center gap-2 items-center w-full max-w-[640px] mx-auto">
      <AudioAttribute
        label="MP3"
        src={attributes.mp3}
        loading={trackLoading}
        attributeColor={"dol-blue"}
        textColor={"dol-green"}
      />
      <DataAttribute
        label="NFT Id"
        data={attributes.performanceId}
        loading={setlistLoading}
        attributeColor={"dol-blue"}
      />
      <DataAttribute
        label="Song"
        data={attributes.song}
        loading={setlistLoading}
        attributeColor={"dol-blue"}
      />
      <DataAttribute
        label="Date"
        data={attributes.date}
        href={`/shows/${attributes.date}`}
        loading={setlistLoading}
        attributeColor={"dol-blue"}
      />
      <DataAttribute
        label="Set"
        data={attributes.set}
        loading={setlistLoading}
        attributeColor={"dol-blue"}
      />
      <DataAttribute
        label="Position"
        data={attributes.position}
        loading={setlistLoading}
        attributeColor={"dol-blue"}
      />
      <DataAttribute
        label="Preceded By"
        data={attributes.prevSong}
        loading={setlistsLoading}
        attributeColor={"dol-blue"}
      />
      <DataAttribute
        label="Followed By"
        data={attributes.nextSong}
        loading={setlistsLoading}
        attributeColor={"dol-blue"}
      />
      <DataAttribute
        label="Venue"
        data={attributes.venue}
        loading={setlistLoading}
        attributeColor={"dol-blue"}
      />
      <DataAttribute
        label="City"
        data={attributes.city}
        loading={setlistLoading}
        attributeColor={"dol-blue"}
      />
      <DataAttribute
        label="State"
        data={attributes.state}
        loading={setlistLoading}
        attributeColor={"dol-blue"}
      />
      <DataAttribute
        label="Country"
        data={attributes.country}
        loading={setlistLoading}
        attributeColor={"dol-blue"}
      />
      <DataAttribute
        label="Tour"
        data={attributes.tour}
        loading={setlistLoading}
        attributeColor={"dol-blue"}
      />
      <DataAttribute
        label="Gap"
        data={attributes.gap}
        loading={setlistLoading}
        attributeColor={"dol-blue"}
      />
      <DataAttribute
        label="Runtime"
        data={attributes.runtime}
        loading={trackLoading}
        attributeColor={"dol-blue"}
      />
      <DataAttribute
        label="Alias"
        data={attributes.alias}
        loading={songLoading}
        attributeColor={"dol-blue"}
      />
      <DataAttribute
        label="Original Artist"
        data={attributes.artist}
        loading={songLoading}
        attributeColor={"dol-blue"}
      />
      <DataAttribute
        label="Debut"
        data={attributes.debut}
        href={`/shows/${attributes.debut}`}
        loading={songLoading}
        attributeColor={"dol-blue"}
      />
      {getFootnoteAttribute()}
    </div>
  );
};
