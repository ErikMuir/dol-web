"use client";

import { useRouter } from "next/navigation";
import { MdArrowBack } from "react-icons/md";
import { twMerge } from "tailwind-merge";

export default function SetlistsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  return (
    <div className="w-[320px] md:w-[672px] lg:w-[900px] xl:w-[1024px] flex flex-col">
      <div className="relative">
        <div className="absolute -left-6">
          <MdArrowBack
            size={40}
            className={twMerge(
              "mt-2 p-2 z-10 shadow-md rounded-full cursor-pointer",
              "bg-gray-dark",
              "hover:bg-gray-dark-2 duration-500"
            )}
            title="Go back"
            onClick={() => router.back()}
          />
        </div>
      </div>
      {children}
    </div>
  );
}
