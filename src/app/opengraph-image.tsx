import { ImageResponse } from "next/og";

import { features } from "@/lib/features";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  const androidEnabled = features.androidEnabled;
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
      <div style={{ marginTop: 16, fontSize: 36, fontWeight: 600 }}>
        {androidEnabled
          ? "Geo-aware App Store & Play Store links"
          : "Geo-aware App Store links"}
      </div>
      <div style={{ marginTop: 18, fontSize: 26, opacity: 0.85 }}>
        Send every user to the right storefront—worldwide.
      </div>
    </div>,
    size,
  );
}
