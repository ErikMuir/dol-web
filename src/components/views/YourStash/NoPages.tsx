import Link from "next/link";
import { twMerge } from "tailwind-merge";

const linkBtn = twMerge(
  "py-2 px-4 rounded-full text-sm uppercase tracking-widest",
  "bg-dol-blue/25 hover:bg-dol-blue/75 duration-500",
  "text-balance text-center"
);

export const NoPages = (): React.ReactNode => (
  <div className="flex flex-col items-center justify-center w-full h-[calc(100vh-420px)] gap-4">
    <h1 className="text-[60px] text-center">Build Your Collection</h1>
    <div className="text-xl text-balance text-center">
      Here you'll find all the pages of the Helping Friendly Book for which
      you've laid claim.
    </div>
    <div>&nbsp;</div>
    <div className="flex items-center justify-center gap-4">
      <Link href="/helping-friendly-book/songs" className={linkBtn}>
        Browse By Song
      </Link>
      <Link href="/helping-friendly-book/dates" className={linkBtn}>
        Browse by Date
      </Link>
      <Link href="/helping-friendly-book/locations" className={linkBtn}>
        Browse by Location
      </Link>
    </div>
  </div>
);
