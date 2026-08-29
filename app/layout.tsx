import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = { title: "Personal OS", description: "A personal learning and productivity system." };
export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) { return <html lang="en"><body><nav className="global-tools"><span>Personal OS</span><a href="/">Dashboard</a><a href="/study">Study</a><a href="/flashcards">Flashcards</a><a href="/daily-review">Daily Review</a><a href="/formulas">Formulas</a><a href="/media">Media</a></nav>{children}</body></html>; }
