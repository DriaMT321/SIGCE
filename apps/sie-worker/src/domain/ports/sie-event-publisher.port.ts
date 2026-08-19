export type SieSyncEventName =
  | 'sie.sync.queued'
  | 'sie.sync.started'
  | 'sie.sync.progress'
  | 'sie.sync.verified'
  | 'sie.sync.failed';

export interface ISieEventPublisher {
  start(): Promise<void>;
  publish(event: SieSyncEventName, payload: Record<string, unknown>): Promise<void>;
  stop(): Promise<void>;
}
