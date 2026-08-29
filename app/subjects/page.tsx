"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { ArrowLeft, BookOpen, Check, Pencil, Plus, Trash2, X } from "lucide-react";
import { createSupabaseBrowserClient } from "../../lib/supabase-browser";
import "./subjects.css";

type Subject = { id: string; name: string };
type Topic = { id: string; name: string; subjectId: string; subject: string; progress: number };
const seed: Topic[] = [
  { id: "local-functions", name: "Functions", subjectId: "local-javascript", subject: "JavaScript", progress: 82 },
  { id: "local-arrays", name: "Arrays", subjectId: "local-javascript", subject: "JavaScript", progress: 64 },
];

function localTopics(): Topic[] {
  try {
    const stored = localStorage.getItem("pos.topics");
    if (!stored) return seed;
    return (JSON.parse(stored) as Array<{ id: string | number; name: string; subject: string; progress: number }>).map((item) => ({ id: String(item.id), name: item.name, subjectId: `local-${item.subject}`, subject: item.subject, progress: item.progress ?? 0 }));
  } catch { return seed; }
}

export default function SubjectsPage() {
  const [subjects, setSubjects] = useState<Subject[]>([]), [topics, setTopics] = useState<Topic[]>([]), [subject, setSubject] = useState("JavaScript"), [topic, setTopic] = useState(""), [editing, setEditing] = useState<string | null>(null), [edit, setEdit] = useState(""), [ready, setReady] = useState(false), [cloud, setCloud] = useState(false), [notice, setNotice] = useState("");

  useEffect(() => {
    let active = true;
    const load = async () => {
      const fallback = localTopics(), client = createSupabaseBrowserClient();
      if (!client) { if (active) { setTopics(fallback); setReady(true); } return; }
      const { data: userData } = await client.auth.getUser();
      if (!userData.user) { if (active) { setTopics(fallback); setReady(true); } return; }
      const [{ data: subjectRows, error: subjectError }, { data: topicRows, error: topicError }] = await Promise.all([
        client.from("subjects").select("id,name").order("created_at"), client.from("topics").select("id,name,progress,subject_id").order("created_at"),
      ]);
      if (subjectError || topicError) { if (active) { setTopics(fallback); setNotice("Cloud sync is unavailable, so local data is being used."); setReady(true); } return; }
      let cloudSubjects = (subjectRows ?? []) as Array<{ id: string; name: string }>;
      let cloudTopics = (topicRows ?? []) as Array<{ id: string; name: string; progress: number; subject_id: string }>;
      if (cloudSubjects.length === 0 && cloudTopics.length === 0 && fallback.length > 0) {
        const names = [...new Set(fallback.map((item) => item.subject))];
        const inserted = await client.from("subjects").insert(names.map((name) => ({ user_id: userData.user.id, name }))).select("id,name");
        if (inserted.data?.length) {
          cloudSubjects = inserted.data as Array<{ id: string; name: string }>;
          const ids = new Map(cloudSubjects.map((item) => [item.name, item.id]));
          const rows = fallback.flatMap((item) => { const subjectId = ids.get(item.subject); return subjectId ? [{ user_id: userData.user.id, subject_id: subjectId, name: item.name, progress: item.progress }] : []; });
          const topicsResult = await client.from("topics").insert(rows).select("id,name,progress,subject_id");
          cloudTopics = (topicsResult.data ?? []) as Array<{ id: string; name: string; progress: number; subject_id: string }>;
        }
      }
      if (!active) return;
      const names = new Map(cloudSubjects.map((item) => [item.id, item.name]));
      setSubjects(cloudSubjects); setTopics(cloudTopics.map((item) => ({ id: item.id, name: item.name, subjectId: item.subject_id, subject: names.get(item.subject_id) ?? "Subject", progress: item.progress ?? 0 }))); setCloud(true); setReady(true);
    };
    void load(); return () => { active = false; };
  }, []);

  useEffect(() => { if (ready && !cloud) localStorage.setItem("pos.topics", JSON.stringify(topics.map(({ id, name, subject, progress }) => ({ id, name, subject, progress })))); }, [topics, ready, cloud]);

  const add = async (event?: FormEvent) => {
    event?.preventDefault(); const subjectName = subject.trim(), topicName = topic.trim(); if (!subjectName || !topicName) return;
    const client = cloud ? createSupabaseBrowserClient() : null;
    if (client) {
      const { data: userData } = await client.auth.getUser(); if (userData.user) {
        let current = subjects.find((item) => item.name.toLowerCase() === subjectName.toLowerCase());
        if (!current) { const result = await client.from("subjects").insert({ user_id: userData.user.id, name: subjectName }).select("id,name").single(); if (result.error || !result.data) { setNotice(result.error?.message ?? "Could not create subject."); return; } current = result.data as Subject; setSubjects((items) => [...items, current!]); }
        const result = await client.from("topics").insert({ user_id: userData.user.id, subject_id: current.id, name: topicName, progress: 0 }).select("id,name,progress,subject_id").single();
        if (result.error || !result.data) { setNotice(result.error?.message ?? "Could not create topic."); return; }
        setTopics((items) => [...items, { id: result.data.id, name: result.data.name, subjectId: current!.id, subject: current!.name, progress: result.data.progress ?? 0 }]); setTopic(""); return;
      }
    }
    const current = subjects.find((item) => item.name.toLowerCase() === subjectName.toLowerCase()) ?? { id: `local-${subjectName}`, name: subjectName };
    setSubjects((items) => items.some((item) => item.id === current.id) ? items : [...items, current]); setTopics((items) => [...items, { id: String(Date.now()), name: topicName, subjectId: current.id, subject: current.name, progress: 0 }]); setTopic("");
  };

  const updateTopic = async (item: Topic) => { const name = edit.trim(); if (!name) return; if (cloud) await createSupabaseBrowserClient()?.from("topics").update({ name }).eq("id", item.id); setTopics((items) => items.map((current) => current.id === item.id ? { ...current, name } : current)); setEditing(null); };
  const removeTopic = async (item: Topic) => { if (cloud) await createSupabaseBrowserClient()?.from("topics").delete().eq("id", item.id); setTopics((items) => items.filter((current) => current.id !== item.id)); };
  const removeSubject = async (item: Subject) => { if (!window.confirm(`Delete ${item.name} and all its topics?`)) return; if (cloud) await createSupabaseBrowserClient()?.from("subjects").delete().eq("id", item.id); setSubjects((items) => items.filter((current) => current.id !== item.id)); setTopics((items) => items.filter((current) => current.subjectId !== item.id)); };
  const visibleSubjects = useMemo(() => subjects.length ? subjects : [...new Map(topics.map((item) => [item.subjectId, { id: item.subjectId, name: item.subject }])).values()], [subjects, topics]);

  return <main className="subjects"><a href="/" className="back"><ArrowLeft size={16}/> Personal OS</a><p>LEARN</p><h1>Subjects & syllabus</h1><span>Shape the curriculum around what you actually study.</span>{notice && <p className="message">{notice}</p>}<form className="add-subject" onSubmit={add}><input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Subject name"/><input value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="Syllabus topic"/><button type="submit"><Plus size={16}/> Add topic</button></form><div className="subject-list">{visibleSubjects.map((item) => <section className="subject-card" key={item.id}><header><div><BookOpen size={17}/><h2>{item.name}</h2></div><button onClick={() => removeSubject(item)}><Trash2 size={15}/> Delete subject</button></header>{topics.filter((current) => current.subjectId === item.id || current.subject === item.name).map((current) => <div className="syllabus" key={current.id}>{editing === current.id ? <><input value={edit} onChange={(e) => setEdit(e.target.value)} autoFocus/><button onClick={() => void updateTopic(current)}><Check size={14}/></button><button onClick={() => setEditing(null)}><X size={14}/></button></> : <><span>{current.name}</span><small>{current.progress}% complete</small><button onClick={() => { setEditing(current.id); setEdit(current.name); }}><Pencil size={13}/></button><button onClick={() => void removeTopic(current)}><Trash2 size={13}/></button></>}</div>)}</section>)}</div></main>;
}
