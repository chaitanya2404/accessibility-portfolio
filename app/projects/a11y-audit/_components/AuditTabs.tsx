"use client";

import * as Tabs from "@radix-ui/react-tabs";
import { AuditForm } from "./AuditForm";
import { AuditCrawl } from "./AuditCrawl";
import { AuditCompare } from "./AuditCompare";
import { WorkerAudit } from "./WorkerAudit";

export function AuditTabs() {
  return (
    <Tabs.Root defaultValue="single" className="rounded-lg border border-divider">
      <Tabs.List
        aria-label="Audit modes"
        className="flex border-b border-divider bg-surface-raised p-1"
      >
        <Tabs.Trigger
          value="single"
          className="rounded-md px-3 py-2 text-sm font-medium text-fg-muted hover:text-fg data-[state=active]:bg-surface data-[state=active]:text-accent data-[state=active]:shadow-sm"
        >
          Single page
        </Tabs.Trigger>
        <Tabs.Trigger
          value="crawl"
          className="rounded-md px-3 py-2 text-sm font-medium text-fg-muted hover:text-fg data-[state=active]:bg-surface data-[state=active]:text-accent data-[state=active]:shadow-sm"
        >
          Crawl site
        </Tabs.Trigger>
        <Tabs.Trigger
          value="compare"
          className="rounded-md px-3 py-2 text-sm font-medium text-fg-muted hover:text-fg data-[state=active]:bg-surface data-[state=active]:text-accent data-[state=active]:shadow-sm"
        >
          Compare
        </Tabs.Trigger>
        <Tabs.Trigger
          value="full"
          className="rounded-md px-3 py-2 text-sm font-medium text-fg-muted hover:text-fg data-[state=active]:bg-surface data-[state=active]:text-accent data-[state=active]:shadow-sm"
        >
          Full audit (axe in Worker)
        </Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content
        value="single"
        className="bg-surface p-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-focus"
      >
        <AuditForm />
      </Tabs.Content>
      <Tabs.Content
        value="crawl"
        className="bg-surface p-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-focus"
      >
        <AuditCrawl />
      </Tabs.Content>
      <Tabs.Content
        value="compare"
        className="bg-surface p-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-focus"
      >
        <AuditCompare />
      </Tabs.Content>
      <Tabs.Content
        value="full"
        className="bg-surface p-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-focus"
      >
        <WorkerAudit />
      </Tabs.Content>
    </Tabs.Root>
  );
}
