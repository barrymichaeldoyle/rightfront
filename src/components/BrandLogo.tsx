import Link from "next/link";

export function BrandMark() {
  return (
    <span className="font-semibold tracking-tight">
      <span className="bg-gradient-to-r from-sky-400 to-blue-600 bg-clip-text text-transparent">
        Right
      </span>
      <span className="relative -top-0.5 mx-0.5 font-bold text-slate-100">
        |
      </span>
      <span className="bg-gradient-to-r from-blue-600 to-sky-400 bg-clip-text text-transparent">
        Front
      </span>
    </span>
  );
}

export function BrandLogo({
  href,
  showBeta = true,
}: {
  href: string;
  showBeta?: boolean;
}) {
  return (
    <h1 className="flex items-center text-2xl font-semibold tracking-tight">
      <Link
        href={href}
        className="focus-visible:ring-2 focus-visible:ring-blue-400"
      >
        <BrandMark />
      </Link>

      {showBeta ? (
        <span className="ml-2 rounded-full bg-sky-500/20 px-2 py-0.5 align-middle text-xs font-semibold tracking-wide text-sky-300">
          beta
        </span>
      ) : null}
    </h1>
  );
}
