import { ImageResponse } from "next/og";

export const alt = "Orra: reliable, low-cost H-2A for farming families";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "linear-gradient(180deg, #eaf2f9 0%, #fbfaf6 100%)",
          color: "#3b2a16",
        }}
      >
        <div style={{ fontSize: 40, fontWeight: 700, color: "#b8553a", letterSpacing: 2 }}>ORRA</div>
        <div style={{ fontSize: 76, fontWeight: 700, marginTop: 24, lineHeight: 1.1 }}>Reliable, low-cost H-2A for farming families.</div>
        <div style={{ fontSize: 34, marginTop: 28, color: "#5e5446" }}>
          One person on your side all season.
        </div>
        <div style={{ display: "flex", marginTop: 48, height: 12, width: 320, background: "#a0a824", borderRadius: 6 }} />
      </div>
    ),
    size,
  );
}
