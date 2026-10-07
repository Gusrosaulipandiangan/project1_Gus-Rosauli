// Toleransi = batas probabilitas hujan (%) sebelum payung disarankan.
export const ACTIVITIES = {
  commute: { label: "Perjalanan", tolerance: 40 },
  running: { label: "Lari", tolerance: 25 },
  outdoor: { label: "Acara luar ruang", tolerance: 30 },
  errands: { label: "Urusan singkat", tolerance: 50 },
};

export const hourOf = (t) => Number(t.slice(11, 13));
export const fmtHour = (h) => `${String(h).padStart(2, "0")}:00`;

export const levelOf = (rain) => (rain >= 60 ? "heavy" : rain >= 30 ? "light" : "clear");

export function conditionOf(code) {
  if (code >= 95) return "Badai petir";
  if (code >= 61) return "Hujan";
  if (code >= 51) return "Gerimis";
  if (code >= 45) return "Berkabut";
  if (code >= 3) return "Berawan";
  if (code >= 1) return "Cerah berawan";
  return "Cerah";
}

export function recommend({ hours, now, startHour, duration, activity }) {
  const cur = Math.max(0, hours.findIndex((h) => h.time.slice(0, 13) === now.slice(0, 13)));
  let start = hours.findIndex((h, i) => i >= cur && hourOf(h.time) === startHour);
  if (start < 0) start = cur;

  const window = hours.slice(start, start + duration);
  const peak = Math.max(...window.map((h) => h.rain));
  const tol = ACTIVITIES[activity].tolerance;
  const verdict = peak >= tol ? "bring" : peak >= tol - 15 ? "prepare" : "safe";

  // Jam terbaik: rata-rata hujan terendah dalam 12 jam ke depan.
  let best = { idx: cur, avg: Infinity };
  for (let i = cur; i <= cur + 12 && i + duration <= hours.length; i++) {
    const slice = hours.slice(i, i + duration);
    const avg = slice.reduce((s, h) => s + h.rain, 0) / slice.length;
    if (avg < best.avg) best = { idx: i, avg: Math.round(avg) };
  }

  return {
    verdict, peak, level: levelOf(peak), cur, start, end: start + duration,
    now: hours[cur], best: { hour: hourOf(hours[best.idx].time), avg: best.avg },
  };
}