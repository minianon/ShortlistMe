import { ImageResponse } from "next/og";

export const alt = "ShortlistMe — turn your resume into a portfolio website";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** The share card for the home page (and any page without its own image). */
export default function OpengraphImage() {
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
          background: "linear-gradient(135deg, #04130d 0%, #0b2e22 100%)",
          color: "#ecfdf5",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ fontSize: 34, color: "#34d399", fontWeight: 700, letterSpacing: 1 }}>ShortlistMe</div>
        <div style={{ fontSize: 72, fontWeight: 800, lineHeight: 1.1, marginTop: 24, maxWidth: 950 }}>
          Turn your resume into a portfolio website in seconds
        </div>
        <div style={{ fontSize: 32, marginTop: 32, color: "#a7f3d0" }}>Upload a PDF · AI builds it · Share your link</div>
        <div style={{ fontSize: 28, marginTop: 48, color: "#6ee7b7" }}>shortlistme.site</div>
      </div>
    ),
    size,
  );
}
