import Link from "next/link";

import type { ComponentProps } from "react";

import { cn } from "@/lib/cn";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "danger"
  | "link";

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
    outline: `border border-slate-700 bg-transparent text-slate-200 ${hover}:border-blue-500/60 ${hover}:bg-blue-500/10`,
    ghost: `border border-slate-700/80 bg-slate-900/40 text-slate-300 ${hover}:bg-slate-900 ${hover}:text-slate-100`,
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

export type ButtonProps = Omit<
  ComponentProps<"button">,
  "disabled" | "className"
> &
  ButtonStyleOptions & {
    className?: string;
    disabled?: boolean;
    loading?: boolean;
    withSpinner?: boolean;
  };

export function Button({
  variant = "secondary",
  size = "md",
  fullWidth = false,
  disabled,
  loading,
  withSpinner,
  className,
  children,
  type = "button",
  ...props
}: ButtonProps) {
  const isDisabled = Boolean(disabled || loading);
  const showSpinner = Boolean(loading || withSpinner);

  return (
    <button
      type={type}
      disabled={isDisabled}
      aria-busy={loading || props["aria-busy"]}
      className={cn(buttonClasses({ variant, size, fullWidth }), className)}
      {...props}
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

export type ButtonLinkProps = Omit<ComponentProps<typeof Link>, "className"> &
  ButtonStyleOptions & {
    className?: string;
  };

export function ButtonLink({
  variant = "secondary",
  size = "md",
  fullWidth = false,
  className,
  ...props
}: ButtonLinkProps) {
  return (
    <Link
      className={cn(
        buttonClasses({ variant, size, fullWidth, interactive: "link" }),
        className,
      )}
      {...props}
    />
  );
}

export type ButtonAnchorProps = Omit<ComponentProps<"a">, "className"> &
  ButtonStyleOptions & {
    className?: string;
  };

export function ButtonAnchor({
  variant = "secondary",
  size = "md",
  fullWidth = false,
  className,
  ...props
}: ButtonAnchorProps) {
  return (
    <a
      className={cn(
        buttonClasses({ variant, size, fullWidth, interactive: "link" }),
        className,
      )}
      {...props}
    />
  );
}
