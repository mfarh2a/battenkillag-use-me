import { ImageResponse } from "next/og";
import { readFileSync } from "fs";
import { join } from "path";

export const alt = "Battenkill Ag: reliable H-2A service for farming families";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  const logo = "data:image/svg+xml;base64," + readFileSync(join(process.cwd(), "public/brand/battenkill-ag-logo.svg")).toString("base64");
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
        <img src={logo} width={386} height={90} alt="" />
        <div style={{ fontSize: 76, fontWeight: 700, marginTop: 24, lineHeight: 1.1 }}>Reliable H-2A service for farming families</div>
        <div style={{ fontSize: 34, marginTop: 28, color: "#5e5446" }}>
          A dedicated team by your side all season.
        </div>
        <div style={{ display: "flex", marginTop: 48, height: 12, width: 320, background: "#a0a824", borderRadius: 6 }} />
      </div>
    ),
    size,
  );
}
