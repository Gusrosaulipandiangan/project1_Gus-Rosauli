// Data dummy: dipakai saat API gagal / offline. Pola hujan berbeda per kota (seed dari nama kota).
const pad = (n) => String(n).padStart(2, "0");
const iso = (d) =>
  `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:00`;

export function buildFallback(city) {
  const name = city?.trim() || "Jakarta";
  const seed = [...name].reduce((a, c) => a + c.charCodeAt(0), 0);
  const peak = seed % 24;
  const start = new Date();
  start.setMinutes(0, 0, 0);

  const hours = Array.from({ length: 48 }, (_, i) => {
    const d = new Date(start.getTime() + i * 3600000);
    const h = d.getHours();
    const gap = Math.abs(h - peak);
    const dist = Math.min(gap, 24 - gap);
    const rain = Math.min(95, Math.max(5, Math.round(85 - dist * 14 + (seed % 10))));
    const temp = Math.round(28 + 4 * Math.sin(((h - 8) / 24) * 2 * Math.PI) - rain / 40);
    return { time: iso(d), temp, rain, code: rain > 60 ? 63 : rain > 30 ? 3 : 1 };
  });
  return { place: name, hours, now: hours[0].time };
}
