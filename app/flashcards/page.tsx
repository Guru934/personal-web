"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, Brain, Check, Eye, Plus, RotateCcw } from "lucide-react";
import "./flashcards.css";

type Card = { id: number; question: string; answer: string; topic: string; due: string; lastRating?: string };
const example: Card[] = [{ id: 1, question: "What is a JavaScript closure?", answer: "A function bundled with its lexical environment.", topic: "Functions", due: "Today" }];

export default function FlashcardsPage() {
  const [cards, setCards] = useState<Card[]>(example); const [index, setIndex] = useState(0); const [revealed, setRevealed] = useState(false);
  const [question, setQuestion] = useState(""); const [answer, setAnswer] = useState(""); const [topic, setTopic] = useState("General"); const [ready, setReady] = useState(false);
  useEffect(() => { try { const saved = localStorage.getItem("pos.cards"); if (saved) setCards(JSON.parse(saved)); } finally { setReady(true); } }, []);
  useEffect(() => { if (ready) localStorage.setItem("pos.cards", JSON.stringify(cards)); }, [cards, ready]);
  const card = cards[index]; const rate = (rating: string) => { setCards(items => items.map(item => item.id === card.id ? { ...item, due: rating === "Again" ? "Today" : "Tomorrow", lastRating: rating } : item)); setRevealed(false); setIndex(value => cards.length > 1 ? (value + 1) % cards.length : 0); };
  const add = () => { if (question.trim() && answer.trim()) { setCards(items => [...items, { id: Date.now(), question: question.trim(), answer: answer.trim(), topic, due: "Today" }]); setQuestion(""); setAnswer(""); } };
  return <main className="recall"><a href="/" className="back"><ArrowLeft size={16}/> Personal OS</a><header><div><p>ACTIVE RECALL</p><h1>Flashcards</h1><span>Test understanding, then decide when to review again.</span></div><div className="count"><Brain size={18}/>{cards.length} cards</div></header><section className="recall-grid"><section className="card-stage"><div className="review-head"><span>DUE TODAY · {cards.filter(item => item.due === "Today").length}</span><span>{cards.length ? index + 1 : 0}/{cards.length}</span></div>{card ? <><div className="flashcard"><small>{card.topic}</small><h2>{card.question}</h2>{revealed && <div className="answer">{card.answer}</div>}</div>{revealed ? <div className="ratings">{["Again", "Hard", "Good", "Easy"].map(item => <button key={item} onClick={() => rate(item)}>{item}</button>)}</div> : <button className="reveal" onClick={() => setRevealed(true)}><Eye size={16}/> Reveal answer</button>}</> : <p>No cards yet—create the first one below.</p>}</section><section className="new-card"><h2>Create a card</h2><label>Question<input value={question} onChange={event => setQuestion(event.target.value)} placeholder="What do you want to remember?"/></label><label>Answer<textarea value={answer} onChange={event => setAnswer(event.target.value)} placeholder="Write the answer in your own words..."/></label><label>Topic<input value={topic} onChange={event => setTopic(event.target.value)} placeholder="e.g. Functions"/></label><button className="create" onClick={add}><Plus size={16}/> Add flashcard</button></section></section><section className="queue"><h2>Review queue</h2><p><b>{cards.filter(item => item.due === "Today").length}</b> due today</p><p><b>{cards.filter(item => item.lastRating === "Again").length}</b> marked for another attempt</p><button onClick={() => { setIndex(0); setRevealed(false); }}><RotateCcw size={15}/> Restart review</button></section></main>;
}
