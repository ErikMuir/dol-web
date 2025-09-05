"use client";

import { usePathname, useRouter } from "next/navigation";
import { twMerge } from "tailwind-merge";
import Link from "next/link";
import { MdArrowBack } from "react-icons/md";

export const Nav = (): React.ReactElement => {
  const pathname = usePathname();
  const router = useRouter();
  return (
    <div className="w-full mx-auto max-w-[1024px]">
      <div className="flex justify-start items-center gap-4">
        <NavTab
          name="Home"
          href="/"
          color="bg-dol-blue"
          isCurrentTab={pathname === "/"}
        />
        <NavTab
          name="Helping Friendly Book"
          href="/helping-friendly-book/dates"
          color="bg-dol-green"
          isFaulty
          isCurrentTab={
            pathname.startsWith("/helping-friendly-book") ||
            pathname.startsWith("/shows")
          }
        />
        <NavTab
          name="Your Stash"
          href="/stash"
          color="bg-dol-red"
          isCurrentTab={pathname.startsWith("/stash")}
        />
        <NavTab
          name="Duke's Log"
          href="/logs"
          color="bg-dol-yellow"
          isCurrentTab={pathname.startsWith("/logs")}
        />
      </div>
      <div className="relative top-5">
        <MdArrowBack
          size={40}
          className={twMerge(
            "p-2 z-30 shadow-md rounded-full cursor-pointer",
            "bg-gray-dark",
            "border border-gray-medium/25",
            "hover:bg-gray-dark-2 duration-500"
          )}
          title="Go back"
          onClick={() => router.back()}
        />
      </div>
    </div>
  );
};

type NavTabProps = {
  name: string;
  href: string;
  color: string;
  isCurrentTab?: boolean;
  isFaulty?: boolean;
};

const NavTab = ({
  name,
  href,
  color,
  isCurrentTab = false,
  isFaulty = false,
}: NavTabProps): React.ReactElement => {
  return (
    <Link
      href={href}
      className={twMerge(
        "flex flex-col items-center justify-center w-1/4 relative",
        "text-md text-center h-16 cursor-pointer tracking-wide",
        "group"
      )}
    >
      {name}
      <div
        className={twMerge(
          color,
          "absolute w-full h-4 -z-10 transition-[bottom] ease-in-out duration-[1000ms]",
          isCurrentTab || isFaulty ? "bottom-12" : "bottom-0",
          isFaulty ? "transition-transform origin-top-left rotate-[5deg]" : "",
          isFaulty ? "group-hover:rotate-[0deg]" : "group-hover:bottom-12"
        )}
      ></div>
    </Link>
  );
};
