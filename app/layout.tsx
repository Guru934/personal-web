import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import AuthStatus from "./auth-status";
import PWASetup from "./components/PWASetup";
import AssistantWidget from "./components/AssistantWidget";
import NavMenu from "./components/NavMenu";

export const metadata: Metadata = {
  title: "Personal OS",
  description: "A personal learning and productivity system.",
  manifest: "/manifest.json",
  themeColor: "#202125",
  viewport: "width=device-width, initial-scale=1, maximum-scale=5",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
  },
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/icon-192x192.png" />
        <link rel="apple-touch-icon" href="/icon-192x192.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#202125" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Personal OS" />
      </head>
      <body>
        <PWASetup />
        <NavMenu />
        <nav className="global-tools">
          <span>Personal OS</span>
          <a href="/">Dashboard</a>
          <a href="/study">Study</a>
          <a href="/subjects">Subjects</a>
          <a href="/timetable">Timetable</a>
          <a href="/goals">Goals</a>
          <a href="/exam">Exam</a>
          <a href="/habits">Habits</a>
          <a href="/analytics">Analytics</a>
          <a href="/flashcards">Flashcards</a>
          <a href="/daily-review">Daily Review</a>
          <a href="/formulas">Formulas</a>
          <a href="/media">Media</a>
          <a href="/backup">Backup</a>
          <a href="/recall">Recall</a>
          <a href="/resources">Resources</a>
          <AuthStatus />
        </nav>
        <aside className="media-strip">
          <strong>Media hub</strong>
          <a href="https://www.miruro.ru/" target="_blank" rel="noreferrer">Anime</a>
          <a href="https://comix.to/home" target="_blank" rel="noreferrer">Manga</a>
          <a href="https://www.rivestream.app/" target="_blank" rel="noreferrer">Movies</a>
          <a href="https://monochrome.tf/" target="_blank" rel="noreferrer">Music</a>
          <a href="https://www.crazygames.com/" target="_blank" rel="noreferrer">Games</a>
        </aside>
        {children}
        <AssistantWidget />
      </body>
    </html>
  );
}
