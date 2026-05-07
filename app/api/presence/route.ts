import { createSseStream } from "@/app/api/_lib/sse";
import { joinTopic } from "@/app/api/_lib/presence-hub";

const ALLOWED_TOPICS = new Set(["procurement", "hr", "facilities"]);

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const topic = searchParams.get("topic");
  const sessionId = searchParams.get("sid");

  if (!topic || !ALLOWED_TOPICS.has(topic)) {
    return new Response("Invalid or missing topic", { status: 400 });
  }
  if (!sessionId) {
    return new Response("Missing session id", { status: 400 });
  }

  return createSseStream((channel) => {
    const leave = joinTopic(topic, {
      id: sessionId,
      send: channel.send,
    });
    return leave;
  });
}
