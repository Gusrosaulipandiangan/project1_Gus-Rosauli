import Umbrella from "./Umbrella";

// Posisi tetes hujan dibuat tetap (bukan random) supaya tidak berubah tiap render.
const DROPS = Array.from({ length: 24 }, (_, i) => ({
  left: (i * 37) % 100,
  delay: (i * 0.37) % 1.6,
  dur: 0.9 + (i % 5) * 0.12,
}));
const COUNT = { idle: 0, clear: 0, light: 9, heavy: 24 };

export default function Scene({ level, loading }) {
  return (
    <div className={`scene ${level}${loading ? " loading" : ""}`}>
      <span className="cloud c1" />
      <span className="cloud c2" />
      {DROPS.map((d, i) => (
        <i key={i} className="rain" style={{
          left: `${d.left}%`, animationDelay: `${d.delay}s`, animationDuration: `${d.dur}s`,
          opacity: i < COUNT[level] ? 1 : 0,
        }} />
      ))}
      <Umbrella level={level} />
    </div>
  );
}
