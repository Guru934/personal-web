"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, BookOpen, Check, Clock3, Plus, RotateCcw } from "lucide-react";
import "./study.css";

type Topic = { id: number; name: string; subject: string; progress: number };
type Session = { id: number; topic: string; minutes: number; date: string };

const starter: Topic[] = [
  { id: 1, name: "Functions", subject: "JavaScript", progress: 82 },
  { id: 2, name: "Arrays", subject: "JavaScript", progress: 64 },
  { id: 3, name: "DOM", subject: "JavaScript", progress: 25 },
  { id: 4, name: "Mechanics", subject: "Physics", progress: 78 },
  { id: 5, name: "Thermodynamics", subject: "Physics", progress: 48 },
];

function useStored<T>(key: string, initial: T) {
  const [value, setValue] = useState(initial);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    try { const saved = localStorage.getItem(key); if (saved) setValue(JSON.parse(saved)); }
    finally { setReady(true); }
  }, [key]);
  useEffect(() => { if (ready) localStorage.setItem(key, JSON.stringify(value)); }, [key, value, ready]);
  return [value, setValue] as const;
}

export default function StudyPage() {
  const [topics, setTopics] = useStored<Topic[]>("pos.study.topics", starter);
  const [sessions, setSessions] = useStored<Session[]>("pos.study.sessions", []);
  const [selected, setSelected] = useState<Topic | null>(null);
  const [seconds, setSeconds] = useState(1500);
  const [running, setRunning] = useState(false);
  const [newTopic, setNewTopic] = useState("");
  const [subject, setSubject] = useState("JavaScript");

  useEffect(() => {
    if (!running) return;
    const timer = setInterval(() => setSeconds(s => s > 0 ? s - 1 : 0), 1000);
    return () => clearInterval(timer);
  }, [running]);

  const grouped = useMemo(() => [...new Set(topics.map(t => t.subject))], [topics]);
  const completedMinutes = sessions.reduce((sum, s) => sum + s.minutes, 0);
  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");

  const startTopic = (topic: Topic) => { setSelected(topic); setSeconds(1500); setRunning(true); };
  const finishSession = () => {
    if (!selected) return;
    setSessions([{ id: Date.now(), topic: selected.name, minutes: Math.max(1, Math.round((1500 - seconds) / 60)), date: new Date().toLocaleDateString() }, ...sessions]);
    setTopics(topics.map(t => t.id === selected.id ? { ...t, progress: Math.min(100, t.progress + 3) } : t));
    setRunning(false); setSeconds(1500);
  };
  const addTopic = () => {
    if (!newTopic.trim()) return;
    setTopics([...topics, { id: Date.now(), name: newTopic.trim(), subject, progress: 0 }]);
    setNewTopic("");
  };

  return <main className="study-page">
    <header className="study-header">
      <a href="/" className="back-link"><ArrowLeft size={16}/> Dashboard</a>
      <div><p className="eyebrow">LEARN</p><h1>Study workspace</h1><p className="muted">Pick a topic, focus, and let your study history update your progress.</p></div>
    </header>

    <div className="study-layout">
      <section>
        <div className="study-section-head"><div><p className="eyebrow">YOUR CURRICULUM</p><h2>Subjects & topics</h2></div><span className="count">{topics.length} topics</span></div>
        <div className="study-subjects">
          {grouped.map(s => <section className="study-card" key={s}><div className="study-card-head"><h3>{s}</h3><span>{topics.filter(t => t.subject === s).length} topics</span></div>{topics.filter(t => t.subject === s).map(t => <div className="study-topic" key={t.id}>
            <div className="topic-info"><strong>{t.name}</strong><span>{t.progress}% complete</span></div>
            <div className="topic-progress"><i style={{width: `${t.progress}%`}}/></div>
            <button className="study-start" onClick={() => startTopic(t)}><Clock3 size={14}/> Focus</button>
          </div>)}</section>)}
        </div>

        <section className="study-card add-topic"><div><p className="eyebrow">CURRICULUM</p><h3>Add a topic</h3></div><div className="topic-form"><input value={newTopic} onChange={e => setNewTopic(e.target.value)} onKeyDown={e => e.key === "Enter" && addTopic()} placeholder="e.g. Closures"/><select value={subject} onChange={e => setSubject(e.target.value)}><option>JavaScript</option><option>Physics</option><option>General</option></select><button className="study-start" onClick={addTopic}><Plus size={14}/> Add</button></div></section>
      </section>

      <aside className="focus-panel">
        <section className="study-card focus-box"><p className="eyebrow">CURRENT FOCUS</p><h2>{selected?.subject || "Choose a topic"}{selected ? ` — ${selected.name}` : ""}</h2><div className="study-timer">{mm}:{ss}</div><p className="timer-label">{running ? "FOCUSING" : "READY TO FOCUS"}</p><div className="focus-buttons"><button className="study-start large" onClick={() => setRunning(!running)}>{running ? "Pause" : "Start Focus"}</button><button className="reset-btn" onClick={() => {setRunning(false);setSeconds(1500)}}><RotateCcw size={15}/></button></div>{selected && <button className="finish-btn" onClick={finishSession}><Check size={15}/> Finish & record session</button>}</section>
        <section className="study-card history"><div className="study-card-head"><h3>Study history</h3><span>{completedMinutes} min</span></div>{sessions.length === 0 ? <p className="muted">Finish your first focus session and it will appear here.</p> : sessions.slice(0,5).map(s => <div className="history-row" key={s.id}><BookOpen size={15}/><span><strong>{s.topic}</strong><small>{s.date}</small></span><b>{s.minutes}m</b></div>)}</section>
      </aside>
    </div>
  </main>;
}
