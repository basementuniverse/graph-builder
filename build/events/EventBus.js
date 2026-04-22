"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class EventBus {
    constructor() {
        this.listeners = {};
    }
    on(event, handler) {
        const listeners = this.ensureListeners(event);
        listeners.add(handler);
        return () => this.off(event, handler);
    }
    off(event, handler) {
        const listeners = this.listeners[event];
        if (!listeners) {
            return;
        }
        listeners.delete(handler);
        if (listeners.size === 0) {
            delete this.listeners[event];
        }
    }
    once(event, handler) {
        const dispose = this.on(event, payload => {
            dispose();
            handler(payload);
        });
        return dispose;
    }
    emit(event, payload) {
        const listeners = this.listeners[event];
        if (!listeners || listeners.size === 0) {
            return;
        }
        for (const listener of [...listeners]) {
            listener(payload);
        }
    }
    emitCancellable(event, payload) {
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
    clear() {
        this.listeners = {};
    }
    ensureListeners(event) {
        if (!this.listeners[event]) {
            this.listeners[event] = new Set();
        }
        return this.listeners[event];
    }
}
exports.default = EventBus;
//# sourceMappingURL=EventBus.js.map