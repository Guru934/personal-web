"use client";
import { useEffect, useState } from "react";
import { ArrowLeft, ExternalLink, Plus, Trash2 } from "lucide-react";
import { useSupabaseSync } from "@/lib/useSupabaseSync";
import { createSupabaseBrowserClient } from "@/lib/supabase-browser";
import "./resources.css";

type Resource = { id: number; title: string; url: string; topic: string; progress: number };

const seed: Resource[] = [
  {
    id: 1,
    title: "JavaScript Algorithms and Data Structures",
    url: "https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures-v8/",
    topic: "Functions",
    progress: 42,
  },
];

export default function ResourcesPage() {
  const [userId, setUserId] = useState<string | undefined>();
  const { data: items, updateData: setItems, syncState } = useSupabaseSync<Resource[]>(
    "resources",
    "pos.resources",
    seed,
    userId
  );

  const [form, setForm] = useState({ title: "", url: "", topic: "" });

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
    if (form.title.trim() && form.url.trim()) {
      setItems((x) => [
        ...x,
        { id: Date.now(), ...form, progress: 0 },
      ]);
      setForm({ title: "", url: "", topic: "" });
    }
  };

  return (
    <main className="resources">
      <a href="/" className="back">
        <ArrowLeft size={16} /> Personal OS
      </a>
      <p>LEARN</p>
      <h1>Resources</h1>
      <span>Keep courses, documentation, and useful links connected to your study topics.</span>
      <small style={{ color: syncState === "synced" ? "#3d8c61" : "#999" }}>
        {syncState === "synced" ? "☁️ Cloud synced" : "💾 Local mode"}
      </small>

      <section className="add">
        <input
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          placeholder="Resource title"
        />
        <input
          value={form.url}
          onChange={(e) => setForm({ ...form, url: e.target.value })}
          placeholder="https://..."
        />
        <input
          value={form.topic}
          onChange={(e) => setForm({ ...form, topic: e.target.value })}
          onKeyDown={(e) => e.key === "Enter" && add()}
          placeholder="Topic (optional)"
        />
        <button onClick={add}>
          <Plus size={15} /> Add
        </button>
      </section>

      <div className="resource-list">
        {items.map((item) => (
          <article key={item.id}>
            <header>
              <div>
                <small>{item.topic || "General"}</small>
                <h2>{item.title}</h2>
              </div>
              <button onClick={() => setItems((x) => x.filter((i) => i.id !== item.id))}>
                <Trash2 size={14} />
              </button>
            </header>
            <div className="progress">
              <i style={{ width: `${item.progress}%` }} />
            </div>
            <div className="actions">
              <label>
                {item.progress}%
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={item.progress}
                  onChange={(e) =>
                    setItems((x) =>
                      x.map((i) =>
                        i.id === item.id
                          ? { ...i, progress: Number(e.target.value) }
                          : i
                      )
                    )
                  }
                />
              </label>
              <a href={item.url} target="_blank" rel="noreferrer">
                <ExternalLink size={14} /> Open
              </a>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}
