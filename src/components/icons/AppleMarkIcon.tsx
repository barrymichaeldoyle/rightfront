import { ReactElement } from "react";

export function AppleMarkIcon({
  className,
}: {
  className?: string;
}): ReactElement {
  // Simple Apple-like glyph; keeps us dependency-free and style-consistent.
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <path
        fill="currentColor"
        d="M16.78 13.44c.02 2.21 1.95 2.94 1.97 2.95-.01.05-.31 1.07-1.02 2.12-.61.91-1.25 1.82-2.25 1.84-.98.02-1.29-.57-2.41-.57-1.12 0-1.46.55-2.39.59-.96.04-1.7-.99-2.32-1.9-1.26-1.84-2.23-5.2-.93-7.48.65-1.13 1.8-1.84 3.05-1.86.95-.02 1.84.63 2.41.63.57 0 1.64-.78 2.76-.67.47.02 1.8.19 2.66 1.44-.07.04-1.59.93-1.53 2.91ZM14.98 5.73c.51-.62.85-1.48.76-2.33-.73.03-1.61.49-2.13 1.11-.47.55-.88 1.44-.77 2.29.81.06 1.63-.41 2.14-1.07Z"
      />
    </svg>
  );
}


