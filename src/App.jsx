import { useState } from "react";
import ActivityForm from "./components/ActivityForm";
import Recommendation from "./components/Recommendation";
import HourlyTimeline from "./components/HourlyTimeline";
import Umbrella from "./components/Umbrella";
import { getWeather } from "./services/weatherService";
import { recommend } from "./utils/recommend";

export default function App() {
  const [phase, setPhase] = useState("locked"); // locked -> opening -> open
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);

  // Klik payung: payung membuka, lalu formulir yang blur menjadi jelas.
  const start = () => {
    if (phase !== "locked") return;
    setPhase("opening");
    setTimeout(() => setPhase("open"), 900);
  };

  const handleSubmit = async (input) => {
    setLoading(true);
    const [weather] = await Promise.all([
      getWeather(input.place),
      new Promise((r) => setTimeout(r, 900)), // beri waktu payung bergoyang sebelum membuka
    ]);
    setData({ weather, input, result: recommend({ ...weather, ...input }) });
    setLoading(false);
  };

  return (
    <div className="page">
      <header className="top"><h1>RainSafe</h1><p className="muted">Cek cuaca sebelum melangkah keluar.</p></header>
      <main className="layout">
        <aside className={`card side gate ${phase}`}>
          <h2>Rencanakan perjalananmu</h2>
          <div className="gate-content" inert={phase === "open" ? undefined : ""}>
            <ActivityForm onSubmit={handleSubmit} loading={loading} />
          </div>
          {phase !== "open" && (
            <button type="button" className="gate-btn" onClick={start} aria-label="Buka formulir">
              <Umbrella level={phase === "opening" ? "light" : "idle"} size={110} />
              <span>Ketuk payung untuk mulai</span>
            </button>
          )}
        </aside>
        <div className="dash">
          <Recommendation result={data?.result} input={data?.input} place={data?.weather.place}
            source={data?.weather.source} loading={loading} />
          {data && (
            <HourlyTimeline hours={data.weather.hours} from={data.result.cur}
              windowStart={data.result.start} windowEnd={data.result.end} />
          )}
        </div>
      </main>
    </div>
  );
}