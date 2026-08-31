"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, CheckCircle2, Plus, Trash2 } from "lucide-react";
import { useSupabaseSync } from "@/lib/useSupabaseSync";
import { createSupabaseBrowserClient } from "@/lib/supabase-browser";
import "./daily-review.css";

type Review = { id: number; date: string; content: string };

const seed: Review[] = [];

export default function DailyReviewPage() {
  const [userId, setUserId] = useState<string | undefined>();
  const { data: reviews, updateData: setReviews, syncState } = useSupabaseSync<Review[]>(
    "daily_reviews",
    "pos.daily-review",
    seed,
    userId
  );

  const [content, setContent] = useState("");
  const today = new Date().toISOString().split("T")[0];
  const todayReview = reviews.find((r) => r.date === today);

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

  useEffect(() => {
    if (todayReview) {
      setContent(todayReview.content);
    }
  }, [todayReview]);

  const save = () => {
    if (todayReview) {
      setReviews((x) =>
        x.map((r) =>
          r.id === todayReview.id ? { ...r, content } : r
        )
      );
    } else {
      setReviews((x) => [
        ...x,
        { id: Date.now(), date: today, content },
      ]);
    }
  };

  return (
    <main className="daily-review-page">
      <a href="/" className="back">
        <ArrowLeft size={16} /> Personal OS
      </a>
      <p>REFLECT</p>
      <h1>Daily Review</h1>
      <span>End your day with reflection. What did you learn? What's next?</span>
      <small style={{ color: syncState === "synced" ? "#3d8c61" : "#999" }}>
        {syncState === "synced" ? "☁️ Cloud synced" : "💾 Local mode"}
      </small>

      <section className="review-form">
        <h2>{today}</h2>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What did you accomplish today? What did you learn? What's on your mind?"
          rows={10}
        />
        <button onClick={save} className="save-btn">
          <CheckCircle2 size={16} /> Save Review
        </button>
      </section>

      <section className="review-history">
        <h3>Recent Reviews</h3>
        {reviews.length === 0 ? (
          <p>No reviews yet. Start with today!</p>
        ) : (
          reviews
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .slice(0, 10)
            .map((review) => (
              <article key={review.id} className="review-item">
                <div className="review-header">
                  <h4>{review.date}</h4>
                  <button
                    onClick={() =>
                      setReviews((x) => x.filter((r) => r.id !== review.id))
                    }
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
                <p>{review.content}</p>
              </article>
            ))
        )}
      </section>
    </main>
  );
}
