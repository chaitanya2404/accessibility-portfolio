"use client";

import { useCallback } from "react";

type Item = { id: string; label: string };

export function Sidebar({ items }: { items: Item[] }) {
  const onClick = useCallback(
    (event: React.MouseEvent<HTMLAnchorElement>, id: string) => {
      event.preventDefault();
      const target = document.getElementById(id);
      if (!target) return;
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      target.focus({ preventScroll: true });
      if (typeof window !== "undefined") {
        window.history.replaceState(null, "", `#${id}`);
      }
    },
    []
  );

  return (
    <nav aria-label="Component sections" className="lg:sticky lg:top-20">
      <p
        id="component-sections-heading"
        className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-600"
      >
        On this page
      </p>
      <ul aria-labelledby="component-sections-heading" className="space-y-1">
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              onClick={(e) => onClick(e, item.id)}
              className="block rounded-md px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 hover:text-slate-900"
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
