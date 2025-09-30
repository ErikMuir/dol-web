import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { twMerge } from "tailwind-merge";
import { NftId, TokenId, TransferTransaction } from "@hashgraph/sdk";
import {
  DolColorHex,
  MintStatus,
  PerformanceAttributes,
  PreTransferResponse,
  SerialErrorResponse,
  Subject,
} from "@erikmuir/dol-lib/types";
import {
  ipfsToHttps,
  boldIndicator,
  msToTime,
} from "@erikmuir/dol-lib/common/utils";
import {
  getDappConfig,
  extractBgColor,
  extractDonut,
  extractSubject,
  getSetlistLines,
  bgColors,
  donutColors,
  getRandomAttribute,
  subjects,
  getSetText,
} from "@erikmuir/dol-lib/common/dapp";
import { Loading } from "@/components/common/Loading";
import { MintStatusIndicator } from "@/components/common/MintStatusIndicator";
import {
  AuditLogsAttribute,
  DynamicAttributes,
  FixedAttributes,
  ImageAttributes,
  SectionHeader,
  OtherAttributes,
} from "@/components/views/Shows/Attributes";
import { isWhiteList, mintEnabled } from "@/env";
import {
  useIsTokenAssociated,
  useNftMetadata,
  usePerformance,
  useSetlist,
  useSetlists,
  useSong,
  useTrack,
  useWalletInterface,
} from "@/hooks";
import { fetchStandardJson } from "@/utils";
import { openWalletConnectModal } from "@/wallet";
import { NFTPlaceholder } from "./NFTPlaceholder";
import { PageNote } from "@/components/common/PageNote";
import { DolButton } from "@/components/common/DolButton";

const { hfbCollectionId, hfbHbarPrice } = getDappConfig();

export const Performance = (): React.ReactNode => {
  const pathname = usePathname();
  const pathParts = pathname.split("/");
  const date = pathParts.at(-2) ?? "";
  const position = pathParts.at(-1) ?? "";
  const parsedPosition = parseInt(position, 10);

  const [songId, setSongId] = useState<number>();
  const [bgColor, setBgColor] = useState<DolColorHex>(DolColorHex.Dark);
  const [donut, setDonut] = useState<DolColorHex | undefined>(DolColorHex.Red);
  const [subject, setSubject] = useState<Subject | undefined>(Subject.Lizard);
  const [attributes, setAttributes] = useState<PerformanceAttributes>({});
  const [status, setStatus] = useState<MintStatus>(MintStatus.None);
  const [pageLoaded, setPageLoaded] = useState(false);
  const [showImageAttributes, setShowImageAttributes] = useState(false);

  const { setlist, setlistLoading } = useSetlist(date, position);
  const { setlists, setlistsLoading } = useSetlists(date);
  const { song, songLoading } = useSong(songId);
  const { track, trackLoading } = useTrack(date, parsedPosition);
  const { performance, performanceLoading } = usePerformance(
    date,
    parsedPosition
  );
  const { metadata, metadataLoading } = useNftMetadata(
    hfbCollectionId,
    performance?.serial
  );
  const { accountId, walletInterface } = useWalletInterface();
  const { isAssociated, isAssociatedLoading, mutateIsAssociated } =
    useIsTokenAssociated(hfbCollectionId, accountId);

  const whiteList = isWhiteList(accountId);

  // // Randomize the image attributes when the page loads
  // useEffect(() => {
  //   randomizeAttributes();
  // }, []);

  // Set songId from setlist, which will in turn fetch the song
  useEffect(() => {
    if (setlist) {
      setSongId(setlist.songId);
    }
  }, [setlist]);

  // Update performance attributes when sources change
  useEffect(() => {
    const newAttributes: PerformanceAttributes = {
      bgColor,
      donut,
      subject,
    };

    if (setlist) {
      const normalizedDate = setlist.showDate.replaceAll("-", "");
      newAttributes.performanceId = `${normalizedDate}:${setlist.position}`;
      newAttributes.song = setlist.song;
      newAttributes.date = setlist.showDate;
      newAttributes.set = getSetText(setlist.set);
      newAttributes.position = setlist.position;
      newAttributes.venue = setlist.venue;
      newAttributes.city = setlist.city;
      newAttributes.state = setlist.state;
      newAttributes.country = setlist.country;
      newAttributes.tour = setlist.tourName || setlist.tourWhen;
      newAttributes.gap = setlist.gap;
      newAttributes.footnote = setlist.footnote;

      if (setlists) {
        const prev = setlists.find(
          (s) => s.set === setlist.set && s.position === setlist.position - 1
        );
        if (prev) {
          const transMark = prev.transition > 1 ? prev.transMark : "";
          newAttributes.prevSong = `${prev.song}${transMark}`;
        }

        const next = setlists.find(
          (s) => s.set === setlist.set && s.position === setlist.position + 1
        );
        if (next) {
          const transMark = setlist.transition > 1 ? setlist.transMark : "";
          newAttributes.nextSong = `${transMark}${next.song}`;
        }
      }
    }

    if (song) {
      newAttributes.alias = song.abbr;
      newAttributes.artist = song.artist;
      newAttributes.debut = song.debut;
    }

    if (track) {
      newAttributes.alias ||= track.songs[0].alias;
      newAttributes.mp3 = track.mp3Url;
      newAttributes.runtime = track.durationMs
        ? msToTime(track.durationMs)
        : undefined;
    }

    // Used for runbook: When NFT metadata fails to update
    //-------------------------------------------------------------------------
    // console.log("Setting attributes:", newAttributes);
    //-------------------------------------------------------------------------

    setAttributes(newAttributes);
  }, [bgColor, donut, subject, track, setlist, setlists, song]);

  // Set status to Already Minted if the performance has a serial
  useEffect(() => {
    if (performance && performance.serial) {
      setStatus(MintStatus.AlreadyMinted);
    }
  }, [performance]);

  // Set bgColor, donut, and subject from metadata
  useEffect(() => {
    if (metadata && metadata.attributes) {
      setBgColor(extractBgColor(metadata.attributes, DolColorHex.Dark));
      setDonut(extractDonut(metadata.attributes));
      setSubject(extractSubject(metadata.attributes));
    }
  }, [metadata]);

  // Set showImageAttributes and pageLoaded based on loading states
  useEffect(() => {
    if (!showImageAttributes) {
      setShowImageAttributes(
        !setlistLoading && !performanceLoading && !metadataLoading
      );
    }
    if (!pageLoaded) {
      setPageLoaded(
        !setlistLoading &&
          !setlistsLoading &&
          !songLoading &&
          !trackLoading &&
          !performanceLoading &&
          !metadataLoading
      );
    }
  }, [
    setlistLoading,
    setlistsLoading,
    songLoading,
    trackLoading,
    performanceLoading,
    metadataLoading,
    pageLoaded,
    showImageAttributes,
  ]);

  const handleBgColorChanged = useCallback((color?: string) => {
    if (color) setBgColor(color as DolColorHex);
  }, [setBgColor]);

  const handleDonutChanged = useCallback((color?: string) => {
    if (color) setDonut(color as DolColorHex);
  }, [setDonut]);

  const handleSubjectChanged = useCallback((position?: string) => {
    if (position) setSubject(position as Subject);
  }, [setSubject]);

  const randomizeAttributes = () => {
    const randomBgColor = getRandomAttribute<DolColorHex>(bgColors);
    const randomDonut = getRandomAttribute<DolColorHex>(donutColors);
    const randomSubject = getRandomAttribute<Subject>(subjects);
    setBgColor(randomBgColor);
    setDonut(randomDonut === randomBgColor ? undefined : randomDonut);
    setSubject(randomSubject);
  };

  const handleRandomizeKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Enter") randomizeAttributes();
  }, []);

  const handleRandomizeClick = useCallback(() => {
    randomizeAttributes();
  }, []);

  const handleConnectClick = async () => {
    openWalletConnectModal();
  };

  const handleAssociateClick = async () => {
    const success = await walletInterface?.associateToken(hfbCollectionId);
    if (success) {
      mutateIsAssociated(true);
    }
  };

  const updateStatus = (newStatus: MintStatus) => {
    setStatus(newStatus);
    console.log(newStatus);
  };

  const handleMintClick = async () => {
    if (!pageLoaded || !setlist) {
      return;
    }
    if (performance?.serial) {
      updateStatus(MintStatus.AlreadyMinted);
      return;
    }

    updateStatus(MintStatus.AcquiringLock);
    const { serial, txBytes } = await fetchStandardJson<PreTransferResponse>(
      `/api/mint/${accountId}/${date}/${position}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(attributes),
      }
    );

    if (!txBytes) {
      let error = "Unknown error";
      switch (serial) {
        case SerialErrorResponse.LOCK_NOT_ACQUIRED:
          error = "Lock not acquired";
          updateStatus(MintStatus.LockNotAcquired);
          break;
        case SerialErrorResponse.ALREADY_MINTED:
          error = "Performance already claimed";
          updateStatus(MintStatus.AlreadyMinted);
          break;
        case SerialErrorResponse.NO_SUPPLY:
          error = "No supply available";
          updateStatus(MintStatus.NoSupply);
          break;
        default:
          error = "Unknown error";
          updateStatus(MintStatus.LockNotAcquired);
          break;
      }
      await fetchStandardJson(
        `/api/mint/${accountId}/${date}/${position}/${serial}/abort`,
        { method: "POST" }
      );
      await fetchStandardJson(`/api/audit/${accountId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "NFT_PURCHASE",
          success: false,
          context: {
            tokenId: hfbCollectionId,
            serial,
            showDate: date,
            position,
            error,
          },
        }),
      });
      return;
    }

    updateStatus(MintStatus.InitiatingTransfer);
    let transferSuccess = false;
    try {
      const nftId = new NftId(TokenId.fromString(hfbCollectionId), serial);
      const tx = TransferTransaction.fromBytes(new Uint8Array(txBytes.data));
      transferSuccess = await walletInterface!.purchaseNft(
        tx,
        nftId,
        date,
        parseInt(position)
      );
    } catch (err) {
      console.error("Transaction error:", err);
    }

    if (!transferSuccess) {
      updateStatus(MintStatus.TransferAborted);
      await fetchStandardJson(
        `/api/mint/${accountId}/${date}/${position}/${serial}/abort`,
        { method: "POST" }
      );
      return;
    }

    updateStatus(MintStatus.UpdatingMetadata);
    const metadataUpdateSuccess = await fetchStandardJson<boolean>(
      `/api/mint/${accountId}/${date}/${position}/${serial}`,
      { method: "POST" }
    );

    updateStatus(
      metadataUpdateSuccess
        ? MintStatus.MintComplete
        : MintStatus.FailedToUpdateMetadata
    );
  };

  const getImage = (): React.ReactNode => {
    if (metadataLoading || !showImageAttributes) {
      return (
        <div className="w-[374px] h-[420px] relative">
          <Loading sizeInPixels={90} />
        </div>
      );
    }
    return metadata ? (
      <Image
        src={ipfsToHttps(metadata.image)}
        alt={metadata.name}
        width={374}
        height={420}
        className="shadow-lg cursor-default rounded-2xl border border-gray-dark w-auto h-auto"
        priority
      />
    ) : (
      <NFTPlaceholder
        song={attributes.song || "Loading..."}
        performanceId={attributes.performanceId || ""}
        bgColor={bgColor || DolColorHex.Dark}
        donut={donut}
        subject={subject}
      />
    );
  };

  const getMintButton = (): React.ReactNode => {
    if (performanceLoading || isAssociatedLoading) {
      return <DolButton color="gray" roundedFull disabled>Please Wait...</DolButton>;
    }
    if (!accountId) {
      return (
        <DolButton color="blue" roundedFull onClick={handleConnectClick}>Connect your wallet</DolButton>
      );
    }
    if (!isAssociated) {
      return (
        <DolButton color="blue" roundedFull onClick={handleAssociateClick}>Associate the token</DolButton>
      );
    }
    if (performance?.serial) {
      return (
        <DolButton color="gray" roundedFull disabled>Already Minted</DolButton>
      );
    }
    if (performance?.lockedUntil && performance.lockedUntil > Date.now()) {
      return (
        <DolButton color="gray" roundedFull disabled>Locked</DolButton>
      );
    }
    if (!mintEnabled && !whiteList) {
      return (
        <DolButton color="gray" roundedFull disabled>Public Mint: TBA</DolButton>
      );
    }
    const disabled =
      (!mintEnabled && !whiteList) ||
      !Boolean(performance) ||
      [
        MintStatus.AcquiringLock,
        MintStatus.AlreadyMinted,
        MintStatus.InitiatingTransfer,
        MintStatus.UpdatingMetadata,
        MintStatus.MintComplete,
      ].includes(status);
    return (
      <DolButton
        color="blue"
        roundedFull
        onClick={handleMintClick}
        disabled={disabled}
      >
        Mint: {hfbHbarPrice} ℏ
      </DolButton>
    );
  };

  const getStatusText = (): React.ReactNode => {
    return !performanceLoading &&
      status !== MintStatus.None &&
      status !== MintStatus.AlreadyMinted ? (
      <div className="text-dol-yellow">{status}</div>
    ) : null;
  };

  const getPageNote = (): React.ReactNode => {
    if (!performance || performance?.serial || (performance?.lockedUntil && performance.lockedUntil > Date.now())) {
      return null;
    }

    if (!mintEnabled && !whiteList) {
      return (
        <PageNote color="dol-red" className="text-center">
          Public minting is currently disabled.
        </PageNote>
      );
    }

    const getAttributeTypeLabel = (text: string, className?: string) =>
      <span className={twMerge("font-bold", className)}>{text}</span>;

    const customizable = getAttributeTypeLabel("Customizable", "text-dol-yellow");
    const fixed = getAttributeTypeLabel("Fixed", "text-dol-blue");
    const dynamic = getAttributeTypeLabel("Dynamic", "text-dol-green");
    const other = getAttributeTypeLabel("Other", "text-gray-medium");

    return (
      <>
        {!mintEnabled && whiteList && (
          <PageNote color="dol-green" className="text-center">
            Public minting is currently disabled, but you&apos;re on the Guest List!
          </PageNote>
        )}
        <div className="text-justify">
          Feel free to modify or randomize the {customizable} attributes to your liking! When you mint,{" "}
          they&apos;ll be written to the NFT&apos;s metadata on chain, along with the {fixed} attributes{" "}
          — <em>including the MP3 link!</em> ({dynamic} and {other} attributes will not be written on chain,{" "}
          but can still be viewed on this page.)
        </div>
      </>
    );
  };

  if (setlistLoading) {
    return <Loading sizeInPixels={90} showLyric />;
  }

  const formattedSetlist = getSetlistLines(setlists, parseInt(position))
    .map((s) => (s.isCurrentPosition ? `${boldIndicator}${s.text}` : s.text))
    .join("\n");

  const showAuditLogs = false;

  return (
    <div className="w-[320px] md:w-[500px] lg:w-[680px] mt-4 mx-auto flex flex-col">
      <div className="flex flex-col items-center gap-4 w-full">
        {getPageNote()}
        <MintStatusIndicator
          date={date}
          position={parsedPosition}
          performance={performance}
          className="justify-center text-md"
        />
        {getImage()}
        {getMintButton()}
        {getStatusText()}
      </div>

      {showImageAttributes && (
        <SectionHeader
          text="Customizable NFT Attributes"
          borderClass="border-dol-yellow"
          backgroundClass="bg-dol-yellow/25"
        />
      )}

      {showImageAttributes && (
        <ImageAttributes
          bgColor={bgColor}
          donut={donut}
          subject={subject}
          minted={Boolean(performance?.serial)}
          handleBgColorChanged={handleBgColorChanged}
          handleDonutChanged={handleDonutChanged}
          handleSubjectChanged={handleSubjectChanged}
          handleRandomizeClick={handleRandomizeClick}
          handleRandomizeKeyDown={handleRandomizeKeyDown}
        />
      )}

      <SectionHeader
        text="Fixed NFT Attributes"
        borderClass="border-dol-blue"
        backgroundClass="bg-dol-blue/25"
      />

      <FixedAttributes
        attributes={attributes}
        trackLoading={trackLoading}
        setlistLoading={setlistLoading}
        setlistsLoading={setlistsLoading}
        songLoading={songLoading}
        song={song}
      />

      <SectionHeader
        text="Dynamic Attributes"
        borderClass="border-dol-green"
        backgroundClass="bg-dol-green/25"
      />

      <DynamicAttributes song={song} songLoading={songLoading} />

      <SectionHeader
        text="Other Attributes"
        borderClass="border-gray-medium"
        backgroundClass="bg-gray-dark/75"
      />

      <OtherAttributes
        setlist={setlist}
        setlistLoading={setlistLoading}
        formattedSetlist={formattedSetlist}
        setlistsLoading={setlistsLoading}
        song={song}
        songLoading={songLoading}
      />

      {showAuditLogs && (
        <SectionHeader
          text="Audit Logs"
          borderClass="border-gray-medium"
          backgroundClass="bg-dol-dark"
        />
      )}

      {showAuditLogs && (
        <AuditLogsAttribute setlist={setlist} setlistLoading={setlistLoading} />
      )}
    </div>
  );
};
