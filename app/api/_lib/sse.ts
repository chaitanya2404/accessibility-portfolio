export type SseChannel = {
  send: (event: string, data: unknown) => void;
  close: () => void;
  closed: boolean;
};

export function createSseStream(
  setup: (channel: SseChannel) => (() => void) | void
): Response {
  const encoder = new TextEncoder();
  let cleanup: (() => void) | void;

  const stream = new ReadableStream({
    start(controller) {
      const channel: SseChannel = {
        closed: false,
        send(event, data) {
          if (channel.closed) return;
          const payload = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
          try {
            controller.enqueue(encoder.encode(payload));
          } catch {
            channel.closed = true;
          }
        },
        close() {
          if (channel.closed) return;
          channel.closed = true;
          try {
            controller.close();
          } catch {
            // already closed
          }
        },
      };

      controller.enqueue(encoder.encode(": connected\n\n"));
      cleanup = setup(channel) ?? undefined;
    },
    cancel() {
      cleanup?.();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}
