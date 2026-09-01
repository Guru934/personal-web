"use client";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
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

export default function NavMenu() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  
  if (pathname === '/login') return null;

  return (
    <>
      <button className="nav-toggle" onClick={() => setOpen(!open)} aria-label="Toggle menu">
        {open ? <X size={20} /> : <Menu size={20} />}
      </button>

      {open && <div className="nav-backdrop" onClick={() => setOpen(false)} />}

      <nav className={`nav-menu ${open ? "open" : ""}`}>
        <div className="nav-header">
          <h3>Personal OS</h3>
          <button className="nav-close" onClick={() => setOpen(false)}>
            <X size={20} />
          </button>
        </div>

        <div className="nav-links">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <a
                key={link.href}
                href={link.href}
                className={`nav-link ${isActive ? "active" : ""}`}
                onClick={() => setOpen(false)}
              >
                {link.label}
              </a>
            );
          })}
        </div>
      </nav>
    </>
  );
}