"use client";

import { useEffect, useState } from "react";
import { BookOpen, Check, Clock3, FileText, Film, Flame, Goal, Home, LayoutGrid, ListTodo, Menu, Play, Plus, Search, Settings, Sparkles, Target, TimerReset, X } from "lucide-react";

const nav = [
  { label: "Dashboard", icon: Home },
  { label: "Study", icon: BookOpen },
  { label: "Notes", icon: FileText },
  { label: "Tasks", icon: ListTodo },
  { label: "Timetable", icon: LayoutGrid },
  { label: "Goals", icon: Target },
  { label: "Habits", icon: Flame },
  { label: "Resources", icon: BookOpen },
  { label: "Media", icon: Film },
];

const initialTasks = [
  { id: 1, text: "Complete JavaScript Functions", done: false },
  { id: 2, text: "Revise Physics formulas", done: false },
  { id: 3, text: "Complete a freeCodeCamp lesson", done: true },
];

export default function HomePage() {
  const [tasks, setTasks] = useState(initialTasks);
  const [scratch, setScratch] = useState("");
  const [seconds, setSeconds] = useState(25 * 60);
  const [running, setRunning] = useState(false);
  const [active, setActive] = useState("Dashboard");
  const [sidebar, setSidebar] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("personal-os");
    if (saved) {
      const data = JSON.parse(saved);
      if (data.tasks) setTasks(data.tasks);
      if (typeof data.scratch === "string") setScratch(data.scratch);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("personal-os", JSON.stringify({ tasks, scratch }));
  }, [tasks, scratch]);

  useEffect(() => {
    if (!running) return;
    const timer = setInterval(() => setSeconds((s) => s > 0 ? s - 1 : 0), 1000);
    return () => clearInterval(timer);
  }, [running]);

  const toggleTask = (id: number) => setTasks(tasks.map(t => t.id === id ? { ...t, done: !t.done } : t));
  const mins = String(Math.floor(seconds / 60)).padStart(2, "0");
  const secs = String(seconds % 60).padStart(2, "0");
  const completed = tasks.filter(t => t.done).length;

  return (
    <main className="app-shell">
      <aside className={`sidebar ${sidebar ? "open" : "closed"}`}>
        <div className="brand"><div className="brand-mark">P</div>{sidebar && <div><strong>Personal OS</strong><span>your learning system</span></div>}</div>
        <nav>{nav.map(({ label, icon: Icon }) => <button key={label} className={active === label ? "nav-item active" : "nav-item"} onClick={() => setActive(label)}><Icon size={18}/>{sidebar && label}</button>)}</nav>
        <div className="sidebar-bottom"><button className="nav-item"><Settings size={18}/>{sidebar && "Settings"}</button></div>
      </aside>

      <section className="content">
        <header className="topbar">
          <button className="icon-btn" onClick={() => setSidebar(!sidebar)}><Menu size={20}/></button>
          <div className="search"><Search size={17}/><span>Search everything...</span><kbd>⌘ K</kbd></div>
          <button className="ai-btn"><Sparkles size={16}/> AI</button>
        </header>

        <div className="page">
          <div className="welcome"><div><p className="eyebrow">SATURDAY · AUGUST 29, 2026</p><h1>Good morning, Guru.</h1><p className="muted">Build momentum. One focused block at a time.</p></div><div className="status-pill"><span/> System ready</div></div>

          <div className="grid top-grid">
            <section className="card priority-card"><div className="card-head"><div><p className="eyebrow">TODAY'S TOP 3</p><h2>What matters today</h2></div><span className="count">{completed}/{tasks.length}</span></div>{tasks.map(task => <button className="task-row" key={task.id} onClick={() => toggleTask(task.id)}><span className={`checkbox ${task.done ? "checked" : ""}`}>{task.done && <Check size={13}/>}</span><span className={task.done ? "done" : ""}>{task.text}</span></button>)}</section>

            <section className="card focus-card"><div className="card-head"><div><p className="eyebrow">CURRENT FOCUS</p><h2>JavaScript — Functions</h2></div><Clock3 size={20}/></div><div className="timer">{mins}:{secs}</div><div className="timer-label">{running ? "FOCUSING" : "READY TO FOCUS"}</div><div className="timer-actions"><button className="primary" onClick={() => setRunning(!running)}><Play size={16} fill="currentColor"/>{running ? "Pause" : "Start Focus"}</button><button className="secondary" onClick={() => {setRunning(false);setSeconds(25*60)}}><TimerReset size={16}/></button></div></section>
          </div>

          <div className="grid middle-grid">
            <section className="card"><div className="card-head"><div><p className="eyebrow">CONTINUE LEARNING</p><h2>freeCodeCamp</h2></div><BookOpen size={20}/></div><div className="resource"><div className="resource-icon">JS</div><div className="resource-main"><strong>JavaScript Algorithms</strong><span>Last session · Yesterday</span><div className="progress"><i style={{width:"42%"}}/></div><small>42% complete</small></div><a className="primary small" href="https://www.freecodecamp.org/learn/" target="_blank">Continue</a></div></section>
            <section className="card"><div className="card-head"><div><p className="eyebrow">TODAY</p><h2>Momentum</h2></div><Flame size={20}/></div><div className="stats"><div><strong>2h 15m</strong><span>Focus</span></div><div><strong>3h 05m</strong><span>Study</span></div><div><strong>{completed}/{tasks.length}</strong><span>Tasks</span></div></div></section>
          </div>

          <div className="grid bottom-grid">
            <section className="card scratch-card"><div className="card-head"><div><p className="eyebrow">QUICK CAPTURE</p><h2>Daily dump</h2></div><Plus size={20}/></div><textarea value={scratch} onChange={e => setScratch(e.target.value)} placeholder="Formula, thought, reminder... capture it before it disappears."/><div className="scratch-foot"><span>Saved automatically</span><span>{scratch.length} characters</span></div></section>
            <section className="card"><div className="card-head"><div><p className="eyebrow">UP NEXT</p><h2>Today's timetable</h2></div><LayoutGrid size={20}/></div><div className="schedule"><div><b>10:30</b><span>freeCodeCamp · JavaScript</span></div><div><b>14:00</b><span>Physics · Revision</span></div><div><b>17:00</b><span>Exercise</span></div><div><b>19:00</b><span>Review & recall</span></div></div></section>
          </div>

          <footer><span>Personal OS · V1</span><span>Local-first · Your data stays in your browser</span></footer>
        </div>
      </section>
    </main>
  );
}
