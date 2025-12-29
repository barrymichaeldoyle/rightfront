import Link from "next/link";

import { SignedIn } from "@clerk/nextjs";

type NavigationLinksProps = {
  variant?: "horizontal" | "vertical";
  className?: string;
  linkClassName?: string;
};

export function NavigationLinks({
  variant = "horizontal",
  className,
  linkClassName,
}: NavigationLinksProps) {
  const baseLinkClassName =
    "px-1 transition-colors hover:text-slate-100 focus-visible:text-slate-100 focus-visible:ring-2 focus-visible:ring-blue-400";
  const combinedLinkClassName = linkClassName
    ? `${baseLinkClassName} ${linkClassName}`
    : baseLinkClassName;

  const containerClassName =
    variant === "horizontal"
      ? "flex items-center gap-4"
      : "flex flex-col gap-2";

  return (
    <nav className={className || containerClassName}>
      <Link href="/" className={combinedLinkClassName}>
        Home
      </Link>
      <Link href="/how-it-works" className={combinedLinkClassName}>
        How it works
      </Link>
      <SignedIn>
        <Link href="/dashboard" className={combinedLinkClassName}>
          Dashboard
        </Link>
      </SignedIn>
    </nav>
  );
}
