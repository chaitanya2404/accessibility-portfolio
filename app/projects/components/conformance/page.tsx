import Link from "next/link";
import { Heading } from "@/components/Heading";

export const metadata = {
  title: "WCAG conformance — Components",
  description:
    "Per-component VPAT-lite mapping which WCAG success criteria each demo meets, partially meets, or marks as not applicable.",
};

type Conformance = "Met" | "Partial" | "N/A";

type Row = {
  sc: string;
  level: "A" | "AA";
  name: string;
  status: Conformance;
  rationale: string;
};

const COMPONENTS: { id: string; name: string; rows: Row[] }[] = [
  {
    id: "accordion",
    name: "Accordion",
    rows: [
      { sc: "1.3.1", level: "A", name: "Info and Relationships", status: "Met", rationale: "Each panel is a labelled region; each header is a button with aria-expanded and aria-controls." },
      { sc: "2.1.1", level: "A", name: "Keyboard", status: "Met", rationale: "Tab to header, Enter/Space to toggle, Arrow keys move between headers, Home/End jump to first/last." },
      { sc: "2.4.3", level: "A", name: "Focus Order", status: "Met", rationale: "Focus stays on the trigger when toggling so users keep their place." },
      { sc: "4.1.2", level: "A", name: "Name, Role, Value", status: "Met", rationale: "Buttons are native button elements; aria-expanded reflects state." },
    ],
  },
  {
    id: "dialog",
    name: "Modal dialog",
    rows: [
      { sc: "2.1.2", level: "A", name: "No Keyboard Trap", status: "Met", rationale: "Esc closes the dialog and returns focus to the trigger." },
      { sc: "2.4.3", level: "A", name: "Focus Order", status: "Met", rationale: "Focus traps inside the dialog while open and returns to the triggering button on close." },
      { sc: "3.3.1", level: "A", name: "Error Identification", status: "Partial", rationale: "Required field has HTML5 validation; custom validation messages would need aria-describedby wiring per field." },
      { sc: "4.1.2", level: "A", name: "Name, Role, Value", status: "Met", rationale: "role=dialog with aria-modal=true, aria-labelledby on the title, aria-describedby on the description." },
    ],
  },
  {
    id: "tabs",
    name: "Tabs",
    rows: [
      { sc: "1.3.1", level: "A", name: "Info and Relationships", status: "Met", rationale: "tablist/tab/tabpanel roles set, aria-selected and aria-controls wired by Radix." },
      { sc: "2.1.1", level: "A", name: "Keyboard", status: "Met", rationale: "Arrow Left/Right move between tabs, Home/End jump, Tab moves into the active panel." },
      { sc: "2.4.3", level: "A", name: "Focus Order", status: "Met", rationale: "Roving tabindex; only the active tab is in the tab sequence." },
    ],
  },
  {
    id: "combobox",
    name: "Combobox",
    rows: [
      { sc: "1.3.1", level: "A", name: "Info and Relationships", status: "Met", rationale: "role=combobox on input, role=listbox on results, role=option on items." },
      { sc: "2.1.1", level: "A", name: "Keyboard", status: "Met", rationale: "Type to filter, Arrow Up/Down to navigate, Enter to select." },
      { sc: "3.3.2", level: "A", name: "Labels or Instructions", status: "Met", rationale: "Visible <label htmlFor> on the input." },
      { sc: "4.1.3", level: "AA", name: "Status Messages", status: "Met", rationale: "Selected value rendered in an aria-live=polite region." },
    ],
  },
  {
    id: "toast",
    name: "Toast",
    rows: [
      { sc: "4.1.3", level: "AA", name: "Status Messages", status: "Met", rationale: "Viewport is a polite live region; role=status with aria-live=polite per toast." },
      { sc: "2.2.1", level: "A", name: "Timing Adjustable", status: "Partial", rationale: "Auto-dismiss pauses on focus and hover; not yet user-configurable." },
      { sc: "2.1.1", level: "A", name: "Keyboard", status: "Met", rationale: "F6 reaches the toast viewport; Tab cycles between action and close." },
    ],
  },
  {
    id: "data-table",
    name: "Data table",
    rows: [
      { sc: "1.3.1", level: "A", name: "Info and Relationships", status: "Met", rationale: "<caption>, <th scope=col>, aria-sort, aria-rowindex, aria-selected on rows, aria-label on checkboxes." },
      { sc: "2.1.1", level: "A", name: "Keyboard", status: "Met", rationale: "All controls (sort buttons, checkboxes, pagination) keyboard reachable; shift-click range has Space-toggle equivalent per row." },
      { sc: "4.1.3", level: "AA", name: "Status Messages", status: "Met", rationale: "\"Showing X–Y of Z\" announced politely; selection count announced on change." },
    ],
  },
  {
    id: "wizard",
    name: "Multi-step wizard",
    rows: [
      { sc: "2.4.3", level: "A", name: "Focus Order", status: "Met", rationale: "useStepFocus moves focus to the step heading on each step change so AT users land on the new section." },
      { sc: "3.3.1", level: "A", name: "Error Identification", status: "Met", rationale: "Per-field error has role=alert, aria-describedby on the input, aria-invalid set on failure." },
      { sc: "1.3.1", level: "A", name: "Info and Relationships", status: "Met", rationale: "Step list rendered as <ol> with aria-current=step on the active item." },
    ],
  },
  {
    id: "live-region",
    name: "Live region playground",
    rows: [
      { sc: "4.1.3", level: "AA", name: "Status Messages", status: "Met", rationale: "Polite + assertive regions both demonstrated; provider re-keys identical messages so back-to-back identical text re-announces." },
    ],
  },
  {
    id: "from-scratch",
    name: "Hand-rolled Switch",
    rows: [
      { sc: "4.1.2", level: "A", name: "Name, Role, Value", status: "Met", rationale: "role=switch, aria-checked reflects state, aria-label or label[htmlFor] required by the API." },
      { sc: "2.1.1", level: "A", name: "Keyboard", status: "Met", rationale: "Space and Enter both toggle. Default scroll on Space prevented." },
      { sc: "2.4.7", level: "AA", name: "Focus Visible", status: "Met", rationale: "focus-visible 2px ring with 2px offset; pointer focus deliberately suppressed." },
    ],
  },
];

const STATUS_BADGE: Record<Conformance, string> = {
  Met: "bg-pass-soft text-pass border-pass/30",
  Partial: "bg-warn-soft text-warn border-warn/30",
  "N/A": "bg-surface-raised text-fg-muted border-divider",
};

export default function ConformancePage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <header className="mb-10 max-w-3xl">
        <Link
          href="/projects/components"
          className="mb-3 inline-flex text-sm font-medium text-accent hover:text-accent-strong"
        >
          ← Back to Components
        </Link>
        <Heading level={1}>WCAG conformance — components</Heading>
        <p className="mt-4 text-lg text-fg-muted">
          A VPAT-lite report mapping every demo on the Components page to the
          WCAG 2.1 success criteria it materially exercises. Each row is
          marked Met, Partial, or N/A with a one-line rationale.
        </p>
        <p className="mt-3 text-sm text-fg-subtle">
          Coverage scope: keyboard parity, name/role/value, focus management,
          status messaging, and visible focus. Color contrast is verified at
          the token level (semantic CSS variables) and not re-asserted per
          component.
        </p>
      </header>

      <div className="space-y-10">
        {COMPONENTS.map((c) => (
          <section key={c.id} aria-labelledby={`conf-${c.id}`}>
            <Heading level={2} id={`conf-${c.id}`} className="mb-3">
              {c.name}
            </Heading>
            <div className="overflow-x-auto rounded-lg border border-divider">
              <table className="w-full border-collapse text-left text-sm">
                <caption className="sr-only">{c.name} WCAG conformance</caption>
                <thead className="bg-surface-raised text-fg-muted">
                  <tr>
                    <th scope="col" className="border-b border-divider px-4 py-3 font-semibold">SC</th>
                    <th scope="col" className="border-b border-divider px-4 py-3 font-semibold">Level</th>
                    <th scope="col" className="border-b border-divider px-4 py-3 font-semibold">Criterion</th>
                    <th scope="col" className="border-b border-divider px-4 py-3 font-semibold">Status</th>
                    <th scope="col" className="border-b border-divider px-4 py-3 font-semibold">Rationale</th>
                  </tr>
                </thead>
                <tbody>
                  {c.rows.map((r) => (
                    <tr key={r.sc} className="border-b border-divider/60 last:border-0 align-top">
                      <th scope="row" className="px-4 py-3 font-mono text-xs text-fg">{r.sc}</th>
                      <td className="px-4 py-3 text-xs text-fg-muted">{r.level}</td>
                      <td className="px-4 py-3 text-fg">{r.name}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-semibold ${STATUS_BADGE[r.status]}`}>
                          {r.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-fg-muted">{r.rationale}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
