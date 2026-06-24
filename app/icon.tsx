import { ImageResponse } from "next/og";

export const size = {
  width: 64,
  height: 64,
};

export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #7b2d10 0%, #c17b2d 100%)",
          color: "#fff8ea",
          fontSize: 44,
          fontWeight: 700,
          letterSpacing: "-0.04em",
          borderRadius: 14,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 52,
            height: 52,
            borderRadius: 12,
            border: "2px solid rgba(255, 248, 234, 0.7)",
            boxShadow: "inset 0 0 0 1px rgba(123, 45, 16, 0.18)",
          }}
        >
          க
        </div>
        <span style={{ display: "none" }}>Komala Vilas</span>
      </div>
    ),
    size,
  );
}
