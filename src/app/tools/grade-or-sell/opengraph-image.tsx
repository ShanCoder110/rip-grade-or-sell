import { ImageResponse } from "next/og";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 48,
          background: "#0f172a",
          color: "#f8fafc",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 48,
        }}
      >
        <div style={{ fontSize: 32, opacity: 0.8 }}>Grade or Sell</div>
        <div>Expected net vs raw — fee-aware</div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
