import { createSupabaseServerClient } from "@/lib/supabase-server";
import { NextRequest, NextResponse } from "next/server";

const GEMINI_API_KEY = process.env.GOOGLE_GEMINI_API_KEY || "";
const GEMINI_MODEL = process.env.GOOGLE_GEMINI_MODEL || "gemini-flash-latest";
const DAILY_CREDIT_LIMIT = 15;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message } = body;

    if (!message || typeof message !== "string" || !message.trim()) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    console.log("API Key present:", !!GEMINI_API_KEY);
    console.log("Model:", GEMINI_MODEL);

    if (!GEMINI_API_KEY) {
      console.error("GOOGLE_GEMINI_API_KEY is not set");
      return NextResponse.json(
        { error: "API key not configured. Check Vercel environment variables." },
        { status: 500 }
      );
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

    // Call Gemini API with correct format
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

    console.log("Calling Gemini at:", url.substring(0, 80) + "...");

    const geminiResponse = await fetch(url, {
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
    });

    console.log("Gemini response status:", geminiResponse.status);

    if (!geminiResponse.ok) {
      const error = await geminiResponse.text();
      console.error("Gemini API error:", error);
      return NextResponse.json(
        { error: `Gemini API error: ${geminiResponse.status}` },
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
  } catch (error: any) {
    console.error("Assistant API error:", error);
    return NextResponse.json(
      { error: `Internal error: ${error?.message}` },
      { status: 500 }
    );
  }
}
