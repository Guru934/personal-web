"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, Brain, Check, Eye, Plus, RotateCcw } from "lucide-react";
import "./flashcards.css";

type Card = { id: number; question: string; answer: string; topic: string; due: string; dueAt?: string; lastRating?: string };
const example: Card[] = [{ id: 1, question: "What is a JavaScript closure?", answer: "A function bundled with its lexical environment.", topic: "Functions", due: "Today", dueAt: new Date().toISOString() }];

export default function FlashcardsPage() {
  const [cards, setCards] = useState<Card[]>(example); const [index, setIndex] = useState(0); const [revealed, setRevealed] = useState(false);
  const [question, setQuestion] = useState(""); const [answer, setAnswer] = useState(""); const [topic, setTopic] = useState("General"); const [ready, setReady] = useState(false);
  useEffect(() => { try { const saved = localStorage.getItem("pos.cards"); if (saved) setCards(JSON.parse(saved)); } finally { setReady(true); } }, []);
  useEffect(() => { if (ready) localStorage.setItem("pos.cards", JSON.stringify(cards)); }, [cards, ready]);
  const dueCards = cards.filter(item => !item.dueAt || new Date(item.dueAt).getTime() <= Date.now());
  const card = dueCards[index];
  const rate = (rating: string) => { if (!card) return; const minutes = rating === "Again" ? 10 : rating === "Hard" ? 24 * 60 : rating === "Good" ? 3 * 24 * 60 : 7 * 24 * 60; const dueAt = new Date(Date.now() + minutes * 60 * 1000).toISOString(); setCards(items => items.map(item => item.id === card.id ? { ...item, due: minutes < 60 ? "In 10 minutes" : rating === "Hard" ? "Tomorrow" : `In ${Math.round(minutes / (24 * 60))} days`, dueAt, lastRating: rating } : item)); setRevealed(false); setIndex(0); };
  const add = () => { if (question.trim() && answer.trim()) { setCards(items => [...items, { id: Date.now(), question: question.trim(), answer: answer.trim(), topic, due: "Today", dueAt: new Date().toISOString() }]); setQuestion(""); setAnswer(""); } };
  return <main className="recall"><a href="/" className="back"><ArrowLeft size={16}/> Personal OS</a><header><div><p>ACTIVE RECALL</p><h1>Flashcards</h1><span>Test understanding, then decide when to review again.</span></div><div className="count"><Brain size={18}/>{cards.length} cards</div></header><section className="recall-grid"><section className="card-stage"><div className="review-head"><span>DUE NOW · {dueCards.length}</span><span>{dueCards.length ? index + 1 : 0}/{dueCards.length}</span></div>{card ? <><div className="flashcard"><small>{card.topic}</small><h2>{card.question}</h2>{revealed && <div className="answer">{card.answer}</div>}</div>{revealed ? <div className="ratings">{["Again", "Hard", "Good", "Easy"].map(item => <button key={item} onClick={() => rate(item)}>{item}</button>)}</div> : <button className="reveal" onClick={() => setRevealed(true)}><Eye size={16}/> Reveal answer</button>}</> : <p>{cards.length ? "Nothing is due right now—come back later." : "No cards yet—create the first one below."}</p>}</section><section className="new-card"><h2>Create a card</h2><label>Question<input value={question} onChange={event => setQuestion(event.target.value)} placeholder="What do you want to remember?"/></label><label>Answer<textarea value={answer} onChange={event => setAnswer(event.target.value)} placeholder="Write the answer in your own words..."/></label><label>Topic<input value={topic} onChange={event => setTopic(event.target.value)} placeholder="e.g. Functions"/></label><button className="create" onClick={add}><Plus size={16}/> Add flashcard</button></section></section><section className="queue"><h2>Review queue</h2><p><b>{dueCards.length}</b> due now</p><p><b>{cards.filter(item => item.lastRating === "Again").length}</b> need another attempt</p><button onClick={() => { setIndex(0); setRevealed(false); }}><RotateCcw size={15}/> Restart review</button></section></main>;
}
