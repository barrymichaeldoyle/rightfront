import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 1200, height: 600 };
export const contentType = "image/png";

export default function TwitterImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: 72,
        background: "#020617",
        color: "#e2e8f0",
      }}
    >
      <div style={{ fontSize: 64, fontWeight: 800, letterSpacing: -1 }}>
        RightFront
      </div>
      <div style={{ marginTop: 16, fontSize: 34, fontWeight: 600 }}>
        Smart App Store links that work worldwide
      </div>
      <div style={{ marginTop: 18, fontSize: 26, opacity: 0.85 }}>
        Avoid “Not Available” dead ends.
      </div>
    </div>,
    size,
  );
}
