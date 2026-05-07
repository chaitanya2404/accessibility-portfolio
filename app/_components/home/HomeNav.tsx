"use client";

import { useEffect, useState } from "react";
import { PAPER_THEME, T } from "./theme";

const ITEMS = [
  { id: "about", n: "01", l: "About" },
  { id: "skills", n: "02", l: "Skills" },
  { id: "experience", n: "03", l: "Experience" },
  { id: "projects", n: "04", l: "Projects" },
  { id: "contact", n: "05", l: "Contact" },
] as const;

export function HomeNav() {
  const [current, setCurrent] = useState<string>("top");

  useEffect(() => {
    const sections = ITEMS.map((i) => document.getElementById(i.id)).filter(
      (el): el is HTMLElement => el != null
    );
    if (sections.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setCurrent(visible.target.id);
      },
      { rootMargin: "-30% 0px -50% 0px", threshold: [0, 0.25, 0.5, 1] }
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  const jump = (id: string) => {
    const el = id === "top" ? document.documentElement : document.getElementById(id);
    if (!el) return;
    if (id === "top") window.scrollTo({ top: 0, behavior: "smooth" });
    else el.scrollIntoView({ behavior: "smooth", block: "start" });
    setCurrent(id);
  };

  return (
    <nav
      aria-label="Primary"
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        backdropFilter: "blur(12px)",
        background: PAPER_THEME.bg + "ee",
        borderBottom: `1px solid ${PAPER_THEME.rule}`,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "14px 32px",
          gap: 24,
          maxWidth: 1280,
          margin: "0 auto",
          flexWrap: "wrap",
        }}
      >
        <a
          href="#top"
          onClick={(e) => {
            e.preventDefault();
            jump("top");
          }}
          style={{
            fontFamily: T.headFont,
            fontSize: 13,
            fontWeight: 600,
            color: PAPER_THEME.ink,
            textDecoration: "none",
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <span
            aria-hidden="true"
            style={{
              width: 8,
              height: 8,
              background: PAPER_THEME.accent,
              transform: "rotate(45deg)",
            }}
          />
          C. R. Basani
        </a>
        <ul
          style={{
            display: "flex",
            gap: 4,
            margin: 0,
            padding: 0,
            listStyle: "none",
            flexWrap: "wrap",
          }}
        >
          {ITEMS.map((it) => {
            const active = current === it.id;
            return (
              <li key={it.id}>
                <button
                  type="button"
                  onClick={() => jump(it.id)}
                  style={{
                    appearance: "none",
                    border: 0,
                    background: "transparent",
                    cursor: "pointer",
                    fontFamily: T.headFont,
                    fontSize: 12,
                    padding: "8px 12px",
                    color: active ? PAPER_THEME.ink : PAPER_THEME.ink3,
                    borderBottom: `1.5px solid ${active ? PAPER_THEME.accent : "transparent"}`,
                    transition: "color .15s",
                  }}
                  aria-current={active ? "page" : undefined}
                >
                  <span
                    style={{
                      color: active ? PAPER_THEME.accent : PAPER_THEME.ink3,
                      marginRight: 6,
                    }}
                  >
                    {it.n}
                  </span>
                  {it.l}
                </button>
              </li>
            );
          })}
        </ul>
        <a
          href="#contact"
          onClick={(e) => {
            e.preventDefault();
            jump("contact");
          }}
          style={{
            fontFamily: T.headFont,
            fontSize: 12,
            color: PAPER_THEME.ink,
            padding: "8px 14px",
            border: `1px solid ${PAPER_THEME.rule}`,
            textDecoration: "none",
          }}
        >
          say hi →
        </a>
      </div>
    </nav>
  );
}
