import type { CancellableGraphBuilderEvent, GraphBuilderEventMap } from './EventTypes';
type EventHandler<TPayload> = (payload: TPayload) => void;
export default class EventBus<TEventMap extends Record<string, unknown> = GraphBuilderEventMap> {
    private listeners;
    on<E extends keyof TEventMap>(event: E, handler: EventHandler<TEventMap[E]>): () => void;
    off<E extends keyof TEventMap>(event: E, handler: EventHandler<TEventMap[E]>): void;
    once<E extends keyof TEventMap>(event: E, handler: EventHandler<TEventMap[E]>): () => void;
    emit<E extends keyof TEventMap>(event: E, payload: TEventMap[E]): void;
    emitCancellable<E extends keyof TEventMap>(event: E, payload: TEventMap[E], cancellable: E extends CancellableGraphBuilderEvent ? true : false): {
        cancelled: boolean;
    };
    clear(): void;
    private ensureListeners;
}
export {};
//# sourceMappingURL=EventBus.d.ts.map