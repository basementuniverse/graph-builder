import type { GraphBuilderEventMap } from '../types';
type EventHandler<TPayload> = (payload: TPayload) => unknown;
export default class EventBus<TEventMap extends Record<string, unknown> = GraphBuilderEventMap> {
    private listeners;
    on<E extends keyof TEventMap>(event: E, handler: EventHandler<TEventMap[E]>): () => void;
    off<E extends keyof TEventMap>(event: E, handler: EventHandler<TEventMap[E]>): void;
    once<E extends keyof TEventMap>(event: E, handler: EventHandler<TEventMap[E]>): () => void;
    emit<E extends keyof TEventMap>(event: E, payload: TEventMap[E]): void;
    emitCancellable<E extends keyof TEventMap>(event: E, payload: TEventMap[E]): {
        cancelled: boolean;
    };
    clear(): void;
    private ensureListeners;
}
export {};
//# sourceMappingURL=EventBus.d.ts.map