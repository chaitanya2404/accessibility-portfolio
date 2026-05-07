"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

type Priority = "polite" | "assertive";

type Announcement = { id: number; message: string; priority: Priority };

type LiveRegionContextValue = {
  announce: (message: string, priority?: Priority) => void;
};

const LiveRegionContext = createContext<LiveRegionContextValue | null>(null);

const CLEAR_AFTER_MS = 4000;

export function LiveRegionProvider({ children }: { children: React.ReactNode }) {
  const [polite, setPolite] = useState<Announcement | null>(null);
  const [assertive, setAssertive] = useState<Announcement | null>(null);
  const counter = useRef(0);
  const timeouts = useRef<{ polite?: number; assertive?: number }>({});

  useEffect(() => {
    const handles = timeouts.current;
    return () => {
      if (handles.polite) window.clearTimeout(handles.polite);
      if (handles.assertive) window.clearTimeout(handles.assertive);
    };
  }, []);

  const announce = useCallback((message: string, priority: Priority = "polite") => {
    const id = ++counter.current;
    const next = { id, message, priority };
    if (priority === "polite") {
      setPolite(next);
      if (timeouts.current.polite) window.clearTimeout(timeouts.current.polite);
      timeouts.current.polite = window.setTimeout(() => {
        setPolite((cur) => (cur && cur.id === id ? null : cur));
      }, CLEAR_AFTER_MS);
    } else {
      setAssertive(next);
      if (timeouts.current.assertive) window.clearTimeout(timeouts.current.assertive);
      timeouts.current.assertive = window.setTimeout(() => {
        setAssertive((cur) => (cur && cur.id === id ? null : cur));
      }, CLEAR_AFTER_MS);
    }
  }, []);

  return (
    <LiveRegionContext.Provider value={{ announce }}>
      {children}
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only-focusable"
      >
        {polite?.message ?? ""}
      </div>
      <div
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
        className="sr-only-focusable"
      >
        {assertive?.message ?? ""}
      </div>
    </LiveRegionContext.Provider>
  );
}

export function useAnnounce() {
  const ctx = useContext(LiveRegionContext);
  if (!ctx) {
    throw new Error("useAnnounce must be used inside <LiveRegionProvider>");
  }
  return ctx.announce;
}
