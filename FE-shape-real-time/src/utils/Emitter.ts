/* eslint-disable @typescript-eslint/no-explicit-any */
class Emitter {
  private events: any = {};

  emit(event: string, ...args: any[]) {
    if (this.events[event]) {
      this.events[event].forEach((fn: Function) => fn(...args));
    }
    return this;
  }

  on(event: string, fn: Function) {
    if (this.events[event]) this.events[event].push(fn);
    else this.events[event] = [fn];
    return this;
  }

  off(event?: string, fn?: Function) {
    if (event && typeof(fn) === 'function') {
      const listeners = this.events[event];
      const index = listeners.findIndex((_fn: Function) => _fn === fn);
      listeners.splice(index, 1);
    } else this.events[event || ''] = [];
    return this;
  }
}

export default Emitter;
