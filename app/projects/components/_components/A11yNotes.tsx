type Note = {
  label: string;
  body: React.ReactNode;
};

export function A11yNotes({ notes }: { notes: Note[] }) {
  return (
    <aside
      aria-label="Accessibility notes"
      className="rounded-lg border border-indigo-200 bg-indigo-50 p-5"
    >
      <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-indigo-900">
        A11y notes
      </p>
      <dl className="space-y-3 text-sm text-slate-800">
        {notes.map((note) => (
          <div key={note.label}>
            <dt className="font-semibold text-slate-900">{note.label}</dt>
            <dd className="mt-1 text-slate-700">{note.body}</dd>
          </div>
        ))}
      </dl>
    </aside>
  );
}

export type { Note };
