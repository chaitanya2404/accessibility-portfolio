import Link from "next/link";

export default function DivisionHubNotFound() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-16">
      <h1 className="text-3xl font-bold tracking-tight text-fg">Department not found</h1>
      <p className="mt-4 text-fg-muted">
        That department does not exist. Visit the Division Hub overview to see all
        three.
      </p>
      <Link
        href="/projects/division-hub"
        className="mt-6 inline-flex rounded-md bg-accent px-4 py-2 text-sm font-semibold text-accent-fg hover:bg-accent-strong"
      >
        Division Hub overview
      </Link>
    </main>
  );
}
