"use client";

import { useState, useRef, useEffect } from "react";
import { Send, X, Minimize2, Maximize2, Loader } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase-browser";
import "./assistant.css";

export default function AssistantWidget() {
  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [messages, setMessages] = useState<Array<{ role: "user" | "assistant"; content: string }>>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [creditsLeft, setCreditsLeft] = useState(15);

  // Load credits from Supabase on mount
  useEffect(() => {
    const loadCredits = async () => {
      const client = createSupabaseBrowserClient();
      if (!client) return;

      const { data: { user } } = await client.auth.getUser();
      if (!user) return;

      const today = new Date().toISOString().split("T")[0];
      const { data: usage } = await client
        .from("ai_usage")
        .select("credits_used")
        .eq("user_id", user.id)
        .eq("date", today)
        .single();

      const creditsUsed = usage?.credits_used || 0;
      setCreditsLeft(Math.max(0, 15 - creditsUsed));
    };

    loadCredits();
  }, [open]);
  const [error, setError] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async () => {
    if (!input.trim() || loading || creditsLeft <= 0) return;

    const userMessage = input.trim();
    setInput("");
    setError("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setLoading(true);

    try {
      const response = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
        setCreditsLeft((prev) => Math.max(0, prev - 1));
      } else {
        const errorMsg = data.error || `Error: ${response.status}`;
        setError(errorMsg);
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: `⚠️ ${errorMsg}` },
        ]);
      }
    } catch (error: any) {
      const errorMsg = error?.message || "Network error. Check your connection.";
      setError(errorMsg);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: `⚠️ ${errorMsg}` },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {!open && (
        <button className="assistant-fab" onClick={() => setOpen(true)} title="Open AI Assistant">
          ✨
        </button>
      )}

      {open && (
        <div className={`assistant-widget ${minimized ? "minimized" : ""}`}>
          <div className="assistant-header">
            <h3>Study Assistant</h3>
            <div className="assistant-controls">
              <button onClick={() => setMinimized(!minimized)} title={minimized ? "Maximize" : "Minimize"}>
                {minimized ? <Maximize2 size={16} /> : <Minimize2 size={16} />}
              </button>
              <button onClick={() => setOpen(false)} title="Close">
                <X size={16} />
              </button>
            </div>
          </div>

          {!minimized && (
            <>
              <div className="assistant-messages">
                {messages.length === 0 && (
                  <div className="assistant-empty">
                    <p>💡 Ask me anything about your studies, tasks, or learning goals.</p>
                    <small>15 questions per day • Free with Google Gemini</small>
                  </div>
                )}
                {messages.map((msg, i) => (
                  <div key={i} className={`assistant-message ${msg.role}`}>
                    <p>{msg.content}</p>
                  </div>
                ))}
                {loading && (
                  <div className="assistant-message assistant">
                    <p><Loader size={14} className="spin" /> Thinking...</p>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              <div className="assistant-footer">
                <div className="assistant-stats">
                  <small>
                    Credits: <b>{creditsLeft}</b>/15 today
                  </small>
                  {error && <small className="error">⚠️ {error}</small>}
                </div>
                <div className="assistant-input">
                  <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
                    placeholder="Ask a question..."
                    disabled={loading || creditsLeft <= 0}
                  />
                  <button onClick={sendMessage} disabled={!input.trim() || loading || creditsLeft <= 0}>
                    <Send size={16} />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}
