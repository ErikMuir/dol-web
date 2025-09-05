"use client";

import { useEffect, useRef, useState } from "react";
import { twMerge } from "tailwind-merge";
import { Loading } from "./Loading";
import { usePerformance } from "@/hooks";

export enum MintStatusIndicatorType {
  EmojiAndLabel = "EmojiAndLabel",
  Emoji = "Emoji",
  Label = "Label",
}

export type MintStatusIndicatorProps = {
  date: string;
  position: number;
  type?: MintStatusIndicatorType;
  className?: string;
};

export const MintStatusIndicator = ({
  date,
  position,
  type = MintStatusIndicatorType.EmojiAndLabel,
  className,
}: MintStatusIndicatorProps): React.ReactElement => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [shouldFetch, setShouldFetch] = useState(false);

  useEffect(() => {
    const element = containerRef.current;
    if (!element || shouldFetch) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldFetch(true);
          observer.disconnect();
        }
      },
      {
        root: null,
        // Start fetching a bit before entering the viewport
        rootMargin: "200px 0px",
        threshold: 0,
      }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [shouldFetch]);

  const { performance, performanceLoading } = usePerformance(date, shouldFetch ? position : undefined);

  let textColor: string;
  let emoji: React.ReactNode;
  let statusText: string;

  if (!shouldFetch) {
    textColor = "text-gray-medium";
    emoji = "❓";
    statusText = "Unknown";
  } else if (performanceLoading) {
    textColor = "text-gray-medium";
    emoji = <Loading sizeInPixels={16} />;
    statusText = "Loading";
  } else if (!performance) {
    textColor = "text-gray-medium";
    emoji = "❓";
    statusText = "Unknown";
  } else if (performance.serial) {
    textColor = "text-dol-red";
    emoji = "🔴";
    statusText = "Claimed";
  } else if (performance.lockedUntil && performance.lockedUntil > Date.now()) {
    textColor = "text-dol-yellow";
    emoji = "🟡";
    statusText = "Locked";
  } else {
    textColor = "text-dol-green";
    emoji = "🟢";
    statusText = "Available";
  }

  const emojiClass = twMerge(performanceLoading ? "relative -left-3" : "");

  return (
    <div
      ref={containerRef}
      className={twMerge(
        "flex items-center gap-1",
        "uppercase tracking-widest",
        textColor,
        className,
      )}
    >
      {type !== MintStatusIndicatorType.Label && <span className={emojiClass}>{emoji}</span>}
      {type !== MintStatusIndicatorType.Emoji && <span>{statusText}</span>}
    </div>
  );
};
