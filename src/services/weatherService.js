import { buildFallback } from "../data/fallbackWeather";

// Open-Meteo: gratis, tanpa API key. Koordinat sudah ada di data wilayah, jadi tanpa geocoding.
const FORECAST_URL = "https://api.open-meteo.com/v1/forecast";

export async function getWeather({ name, province, lat, lng }) {
  const place = `${name}, ${province}`;
  try {
    const params = new URLSearchParams({
      latitude: lat, longitude: lng, timezone: "auto", forecast_days: 2,
      hourly: "temperature_2m,precipitation_probability,weather_code",
      current: "temperature_2m",
    });
    const res = await fetch(`${FORECAST_URL}?${params}`);
    if (!res.ok) throw new Error("Forecast failed");
    const f = await res.json();

    const hours = f.hourly.time.map((time, i) => ({
      time,
      temp: Math.round(f.hourly.temperature_2m[i]),
      rain: f.hourly.precipitation_probability[i] ?? 0,
      code: f.hourly.weather_code[i],
    }));
    return { place, hours, now: f.current.time, source: "live" };
  } catch {
    return { ...buildFallback(name), place, source: "demo" };
  }
}