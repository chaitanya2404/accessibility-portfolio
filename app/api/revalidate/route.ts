import { revalidatePath } from "next/cache";

const REVALIDATE_TOKEN =
  process.env.REVALIDATE_TOKEN ?? "demo-token-not-for-production";

const ALLOWED_PATHS = new Set([
  "/projects/division-hub",
  "/projects/division-hub/procurement",
  "/projects/division-hub/hr",
  "/projects/division-hub/facilities",
]);

export async function POST(request: Request) {
  const provided =
    request.headers.get("x-revalidate-token") ??
    new URL(request.url).searchParams.get("token");

  if (provided !== REVALIDATE_TOKEN) {
    return new Response(JSON.stringify({ error: "Forbidden" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  let body: { path?: string };
  try {
    body = (await request.json()) as { path?: string };
  } catch {
    body = {};
  }
  const path = body.path ?? new URL(request.url).searchParams.get("path");

  if (!path || !ALLOWED_PATHS.has(path)) {
    return new Response(
      JSON.stringify({
        error: "Invalid path",
        allowedPaths: [...ALLOWED_PATHS],
      }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  revalidatePath(path);
  return new Response(JSON.stringify({ ok: true, revalidated: path }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
