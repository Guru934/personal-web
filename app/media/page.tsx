"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, ExternalLink, Plus, Trash2 } from "lucide-react";
import { useSupabaseSync } from "@/lib/useSupabaseSync";
import { createSupabaseBrowserClient } from "@/lib/supabase-browser";
import "./media.css";

type MediaItem = { id: number; title: string; url: string; type: string };

const seed: MediaItem[] = [
  { id: 1, title: "freeCodeCamp - Web Dev", url: "https://freecodecamp.org", type: "Course" },
];

export default function MediaPage() {
  const [userId, setUserId] = useState<string | undefined>();
  const { data: media, updateData: setMedia, syncState } = useSupabaseSync<MediaItem[]>(
    "media",
    "pos.media",
    seed,
    userId
  );

  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [type, setType] = useState("Course");

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
    if (title.trim() && url.trim()) {
      setMedia((x) => [
        ...x,
        { id: Date.now(), title: title.trim(), url, type },
      ]);
      setTitle("");
      setUrl("");
    }
  };

  return (
    <main className="media-page">
      <a href="/" className="back">
        <ArrowLeft size={16} /> Personal OS
      </a>
      <p>RESOURCES</p>
      <h1>Media Hub</h1>
      <span>Organize courses, videos, articles, and learning materials.</span>
      <small style={{ color: syncState === "synced" ? "#3d8c61" : "#999" }}>
        {syncState === "synced" ? "☁️ Cloud synced" : "💾 Local mode"}
      </small>

      <section className="add-media">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
        />
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://..."
        />
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option>Course</option>
          <option>Video</option>
          <option>Article</option>
          <option>Book</option>
          <option>Podcast</option>
          <option>Other</option>
        </select>
        <button onClick={add}>
          <Plus size={16} /> Add
        </button>
      </section>

      <div className="media-grid">
        {media.map((item) => (
          <article key={item.id} className="media-card">
            <div className="media-header">
              <h3>{item.title}</h3>
              <button
                onClick={() =>
                  setMedia((x) => x.filter((i) => i.id !== item.id))
                }
              >
                <Trash2 size={14} />
              </button>
            </div>
            <small>{item.type}</small>
            <p>{item.url}</p>
            <a href={item.url} target="_blank" rel="noreferrer">
              <ExternalLink size={14} /> Open
            </a>
          </article>
        ))}
      </div>
    </main>
  );
}
