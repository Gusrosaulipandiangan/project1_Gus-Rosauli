import Scene from "./Scene";
import { conditionOf, fmtHour, ACTIVITIES } from "../utils/recommend";

const COPY = {
  bring:   { title: "Bawa payungmu", note: "Hujan kemungkinan besar turun saat kamu beraktivitas." },
  prepare: { title: "Siapkan payung lipat", note: "Ada kemungkinan hujan singkat, tapi belum pasti." },
  safe:    { title: "Kamu aman", note: "Peluang hujan kecil selama kamu di luar." },
};

// Selalu ter-mount, supaya Scene (dan payungnya) bisa bertransisi antar kondisi.
export default function Recommendation({ result, input, place, source, loading }) {
  const copy = result && COPY[result.verdict];
  return (
    <section className="card stage" aria-live="polite">
      <Scene level={result?.level ?? "idle"} loading={loading} />
      <div className="stage-body">
        {result ? (
          <>
            <p className="muted">{ACTIVITIES[input.activity].label}, {fmtHour(input.startHour)} selama {input.duration} jam di {place}</p>
            <h2 className={`verdict ${result.verdict}`}>{copy.title}</h2>
            <p>{copy.note}</p>
            <dl className="stats">
              <div><dt>Peluang hujan tertinggi</dt><dd>{result.peak}%</dd></div>
              <div><dt>Saat ini</dt><dd>{result.now.temp}&deg;C, {conditionOf(result.now.code)}</dd></div>
              <div><dt>Waktu terbaik hari ini</dt><dd>{fmtHour(result.best.hour)} (hujan {result.best.avg}%)</dd></div>
            </dl>
            {source === "demo" && <p className="notice">Menampilkan data contoh karena layanan cuaca tidak dapat dijangkau.</p>}
          </>
        ) : (
          <>
            <h2 className="verdict">Mau ke mana hari ini?</h2>
            <p className="muted">Isi rencanamu, lalu payung akan terbuka atau tetap tertutup.</p>
          </>
        )}
      </div>
    </section>
  );
}