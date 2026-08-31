"use client";
import { useEffect, useState } from "react";
import { ArrowLeft, CalendarDays, Plus, Trash2 } from "lucide-react";
import { useSupabaseSync } from "@/lib/useSupabaseSync";
import { createSupabaseBrowserClient } from "@/lib/supabase-browser";
import "./timetable.css";

type Block = { id: number; day: string; time: string; title: string; topic: string };

const seed: Block[] = [
  { id: 1, day: "Monday", time: "10:30", title: "JavaScript study", topic: "Functions" },
  { id: 3, day: "Wednesday", time: "19:00", title: "Review & recall", topic: "Functions" },
];

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export default function TimetablePage() {
  const [userId, setUserId] = useState<string | undefined>();
  const { data: blocks, updateData: setBlocks, syncState } = useSupabaseSync<Block[]>(
    "timetable",
    "pos.timetable",
    seed,
    userId
  );

  const [day, setDay] = useState("Monday");
  const [time, setTime] = useState("10:00");
  const [title, setTitle] = useState("");
  const [topic, setTopic] = useState("");

  useEffect(() => {
    const getUser = async () => {
      const client = createSupabaseBrowserClient();
      if (client) {
        const { data: { user } } = await client.auth.getUser();
        if (user) setUserId(user.id);
      }
    };
    getUser();
  }, []);

  const add = () => {
    if (title.trim()) {
      setBlocks((x) => [
        ...x,
        { id: Date.now(), day, time, title: title.trim(), topic: topic.trim() || "General" },
      ]);
      setTitle("");
      setTopic("");
    }
  };

  return (
    <main className="timetable-page">
      <a href="/" className="back">
        <ArrowLeft size={16} /> Personal OS
      </a>
      <p>PLAN</p>
      <h1>Timetable</h1>
      <span>A lightweight weekly plan. Study blocks can start focus immediately.</span>
      <small style={{ color: syncState === "synced" ? "#3d8c61" : "#999" }}>
        {syncState === "synced" ? "☁️ Cloud synced" : "💾 Local mode"}
      </small>

      <section className="add-block">
        <select value={day} onChange={(e) => setDay(e.target.value)}>
          {days.map((d) => (
            <option key={d}>{d}</option>
          ))}
        </select>
        <input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
        />
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Activity"
        />
        <input
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="Topic"
        />
        <button onClick={add}>
          <Plus size={16} /> Add
        </button>
      </section>

      <section className="timetable">
        {days.map((d) => {
          const dayBlocks = blocks.filter((b) => b.day === d);
          return (
            <div key={d} className="day-column">
              <h3>{d}</h3>
              {dayBlocks.map((b) => (
                <div key={b.id} className="block">
                  <div>
                    <strong>{b.time}</strong>
                    <p>{b.title}</p>
                    <small>{b.topic}</small>
                  </div>
                  <button
                    onClick={() =>
                      setBlocks((x) => x.filter((item) => item.id !== b.id))
                    }
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          );
        })}
      </section>
    </main>
  );
}
