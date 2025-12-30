import type { ComponentProps, PropsWithChildren } from "react";

import { cn } from "@/lib/cn";

export type CardPadding = "sm" | "md" | "lg" | "none";

type CardStyleOptions = {
  padding?: CardPadding;
};

export function cardClasses({ padding = "md" }: CardStyleOptions = {}) {
  const base =
    "rounded-xl border border-slate-800/80 bg-slate-900/60 shadow-md shadow-slate-900/40 backdrop-blur-sm transition";

  const paddings: Record<CardPadding, string> = {
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
    none: "",
  };

  return cn(base, paddings[padding]);
}

type BaseCardProps = CardStyleOptions &
  PropsWithChildren & {
    className?: string;
  };

export type CardProps = BaseCardProps & ComponentProps<"div">;

export function Card({
  padding = "md",
  className,
  children,
  ...props
}: CardProps) {
  const cardClassName = cn(cardClasses({ padding }), className);

  return (
    <div className={cardClassName} {...props}>
      {children}
    </div>
  );
}
