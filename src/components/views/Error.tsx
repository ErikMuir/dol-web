import Image from "next/image";

type ErrorProps = {
  code?: number | string;
  message?: string;
  image?: React.ReactElement;
};

export function Error({
  code,
  message = "Unknown error occurred",
  image,
}: ErrorProps): React.ReactElement {
  image = image ?? (
    <Image
      src="/subjects/lizard.png"
      alt="logo"
      width={360}
      height={360}
      className=""
      priority
    />
  );
  return (
    <div className="flex flex-col items-center justify-center gap-0 absolute top-0 bottom-0 left-0 right-0 -z-10">
      <div className="flex items-center justify-center gap-6 text-4xl tracking-wide">
        {code && <div>{code}</div>}
        {code && <div>|</div>}
        <div>{message}</div>
      </div>
      {image}
    </div>
  );
}

export function NotFound() {
  return <Error code={404} message="Not found" />;
}

export function Unauthorized() {
  return <Error code={401} message="Unauthorized" />;
}

export function ComingSoon() {
  return <Error code={419} message="Coming soon..." />;
}
