import { ProjectEventType } from '@/types/database';

export function trackProjectEvent(projectId: string, eventType: ProjectEventType) {
  fetch('/api/track-event', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ projectId, eventType }),
    keepalive: true,
  }).catch(() => {
    // fire-and-forget — ignore errors
  });
}
