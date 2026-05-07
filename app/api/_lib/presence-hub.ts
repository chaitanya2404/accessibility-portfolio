type Subscriber = {
  id: string;
  send: (event: string, data: unknown) => void;
};

type Topic = {
  subscribers: Map<string, Subscriber>;
};

const topics = new Map<string, Topic>();

function getTopic(name: string): Topic {
  let topic = topics.get(name);
  if (!topic) {
    topic = { subscribers: new Map() };
    topics.set(name, topic);
  }
  return topic;
}

function broadcast(topicName: string) {
  const topic = topics.get(topicName);
  if (!topic) return;
  const count = topic.subscribers.size;
  for (const sub of topic.subscribers.values()) {
    sub.send("presence", { topic: topicName, count });
  }
}

export function joinTopic(topicName: string, subscriber: Subscriber): () => void {
  const topic = getTopic(topicName);
  topic.subscribers.set(subscriber.id, subscriber);
  subscriber.send("presence", { topic: topicName, count: topic.subscribers.size });
  broadcast(topicName);

  return () => {
    const t = topics.get(topicName);
    if (!t) return;
    t.subscribers.delete(subscriber.id);
    if (t.subscribers.size === 0) {
      topics.delete(topicName);
    } else {
      broadcast(topicName);
    }
  };
}

export function topicCount(topicName: string): number {
  return topics.get(topicName)?.subscribers.size ?? 0;
}
