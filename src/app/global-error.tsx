"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <div className="flex flex-col gap-4 items-center mt-16">
          <div className="text-xl">Something went globally wrong!</div>
          <button type="button" onClick={reset}>Try again</button>
          <div className="text-xs font-mono">{error.message}</div>
        </div>
      </body>
    </html>
  );
}
