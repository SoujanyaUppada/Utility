import React, { useState } from "react";
import "./App.css";

const API = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000/api";

function Weather() {
  const [city, setCity] = useState("");
  const [res, setRes] = useState(null);
  const [load, setLoad] = useState(false);
  const [err, setErr] = useState("");

  const fetch = async () => {
    setLoad(true); setErr(""); setRes(null);
    try {
      const r = await window.fetch(`${API}/weather/${city}`);
      const j = await r.json();
      if (!r.ok) throw new Error(j.error || "Error");
      setRes(j);
    } catch (e) { setErr(e.message); }
    finally { setLoad(false); }
  };

  return (
    <div className="card">
      <h2>Weather</h2>
      <input placeholder="City" value={city} onChange={e=>setCity(e.target.value)} />
      <button onClick={fetch} disabled={load}>Go</button>
      {load && <p>Loading...</p>}
      {err && <p className="error">{err}</p>}
      {res && (
        <div>
          <p><strong>{res.city}</strong></p>
          <p>{res.temp} °C – {res.description}</p>
          <p>Humidity: {res.humidity}%</p>
        </div>
      )}
    </div>
  );
}

function Converter() {
  const [amt, setAmt] = useState("");
  const [cur, setCur] = useState("USD");
  const [res, setRes] = useState(null);
  const [load, setLoad] = useState(false);
  const [err, setErr] = useState("");

  const fetch = async () => {
    setLoad(true); setErr(""); setRes(null);
    try {
      const r = await window.fetch(`${API}/convert/${amt}/${cur}`);
      const j = await r.json();
      if (!r.ok) throw new Error(j.error || "Error");
      setRes(j);
    } catch (e) { setErr(e.message); }
    finally { setLoad(false); }
  };

  return (
    <div className="card">
      <h2>INR → USD/EUR</h2>
      <input type="number" placeholder="INR" value={amt} onChange={e=>setAmt(e.target.value)} />
      <select value={cur} onChange={e=>setCur(e.target.value)}>
        <option>USD</option><option>EUR</option>
      </select>
      <button onClick={fetch} disabled={load}>Convert</button>
      {load && <p>Loading...</p>}
      {err && <p className="error">{err}</p>}
      {res && (
        <div>
          <p>{res.converted} {cur}</p>
          <p>Rate: 1 INR = {res.rate} {cur}</p>
        </div>
      )}
    </div>
  );
}

function Quote() {
  const [res, setRes] = useState(null);
  const [load, setLoad] = useState(false);
  const [err, setErr] = useState("");

  const fetch = async () => {
    setLoad(true); setErr(""); setRes(null);
    try {
      const r = await window.fetch(`${API}/quote`);
      const j = await r.json();
      if (!r.ok) throw new Error(j.error || "Error");
      setRes(j);
    } catch (e) { setErr(e.message); }
    finally { setLoad(false); }
  };

  return (
    <div className="card">
      <h2>Motivational Quote</h2>
      <button onClick={fetch} disabled={load}>New Quote</button>
      {load && <p>Loading...</p>}
      {err && <p className="error">{err}</p>}
      {res && (
        <blockquote>
          <p>“{res.quote}”</p>
          <footer>— {res.author}</footer>
        </blockquote>
      )}
    </div>
  );
}

export default function App() {
  const [tab, setTab] = useState("weather");
  return (
    <div className="App">
      <h1>Utility App</h1>
      <div className="tabs">
        <button className={tab==="weather"?"active":""} onClick={()=>setTab("weather")}>Weather</button>
        <button className={tab==="convert"?"active":""} onClick={()=>setTab("convert")}>Converter</button>
        <button className={tab==="quote"?"active":""} onClick={()=>setTab("quote")}>Quote</button>
      </div>

      {tab==="weather" && <Weather />}
      {tab==="convert" && <Converter />}
      {tab==="quote" && <Quote />}
    </div>
  );
}