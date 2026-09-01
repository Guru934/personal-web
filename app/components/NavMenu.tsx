"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import "./nav-menu.css";

const navLinks = [
  { label: "Dashboard", href: "/" },
  { label: "Study", href: "/study" },
  { label: "Subjects", href: "/subjects" },
  { label: "Timetable", href: "/timetable" },
  { label: "Goals", href: "/goals" },
  { label: "Exam", href: "/exam" },
  { label: "Habits", href: "/habits" },
  { label: "Analytics", href: "/analytics" },
  { label: "Flashcards", href: "/flashcards" },
  { label: "Daily Review", href: "/daily-review" },
  { label: "Formulas", href: "/formulas" },
  { label: "Media", href: "/media" },
  { label: "Recall", href: "/recall" },
  { label: "Resources", href: "/resources" },
  { label: "Backup", href: "/backup" },
];


const mediaLinks = [
  { label: "Anime (Media)", href: "https://www.miruro.ru/" },
  { label: "Manga (Media)", href: "https://comix.to/home" },
  { label: "Movies (Media)", href: "https://www.rivestream.app/" },
  { label: "Music (Media)", href: "https://monochrome.tf/" },
  { label: "Games (Media)", href: "https://www.crazygames.com/" }
];

export default function NavMenu() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button className="nav-toggle" onClick={() => setOpen(!open)} aria-label="Toggle menu">
        {open ? <X size={20} /> : <Menu size={20} />}
      </button>

      {open && <div className="nav-backdrop" onClick={() => setOpen(false)} />}

      <nav className={`nav-menu ${open ? "open" : ""}`}>
        <div className="nav-header">
          <h3>Navigation</h3>
          <button className="nav-close" onClick={() => setOpen(false)}>
            <X size={20} />
          </button>
        </div>

        <div className="nav-links">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="nav-link"
              onClick={() => setOpen(false)}
            >
              {link.label}
            </a>
          ))}

        </div>
        
        <div className="nav-header" style={{ marginTop: '16px', borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
          <h3>Media Hub</h3>
        </div>
        
        <div className="nav-links">
          {mediaLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="nav-link"
              onClick={() => setOpen(false)}
              target="_blank"
              rel="noreferrer"
            >
              {link.label}
            </a>
          ))}
        </div>
      </nav>
    </>
  );
}
