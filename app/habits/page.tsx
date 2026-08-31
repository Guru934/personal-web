"use client";
import { useEffect, useState } from "react";
import { ArrowLeft, Check, Flame, Plus, Trash2 } from "lucide-react";
import { useSupabaseSync } from "@/lib/useSupabaseSync";
import { createSupabaseBrowserClient } from "@/lib/supabase-browser";
import "./habits.css";

type Habit = { id: number; name: string; days: boolean[] };

const week = ["M", "T", "W", "T", "F", "S", "S"];
const seed: Habit[] = [
  { id: 1, name: "Study for 25 minutes", days: [true, true, false, true, true, false, false] },
  { id: 2, name: "Code daily", days: [true, true, true, true, true, true, false] },
  { id: 3, name: "Review flashcards", days: [true, false, true, true, false, false, false] },
];

export default function HabitsPage() {
  const [userId, setUserId] = useState<string | undefined>();
  const { data: habits, updateData: setHabits, syncState } = useSupabaseSync<Habit[]>(
    "habits",
    "pos.habits",
    seed,
    userId
  );

  const [name, setName] = useState("");

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
    if (name.trim()) {
      setHabits((x) => [
        ...x,
        { id: Date.now(), name: name.trim(), days: Array(7).fill(false) },
      ]);
      setName("");
    }
  };

  const streak = (days: boolean[]) => {
    let n = 0;
    for (let i = days.length - 1; i >= 0 && days[i]; i--) n++;
    return n;
  };

  const completion = habits.length
    ? Math.round(
        (habits.reduce((n, h) => n + h.days.filter(Boolean).length, 0) /
          (habits.length * 7)) *
          100
      )
    : 0;

  return (
    <main className="habits-page">
      <a href="/" className="back">
        <ArrowLeft size={16} /> Personal OS
      </a>
      <p>LIFE</p>
      <h1>Habits</h1>
      <span>Build consistency with a small weekly check-in.</span>
      <small style={{ color: syncState === "synced" ? "#3d8c61" : "#999" }}>
        {syncState === "synced" ? "☁️ Cloud synced" : "💾 Local mode"}
      </small>

      <section className="habit-summary">
        <Flame size={18} />
        <b>{completion}%</b>
        <small>weekly completion</small>
      </section>

      <section className="habit-list">
        {habits.map((habit) => (
          <article key={habit.id}>
            <header>
              <div>
                <h2>{habit.name}</h2>
                <small>{streak(habit.days)} day streak</small>
              </div>
              <button
                onClick={() =>
                  setHabits((x) => x.filter((item) => item.id !== habit.id))
                }
              >
                <Trash2 size={14} />
              </button>
            </header>
            <div className="days">
              {habit.days.map((checked, index) => (
                <button
                  key={index}
                  className={checked ? "checked" : ""}
                  onClick={() =>
                    setHabits((x) =>
                      x.map((item) =>
                        item.id === habit.id
                          ? {
                              ...item,
                              days: item.days.map((day, i) =>
                                i === index ? !day : day
                              ),
                            }
                          : item
                      )
                    )
                  }
                >
                  {checked && <Check size={13} />}
                  <span>{week[index]}</span>
                </button>
              ))}
            </div>
          </article>
        ))}
        <div className="add">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && add()}
            placeholder="Add a habit..."
          />
          <button onClick={add}>
            <Plus size={16} /> Add habit
          </button>
        </div>
      </section>
    </main>
  );
}
