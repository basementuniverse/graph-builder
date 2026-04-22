import type { GraphBuilderEventMap } from '../types';

type EventHandler<TPayload> = (payload: TPayload) => unknown;

type ListenerMap<TEventMap extends Record<string, unknown>> = {
  [K in keyof TEventMap]?: Set<EventHandler<TEventMap[K]>>;
};

export default class EventBus<
  TEventMap extends Record<string, unknown> = GraphBuilderEventMap,
> {
  private listeners: ListenerMap<TEventMap> = {};

  public on<E extends keyof TEventMap>(
    event: E,
    handler: EventHandler<TEventMap[E]>
  ): () => void {
    const listeners = this.ensureListeners(event);
    listeners.add(handler);
    return () => this.off(event, handler);
  }

  public off<E extends keyof TEventMap>(
    event: E,
    handler: EventHandler<TEventMap[E]>
  ) {
    const listeners = this.listeners[event];
    if (!listeners) {
      return;
    }
    listeners.delete(handler);
    if (listeners.size === 0) {
      delete this.listeners[event];
    }
  }

  public once<E extends keyof TEventMap>(
    event: E,
    handler: EventHandler<TEventMap[E]>
  ): () => void {
    const dispose = this.on(event, payload => {
      dispose();
      handler(payload);
    });
    return dispose;
  }

  public emit<E extends keyof TEventMap>(event: E, payload: TEventMap[E]) {
    const listeners = this.listeners[event];
    if (!listeners || listeners.size === 0) {
      return;
    }

    for (const listener of [...listeners]) {
      listener(payload);
    }
  }

  public emitCancellable<E extends keyof TEventMap>(
    event: E,
    payload: TEventMap[E]
  ) {
    const listeners = this.listeners[event];
    if (!listeners || listeners.size === 0) {
      return { cancelled: false };
    }

    for (const listener of [...listeners]) {
      if (listener(payload) === false) {
        return { cancelled: true };
      }
    }

    return { cancelled: false };
  }

  public clear() {
    this.listeners = {};
  }

  private ensureListeners<E extends keyof TEventMap>(event: E) {
    if (!this.listeners[event]) {
      this.listeners[event] = new Set<EventHandler<TEventMap[E]>>();
    }

    return this.listeners[event]!;
  }
}
