// Payung SVG: tertutup (clear/idle), setengah terbuka (light), terbuka penuh (heavy).
const STATE = {
  idle:  { scale: 0.24, tilt: 0 },
  clear: { scale: 0.24, tilt: 0 },
  light: { scale: 0.72, tilt: -7 },
  heavy: { scale: 1, tilt: 0 },
};

export default function Umbrella({ level = "idle", size = 190 }) {
  const { scale, tilt } = STATE[level];
  const ink = level === "heavy" ? "#eef3f8" : "#1f3a5f"; // terang di latar gelap
  const fade = { fill: ink, stroke: ink, transition: "fill .7s ease, stroke .7s ease" };
  return (
    <svg className="umbrella" width={size} height={size * 1.1} viewBox="0 0 120 132" aria-hidden="true">
      <g style={{ transform: `rotate(${tilt}deg)`, transformOrigin: "60px 70px", transition: "transform .7s ease" }}>
        <path d="M60 60 V108 q0 11 -11 11 q-9 0 -9 -9" style={{ ...fade, fill: "none" }} strokeWidth="3" strokeLinecap="round" />
        <g style={{ transform: `scaleX(${scale})`, transformOrigin: "60px 60px", transition: "transform .9s cubic-bezier(.3,1.25,.5,1)" }}>
          <path d="M8 60 Q60 -14 112 60 Q97 51 86 60 Q73 51 60 60 Q47 51 34 60 Q23 51 8 60Z" style={{ ...fade, stroke: "none" }} />
        </g>
        <circle cx="60" cy="14" r="2.2" style={{ ...fade, stroke: "none" }} />
      </g>
    </svg>
  );
}
