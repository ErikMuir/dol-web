"use client";

export default function SetlistsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-[320px] md:w-[672px] lg:w-[900px] xl:w-[1024px] flex flex-col">
      {children}
    </div>
  );
}
