import Link from "next/link";

import type { ComponentProps, PropsWithChildren } from "react";

import { cn } from "@/lib/cn";

export type ButtonVariant = "primary" | "secondary" | "danger" | "link";

export type ButtonSize =
  | "xs"
  | "sm"
  | "md"
  | "lg"
  | "icon2xs"
  | "iconXs"
  | "iconSm"
  | "icon";

type ButtonStyleOptions = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  interactive?: "button" | "link";
};

export function buttonClasses({
  variant = "secondary",
  size = "md",
  fullWidth = false,
  interactive = "button",
}: ButtonStyleOptions = {}) {
  const hover = interactive === "button" ? "enabled:hover" : "hover";
  const base =
    "inline-flex cursor-pointer select-none items-center justify-center gap-2 rounded-md font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 disabled:cursor-not-allowed disabled:opacity-60";

  const width = fullWidth ? "w-full" : "";

  const sizes: Record<ButtonSize, string> = {
    xs: "h-7 px-2 text-xs",
    sm: "h-9 px-3 text-sm",
    md: "h-10 px-4 text-sm",
    lg: "h-11 px-5 text-base",
    icon2xs: "h-5 w-5 p-0",
    iconXs: "h-7 w-7 p-0",
    iconSm: "h-8 w-8 p-0",
    icon: "h-10 w-10 p-0",
  };

  const variants: Record<ButtonVariant, string> = {
    primary: `bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-sm shadow-blue-500/10 ${hover}:from-sky-400 ${hover}:to-blue-500`,
    secondary: `border border-slate-700 bg-slate-900 text-slate-200 ${hover}:bg-slate-800`,
    danger: `border border-red-300/30 bg-red-950 text-red-100 ${hover}:brightness-120 focus-visible:ring-red-300`,
    link: "h-auto px-0 py-0 text-sm text-sky-300 underline-offset-4 hover:text-sky-200 hover:underline",
  };

  return cn(base, width, sizes[size], variants[variant]);
}

function Spinner({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "h-4 w-4 rounded-full border-2 border-current/30 border-t-current",
        className,
      )}
    />
  );
}

type BaseButtonProps = ButtonStyleOptions & {
  className?: string;
  disabled?: boolean;
  loading?: boolean;
  withSpinner?: boolean;
} & PropsWithChildren;

type ButtonAsButton = BaseButtonProps &
  Omit<ComponentProps<"button">, "disabled" | "className" | "type"> & {
    href?: never;
    type?: "button" | "submit" | "reset";
  };

type ButtonAsLink = BaseButtonProps &
  Omit<ComponentProps<typeof Link>, "className"> & {
    href: string;
    type?: never;
  };

type ButtonAsAnchor = BaseButtonProps &
  Omit<ComponentProps<"a">, "className" | "href"> & {
    href: string;
    type?: never;
  };

export type ButtonProps = ButtonAsButton | ButtonAsLink | ButtonAsAnchor;

function isInternalLink(href: string): boolean {
  // Internal links start with / or #, or are relative paths
  return href.startsWith("/") || href.startsWith("#") || !href.includes("://");
}

export function Button({
  variant = "secondary",
  size = "md",
  fullWidth = false,
  disabled,
  loading,
  withSpinner,
  className,
  children,
  href,
  type = "button",
  ...props
}: ButtonProps) {
  const isDisabled = Boolean(disabled || loading);
  const showSpinner = Boolean(loading || withSpinner);
  const buttonClassName = cn(
    buttonClasses({
      variant,
      size,
      fullWidth,
      interactive: href ? "link" : "button",
    }),
    className,
  );

  // Render as Next.js Link for internal links
  if (href && isInternalLink(href)) {
    const { href: _, ...linkProps } = props as ComponentProps<typeof Link> & {
      href?: string;
    };
    return (
      <Link
        href={href}
        className={buttonClassName}
        aria-busy={loading || linkProps["aria-busy"]}
        {...linkProps}
      >
        {showSpinner ? (
          <Spinner
            className={cn("shrink-0", loading ? "animate-spin" : "opacity-0")}
          />
        ) : null}
        {children}
      </Link>
    );
  }

  // Render as anchor for external links
  if (href) {
    const { href: _, ...anchorProps } = props as ComponentProps<"a"> & {
      href?: string;
    };
    return (
      <a
        href={href}
        className={buttonClassName}
        aria-busy={loading || anchorProps["aria-busy"]}
        {...anchorProps}
      >
        {showSpinner ? (
          <Spinner
            className={cn("shrink-0", loading ? "animate-spin" : "opacity-0")}
          />
        ) : null}
        {children}
      </a>
    );
  }

  // Render as button by default
  return (
    <button
      type={type}
      disabled={isDisabled}
      aria-busy={loading || props["aria-busy"]}
      className={buttonClassName}
      {...(props as ComponentProps<"button">)}
    >
      {showSpinner ? (
        <Spinner
          className={cn("shrink-0", loading ? "animate-spin" : "opacity-0")}
        />
      ) : null}
      {children}
    </button>
  );
}
