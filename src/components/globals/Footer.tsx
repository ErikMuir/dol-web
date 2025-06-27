import Image from "next/image";

export const Footer = () => {
  return (
    <footer className="shrink-0 mt-8">
      <div className="flex items-center justify-center gap-2 text-xs p-2">
        <div>built on Hedera</div>
        <Image src="/hedera-logo.png" width={20} height={20} alt="Hedera" className="rounded-full" />
        <div>·</div>
        <div>by RobotJones</div>
        <Image src="/robotjones.jpg" width={20} height={20} alt="RobotJones" className="rounded-full" />
      </div>
    </footer>
  );
};
