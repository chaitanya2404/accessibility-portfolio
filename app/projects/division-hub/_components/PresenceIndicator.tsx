"use client";

import { useEffect, useRef, useState } from "react";
import { Users } from "lucide-react";
import { useAnnounce } from "@/components/LiveRegion";
import { track } from "@/lib/analytics";
import type { DepartmentSlug } from "../data";

function generateSessionId(): string {
  return `s_${Math.random().toString(36).slice(2, 10)}`;
}

export function PresenceIndicator({ departmentSlug }: { departmentSlug: DepartmentSlug }) {
  const [count, setCount] = useState<number | null>(null);
  const previousCount = useRef<number | null>(null);
  const announce = useAnnounce();

  useEffect(() => {
    const sid = generateSessionId();
    const source = new EventSource(
      `/api/presence?topic=${encodeURIComponent(departmentSlug)}&sid=${sid}`
    );

    track("presence.subscribed", { topic: departmentSlug });

    source.addEventListener("presence", (e) => {
      try {
        const data = JSON.parse((e as MessageEvent).data) as { count: number };
        setCount(data.count);
        if (previousCount.current != null && data.count !== previousCount.current) {
          announce(
            data.count === 1
              ? "You are the only person viewing this department."
              : `${data.count} people are viewing this department.`,
            "polite"
          );
        }
        previousCount.current = data.count;
      } catch {
        // ignore
      }
    });

    return () => {
      source.close();
      track("presence.unsubscribed", { topic: departmentSlug });
    };
  }, [departmentSlug, announce]);

  if (count == null) return null;

  return (
    <p
      className="inline-flex items-center gap-1.5 rounded-full border border-divider bg-surface-raised px-3 py-1 text-xs font-medium text-fg-muted"
      aria-live="off"
    >
      <Users className="h-3.5 w-3.5 text-accent" aria-hidden="true" />
      {count === 1 ? "Only you are viewing" : `${count} viewing`}
    </p>
  );
}
