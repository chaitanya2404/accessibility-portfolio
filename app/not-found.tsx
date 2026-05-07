import Link from "next/link";

export default function RootNotFound() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-16">
      <h1 className="text-3xl font-bold tracking-tight text-fg">Page not found</h1>
      <p className="mt-4 text-fg-muted">
        That route does not exist. The home page lists every working project.
      </p>
      <Link
        href="/"
        className="mt-6 inline-flex rounded-md bg-accent px-4 py-2 text-sm font-semibold text-accent-fg hover:bg-accent-strong"
      >
        Back to home
      </Link>
    </main>
  );
}
