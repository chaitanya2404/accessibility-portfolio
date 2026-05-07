"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Command } from "cmdk";
import { Search } from "lucide-react";
import { useAnnounce } from "@/components/LiveRegion";
import { track } from "@/lib/analytics";
import { allStaff } from "../data";

export function StaffSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const router = useRouter();
  const announce = useAnnounce();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
        if (!open) {
          track("nav.search.opened", { source: "shortcut" });
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const onSelect = (slug: string, email: string) => {
    setOpen(false);
    track("nav.search.selected", { staffEmail: email });
    announce(`Navigating to ${slug} department.`, "polite");
    router.push(`/projects/division-hub/${slug}#${email.split("@")[0]}`);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setOpen(true);
          track("nav.search.opened", { source: "button" });
        }}
        className="inline-flex items-center gap-2 rounded-md border border-divider bg-surface px-3 py-1.5 text-sm text-fg-muted hover:bg-surface-raised"
        aria-keyshortcuts="Control+K Meta+K"
      >
        <Search className="h-4 w-4" aria-hidden="true" />
        <span className="hidden sm:inline">Search staff</span>
        <kbd className="ml-1 hidden rounded border border-divider px-1.5 py-0.5 font-mono text-[10px] text-fg-subtle sm:inline">
          ⌘K
        </kbd>
      </button>

      <Command.Dialog
        open={open}
        onOpenChange={setOpen}
        label="Search staff across all departments"
        contentClassName="fixed left-1/2 top-24 z-50 w-[min(92vw,32rem)] -translate-x-1/2 overflow-hidden rounded-lg border border-divider bg-surface shadow-xl"
        overlayClassName="fixed inset-0 z-40 bg-fg/40"
      >
        <div className="flex items-center gap-2 border-b border-divider px-4">
          <Search className="h-4 w-4 text-fg-subtle" aria-hidden="true" />
          <Command.Input
            value={query}
            onValueChange={setQuery}
            placeholder="Search staff by name, role, or extension…"
            className="flex-1 bg-transparent py-3 text-sm text-fg placeholder:text-fg-subtle focus:outline-none"
          />
        </div>
        <Command.List className="max-h-80 overflow-y-auto p-1">
          <Command.Empty className="px-4 py-6 text-center text-sm text-fg-muted">
            No staff match &ldquo;{query}&rdquo;.
          </Command.Empty>
          {allStaff.map((s) => (
            <Command.Item
              key={s.email}
              value={`${s.name} ${s.role} ${s.email} ${s.extension}`}
              onSelect={() => onSelect(s.departmentSlug, s.email)}
              className="cursor-pointer rounded-md px-3 py-2 text-sm text-fg data-[selected=true]:bg-accent-soft data-[selected=true]:text-accent-strong"
            >
              <div className="flex items-baseline justify-between gap-3">
                <div>
                  <p className="font-medium text-fg">{s.name}</p>
                  <p className="text-xs text-fg-muted">{s.role}</p>
                </div>
                <p className="font-mono text-xs text-fg-subtle">
                  {s.departmentName} · x{s.extension}
                </p>
              </div>
            </Command.Item>
          ))}
        </Command.List>
        <div className="border-t border-divider bg-surface-raised px-4 py-2 text-xs text-fg-subtle">
          ↑↓ to navigate · Enter to open · Esc to close
        </div>
      </Command.Dialog>
    </>
  );
}
