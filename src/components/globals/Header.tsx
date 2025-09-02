"use client";

import { Shapes } from "../common/Shapes";
import { Wallet } from "./Wallet";
import { DiscordLink } from "../common/DiscordLink";
import { Nav } from "./Nav";
import { twMerge } from "tailwind-merge";

export const Header = () => {
  return (
    <header
      className={twMerge(
        "fixed top-0 z-20 w-full bg-gray-extra-dark",
        "border-b border-gray-dark-2 shadow-lg",
      )}
    >
      <div className="flex flex-wrap items-center justify-between p-2">
        <div
          className="flex items-center gap-2 cursor-default"
          title="Can you still have fun?"
        >
          <a href="https://wilson.com">
            <Shapes sizeInPixels={20} bounceOnHover />
          </a>
        </div>
        <div className="pr-2 flex items-center gap-2">
          <DiscordLink sizeInPixels={24} />
          <Wallet />
        </div>
      </div>
      <div className="px-2"><Nav /></div>
    </header>
  );
};
