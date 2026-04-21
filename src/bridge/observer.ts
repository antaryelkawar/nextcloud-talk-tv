import { createEffect } from 'solid-js';

export function observe<T>(signal: () => T, callback: (value: T) => void) {
  let lastValue: T | undefined;
  let isScheduled = false;

  createEffect(() => {
    const value = signal();
    lastValue = value;

    if (!isScheduled) {
      isScheduled = true;
      requestAnimationFrame(() => {
        isScheduled = false;
        if (lastValue !== undefined) {
          callback(lastValue as T);
        }
      });
    }
  });
}
