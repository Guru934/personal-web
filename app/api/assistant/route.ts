import { createSupabaseServerClient } from "@/lib/supabase-server";
import { NextRequest, NextResponse } from "next/server";

const GEMINI_API_KEY = process.env.GOOGLE_GEMINI_API_KEY;
const GEMINI_MODEL = process.env.GOOGLE_GEMINI_MODEL || "gemini-2.0-flash";
const DAILY_CREDIT_LIMIT = 15;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message } = body;

    if (!message || typeof message !== "string" || !message.trim()) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    if (!GEMINI_API_KEY) {
      return NextResponse.json({ error: "API key not configured" }, { status: 500 });
    }

    // Verify user is authenticated
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check daily credit usage
    const today = new Date().toISOString().split("T")[0];
    const { data: usage } = await supabase
      .from("ai_usage")
      .select("credits_used")
      .eq("user_id", user.id)
      .eq("date", today)
      .single();

    const creditsUsed = usage?.credits_used || 0;

    if (creditsUsed >= DAILY_CREDIT_LIMIT) {
      return NextResponse.json(
        { error: "Daily credit limit reached. Try again tomorrow." },
        { status: 429 }
      );
    }

    // Call Gemini API
    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `You are a helpful study assistant for a Personal OS learning system. Help the user with their learning, productivity, and study-related questions. Keep responses concise and actionable. User question: ${message}`,
                },
              ],
            },
          ],
        }),
      }
    );

    if (!geminiResponse.ok) {
      const error = await geminiResponse.text();
      console.error("Gemini API error:", error);
      return NextResponse.json(
        { error: "Failed to get response from AI" },
        { status: 500 }
      );
    }

    const geminiData = await geminiResponse.json();
    const reply = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || "I couldn't generate a response.";

    // Log usage
    if (creditsUsed === 0) {
      // First usage today
      await supabase.from("ai_usage").insert({
        user_id: user.id,
        date: today,
        credits_used: 1,
      });
    } else {
      // Update existing
      await supabase
        .from("ai_usage")
        .update({ credits_used: creditsUsed + 1 })
        .eq("user_id", user.id)
        .eq("date", today);
    }

    return NextResponse.json({ reply });
  } catch (error) {
    console.error("Assistant API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
