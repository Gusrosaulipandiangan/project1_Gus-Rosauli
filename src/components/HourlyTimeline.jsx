import { hourOf, fmtHour, levelOf } from "../utils/recommend";

export default function HourlyTimeline({ hours, from, windowStart, windowEnd }) {
  const items = hours.slice(from, from + 24).map((h, i) => ({ ...h, idx: from + i }));
  return (
    <section className="card timeline-card">
      <h3>24 jam ke depan</h3>
      <p className="muted">Jam yang disorot adalah waktu aktivitasmu.</p>
      <ol className="timeline">
        {items.map((h) => {
          const active = h.idx >= windowStart && h.idx < windowEnd;
          return (
            <li key={h.time} className={active ? "slot active" : "slot"}>
              <span className="pct">{h.rain}%</span>
              <span className="track"><span className={`bar ${levelOf(h.rain)}`} style={{ height: `${Math.max(h.rain, 4)}%` }} /></span>
              <span className="temp">{h.temp}&deg;</span>
              <span className="hr">{fmtHour(hourOf(h.time))}</span>
            </li>
          );
        })}
      </ol>
    </section>
  );
}