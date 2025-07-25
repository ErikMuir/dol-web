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
import {
  AuditLogsAttribute,
  DynamicAttributes,
  FixedAttributes,
  ImageAttributes,
  SectionHeader,
  StaticAttributes,
} from "@/components/views/Shows/Attributes";
import { openWalletConnectModal } from "@/wallet";
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
import { NFTPlaceholder } from "./NFTPlaceholder";
import { fetchStandardJson } from "@/utils";

const { hfbCollectionId, mintEnabled, hfbHbarPrice } = getDappConfig();

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

  // useEffect(() => {
  //   randomizeAttributes();
  // }, []);

  useEffect(() => {
    if (setlist) {
      setSongId(setlist.songId);
    }
  }, [setlist]);

  // update the performance attributes when sources change
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

  useEffect(() => {
    if (performance && performance.serial) {
      setStatus(MintStatus.AlreadyMinted);
    }
  }, [performance]);

  useEffect(() => {
    if (metadata && metadata.attributes) {
      setBgColor(extractBgColor(metadata.attributes, DolColorHex.Dark));
      setDonut(extractDonut(metadata.attributes));
      setSubject(extractSubject(metadata.attributes));
    }
  }, [metadata]);

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
  ]);

  const handleBgColorChanged = useCallback(
    (color: DolColorHex) => setBgColor(color),
    [setBgColor]
  );

  const handleDonutChanged = useCallback(
    (color: DolColorHex) => setDonut(color),
    [setDonut]
  );

  const handleSubjectChanged = useCallback(
    (position: Subject) => setSubject(position),
    [setSubject]
  );

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

  const handleRandomizeClick = useCallback((e: React.MouseEvent) => {
    randomizeAttributes();
  }, []);

  const handleConnectClick = async () => {
    openWalletConnectModal();
  };

  const handleAssociateClick = async () => {
    const success = await walletInterface?.associateToken(
      TokenId.fromString(hfbCollectionId)
    );
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

  const getImage = () => {
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

  const getMintButton = () => {
    const buttonBase =
      "py-2 px-4 rounded-full text-sm uppercase tracking-widest";
    const buttonBlue = twMerge(
      buttonBase,
      "bg-dol-blue/25 hover:bg-dol-blue/75 duration-500"
    );
    const buttonGray = twMerge(buttonBase, "bg-gray-dark text-gray-medium");
    if (performanceLoading || isAssociatedLoading) {
      return (
        <button type="button" className={buttonGray} disabled>
          Please Wait...
        </button>
      );
    }
    if (!accountId) {
      return (
        <button
          type="button"
          className={buttonBlue}
          onClick={handleConnectClick}
        >
          Connect your wallet
        </button>
      );
    }
    if (!isAssociated) {
      return (
        <button
          type="button"
          className={buttonBlue}
          onClick={handleAssociateClick}
        >
          Associate the token
        </button>
      );
    }
    if (performance?.serial) {
      return (
        <button type="button" className={buttonGray} disabled>
          Already Minted
        </button>
      );
    }
    if (performance?.lockedUntil && performance.lockedUntil > Date.now()) {
      return (
        <button type="button" className={buttonGray} disabled>
          Locked
        </button>
      );
    }
    if (!mintEnabled) {
      return (
        <button type="button" className={buttonGray} disabled>
          Public Mint: TBA
        </button>
      );
    }
    const disabled =
      !mintEnabled ||
      !Boolean(performance) ||
      [
        MintStatus.AcquiringLock,
        MintStatus.AlreadyMinted,
        MintStatus.InitiatingTransfer,
        MintStatus.UpdatingMetadata,
        MintStatus.MintComplete,
      ].includes(status);
    return (
      <button
        type="button"
        className={disabled ? buttonGray : buttonBlue}
        onClick={handleMintClick}
        disabled={disabled}
      >
        Mint: {hfbHbarPrice} ℏ
      </button>
    );
  };

  const getStatusText = (): React.ReactNode => {
    return !performanceLoading &&
      status !== MintStatus.None &&
      status !== MintStatus.AlreadyMinted ? (
      <div className="text-dol-yellow">{status}</div>
    ) : null;
  };

  const formattedSetlist = getSetlistLines(setlists, parseInt(position))
    .map((s) => (s.isCurrentPosition ? `${boldIndicator}${s.text}` : s.text))
    .join("\n");

  if (setlistLoading) {
    return <Loading sizeInPixels={90} showLyric />;
  }

  return (
    <div className="w-[320px] md:w-[500px] lg:w-[680px] mt-14 mx-auto flex flex-col">
      <div className="flex flex-col items-center justify-center gap-6 w-full">
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
        text="Static Attributes"
        borderClass="border-gray-medium"
        backgroundClass="bg-gray-dark/75"
      />

      <StaticAttributes
        setlist={setlist}
        setlistLoading={setlistLoading}
        formattedSetlist={formattedSetlist}
        setlistsLoading={setlistsLoading}
        song={song}
        songLoading={songLoading}
      />

      <SectionHeader
        text="Audit Logs"
        borderClass="border-gray-medium"
        backgroundClass="bg-dol-black"
      />

      <AuditLogsAttribute setlist={setlist} setlistLoading={setlistLoading} />
    </div>
  );
};
