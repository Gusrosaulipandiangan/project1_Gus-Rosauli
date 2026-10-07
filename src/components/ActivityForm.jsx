import { useState } from "react";
import { ACTIVITIES } from "../utils/recommend";
import wilayah from "../data/wilayah.json";

// Default: Kota Medan, Sumatera Utara (jika tidak ketemu, pakai item pertama).
const defProv = Math.max(0, wilayah.findIndex((w) => w.p === "Sumatera Utara"));
const defReg = Math.max(0, wilayah[defProv].k.findIndex((k) => k[0] === "Kota Medan"));

export default function ActivityForm({ onSubmit, loading }) {
  const [prov, setProv] = useState(defProv);
  const [reg, setReg] = useState(defReg);
  const [time, setTime] = useState("16:00");
  const [duration, setDuration] = useState(2);
  const [activity, setActivity] = useState("commute");

  const handleSubmit = (e) => {
    e.preventDefault();
    const [name, lat, lng] = wilayah[prov].k[reg];
    onSubmit({
      place: { name, province: wilayah[prov].p, lat, lng },
      startHour: Number(time.slice(0, 2)), duration, activity,
    });
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <label className="field">
        <span>Provinsi</span>
        <select value={prov} onChange={(e) => { setProv(Number(e.target.value)); setReg(0); }}>
          {wilayah.map((w, i) => <option key={w.p} value={i}>{w.p}</option>)}
        </select>
      </label>
      <label className="field">
        <span>Kabupaten / Kota</span>
        <select value={reg} onChange={(e) => setReg(Number(e.target.value))}>
          {wilayah[prov].k.map((k, i) => <option key={k[0]} value={i}>{k[0]}</option>)}
        </select>
      </label>

      <div className="row">
        <label className="field">
          <span>Jam mulai</span>
          <input type="time" step="3600" value={time} onChange={(e) => setTime(e.target.value)} />
        </label>
        <label className="field">
          <span>Durasi</span>
          <select value={duration} onChange={(e) => setDuration(Number(e.target.value))}>
            {[1, 2, 3, 4, 6].map((n) => <option key={n} value={n}>{n} jam</option>)}
          </select>
        </label>
      </div>

      <fieldset className="field">
        <legend>Aktivitas</legend>
        <div className="choices">
          {Object.entries(ACTIVITIES).map(([key, a]) => (
            <button type="button" key={key} className={activity === key ? "choice on" : "choice"}
              aria-pressed={activity === key} onClick={() => setActivity(key)}>
              {a.label}
            </button>
          ))}
        </div>
      </fieldset>

      <button className="primary" disabled={loading}>{loading ? "Memeriksa prakiraan..." : "Cek hujan"}</button>
    </form>
  );
}