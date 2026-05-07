"use client";

import { useRef, useState } from "react";
import { useAnnounce } from "@/components/LiveRegion";
import { DENSITY, PAPER_THEME, T } from "./theme";
import { ProjectGlyph } from "./ProjectGlyph";

export type Project = {
  id: string;
  title: string;
  kind: string;
  blurb: string;
  stack: string[];
  href: string;
  external: boolean;
  meta: { routes: number; tests: number; axe: number; contrast: string };
};

export function ProjectsRail({ projects }: { projects: Project[] }) {
  const railRef = useRef<HTMLUListElement>(null);
  const [idx, setIdx] = useState(0);
  const announce = useAnnounce();

  const scrollTo = (i: number) => {
    const r = railRef.current;
    if (!r) return;
    const card = r.children[i] as HTMLElement | undefined;
    if (!card) return;
    r.scrollTo({ left: card.offsetLeft - 32, behavior: "smooth" });
    setIdx(i);
    announce(`Project ${i + 1} of ${projects.length}: ${projects[i].title}`, "polite");
  };

  const onScroll = (event: React.UIEvent<HTMLUListElement>) => {
    const sl = event.currentTarget.scrollLeft;
    let nearest = 0;
    let best = Infinity;
    [...event.currentTarget.children].forEach((c, i) => {
      const dist = Math.abs((c as HTMLElement).offsetLeft - 32 - sl);
      if (dist < best) {
        best = dist;
        nearest = i;
      }
    });
    if (nearest !== idx) setIdx(nearest);
  };

  const featured = projects[idx];

  return (
    <>
      <div
        style={{
          margin: "0 32px 32px",
          padding: "24px 28px",
          border: `1px solid ${PAPER_THEME.rule}`,
          background: PAPER_THEME.bg2,
          display: "grid",
          gridTemplateColumns: "minmax(0, 1fr) auto",
          gap: 32,
          alignItems: "center",
        }}
        className="home-projects-featured"
        aria-live="polite"
      >
        <div>
          <div
            style={{
              fontFamily: T.headFont,
              fontSize: 11,
              color: PAPER_THEME.accent,
              textTransform: "uppercase",
              letterSpacing: ".1em",
              marginBottom: 8,
            }}
          >
            ▸ now showing · {String(idx + 1).padStart(2, "0")} of{" "}
            {String(projects.length).padStart(2, "0")}
          </div>
          <h3
            style={{
              fontFamily: T.headFont,
              fontSize: 32,
              fontWeight: 600,
              color: PAPER_THEME.ink,
              margin: "0 0 6px",
              letterSpacing: "-.02em",
            }}
          >
            {featured.title}
          </h3>
          <p
            style={{
              fontFamily: T.bodyFont,
              fontSize: 14,
              color: PAPER_THEME.ink2,
              margin: 0,
              maxWidth: "60ch",
              textWrap: "pretty",
            }}
          >
            {featured.blurb}
          </p>
        </div>
        <dl
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, auto)",
            gap: "6px 24px",
            fontFamily: T.headFont,
            fontSize: 12,
            margin: 0,
          }}
        >
          <dt style={{ color: PAPER_THEME.ink3 }}>tests</dt>
          <dd style={{ color: PAPER_THEME.ink, fontWeight: 600, margin: 0 }}>
            {featured.meta.tests}
          </dd>
          <dt style={{ color: PAPER_THEME.ink3 }}>axe</dt>
          <dd style={{ color: PAPER_THEME.a11y, fontWeight: 600, margin: 0 }}>
            ✓ {featured.meta.axe}
          </dd>
          <dt style={{ color: PAPER_THEME.ink3 }}>contrast</dt>
          <dd style={{ color: PAPER_THEME.ink, fontWeight: 600, margin: 0 }}>
            {featured.meta.contrast}
          </dd>
          <dt style={{ color: PAPER_THEME.ink3 }}>routes</dt>
          <dd style={{ color: PAPER_THEME.ink, fontWeight: 600, margin: 0 }}>
            {featured.meta.routes}
          </dd>
        </dl>
      </div>

      <div style={{ position: "relative" }}>
        <ul
          ref={railRef}
          onScroll={onScroll}
          style={{
            display: "flex",
            gap: DENSITY.gap,
            overflowX: "auto",
            overflowY: "visible",
            padding: "8px 32px 32px",
            scrollSnapType: "x mandatory",
            scrollbarWidth: "thin",
            margin: 0,
            listStyle: "none",
          }}
        >
          {projects.map((p, i) => (
            <li
              key={p.id}
              style={{
                flex: `0 0 380px`,
                scrollSnapAlign: "start",
                background: PAPER_THEME.bg2,
                border: `1px solid ${i === idx ? PAPER_THEME.accent : PAPER_THEME.rule}`,
                display: "flex",
                flexDirection: "column",
                minHeight: 480,
                transition: "border-color .2s, transform .2s",
                transform: i === idx ? "translateY(-4px)" : "none",
                position: "relative",
              }}
            >
              <button
                type="button"
                onClick={() => scrollTo(i)}
                aria-label={`Focus ${p.title}`}
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "transparent",
                  border: 0,
                  cursor: "pointer",
                  zIndex: 1,
                }}
              />
              <div
                style={{
                  height: 220,
                  background: PAPER_THEME.bg,
                  borderBottom: `1px solid ${PAPER_THEME.rule}`,
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <ProjectGlyph kind={p.id} />
                <div
                  style={{
                    position: "absolute",
                    top: 14,
                    left: 14,
                    fontFamily: T.headFont,
                    fontSize: 11,
                    color: PAPER_THEME.ink3,
                    textTransform: "uppercase",
                    letterSpacing: ".08em",
                  }}
                >
                  {String(i + 1).padStart(2, "0")} · {p.kind}
                </div>
              </div>
              <div
                style={{
                  padding: "20px 22px 22px",
                  display: "flex",
                  flexDirection: "column",
                  flex: 1,
                  gap: 14,
                  position: "relative",
                  zIndex: 2,
                  pointerEvents: "none",
                }}
              >
                <h3
                  style={{
                    fontFamily: T.headFont,
                    fontSize: 22,
                    margin: 0,
                    fontWeight: 600,
                    color: PAPER_THEME.ink,
                    letterSpacing: "-.01em",
                  }}
                >
                  {p.title}
                </h3>
                <p
                  style={{
                    fontFamily: T.bodyFont,
                    fontSize: 13,
                    lineHeight: 1.55,
                    color: PAPER_THEME.ink2,
                    margin: 0,
                    textWrap: "pretty",
                    flex: 1,
                  }}
                >
                  {p.blurb}
                </p>
                <ul
                  style={{
                    display: "flex",
                    gap: 6,
                    flexWrap: "wrap",
                    margin: 0,
                    padding: 0,
                    listStyle: "none",
                  }}
                >
                  {p.stack.map((s) => (
                    <li
                      key={s}
                      style={{
                        fontFamily: T.headFont,
                        fontSize: 11,
                        color: PAPER_THEME.ink2,
                        padding: "3px 7px",
                        border: `1px solid ${PAPER_THEME.rule}`,
                      }}
                    >
                      {s}
                    </li>
                  ))}
                </ul>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginTop: 4,
                  }}
                >
                  <a
                    href={p.href}
                    {...(p.external
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                    aria-label={
                      p.external
                        ? `Open the ${p.title} project (opens in a new tab)`
                        : `Open the ${p.title} project`
                    }
                    style={{
                      pointerEvents: "auto",
                      position: "relative",
                      zIndex: 2,
                      fontFamily: T.headFont,
                      fontSize: 12,
                      color: PAPER_THEME.accent,
                      fontWeight: 500,
                      textDecoration: "none",
                    }}
                  >
                    view live {p.external ? "↗" : "→"}
                  </a>
                  <span
                    style={{
                      fontFamily: T.headFont,
                      fontSize: 11,
                      color: PAPER_THEME.ink3,
                    }}
                  >
                    {p.id}
                  </span>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 24,
            padding: "0 32px",
            marginTop: 8,
          }}
        >
          <div
            style={{
              fontFamily: T.headFont,
              fontSize: 12,
              color: PAPER_THEME.ink3,
              fontVariantNumeric: "tabular-nums",
            }}
            aria-hidden="true"
          >
            {String(idx + 1).padStart(2, "0")}{" "}
            <span style={{ color: PAPER_THEME.rule }}>/</span>{" "}
            {String(projects.length).padStart(2, "0")}
          </div>
          <div
            style={{ flex: 1, display: "flex", gap: 4 }}
            role="tablist"
            aria-label="Project carousel"
          >
            {projects.map((p, i) => (
              <button
                key={p.id}
                onClick={() => scrollTo(i)}
                role="tab"
                aria-selected={i === idx}
                aria-label={`Show ${p.title}`}
                style={{
                  appearance: "none",
                  border: 0,
                  padding: 0,
                  height: 4,
                  flex: 1,
                  cursor: "pointer",
                  background: i === idx ? PAPER_THEME.accent : PAPER_THEME.rule,
                  transition: "background .2s",
                }}
              />
            ))}
          </div>
          <div style={{ display: "flex", gap: 4 }}>
            <RailBtn
              onClick={() => scrollTo(Math.max(0, idx - 1))}
              disabled={idx === 0}
              label="Previous project"
            >
              ←
            </RailBtn>
            <RailBtn
              onClick={() => scrollTo(Math.min(projects.length - 1, idx + 1))}
              disabled={idx === projects.length - 1}
              label="Next project"
            >
              →
            </RailBtn>
          </div>
        </div>
      </div>
    </>
  );
}

function RailBtn({
  children,
  onClick,
  disabled,
  label,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled: boolean;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      style={{
        appearance: "none",
        width: 36,
        height: 36,
        border: `1px solid ${PAPER_THEME.rule}`,
        background: "transparent",
        color: disabled ? PAPER_THEME.ink3 : PAPER_THEME.ink,
        fontFamily: T.headFont,
        fontSize: 16,
        cursor: disabled ? "default" : "pointer",
        opacity: disabled ? 0.4 : 1,
      }}
    >
      {children}
    </button>
  );
}
