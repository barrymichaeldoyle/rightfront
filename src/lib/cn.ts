type ClassValue =
  | string
  | number
  | null
  | undefined
  | false
  | Record<string, boolean>
  | ClassValue[];

function toClassName(v: ClassValue): string {
  if (!v) return "";
  if (typeof v === "string" || typeof v === "number") return String(v);
  if (Array.isArray(v)) return v.map(toClassName).filter(Boolean).join(" ");
  return Object.entries(v)
    .filter(([, on]) => Boolean(on))
    .map(([k]) => k)
    .join(" ");
}

export function cn(...values: ClassValue[]): string {
  return values.map(toClassName).filter(Boolean).join(" ");
}
