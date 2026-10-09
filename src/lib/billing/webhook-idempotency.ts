const processedEvents = new Set<string>();

export function isWebhookEventProcessed(eventId: string): boolean {
  return processedEvents.has(eventId);
}

export function markWebhookEventProcessed(eventId: string) {
  processedEvents.add(eventId);
}
