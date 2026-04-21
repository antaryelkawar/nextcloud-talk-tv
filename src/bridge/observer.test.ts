import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createSignal } from 'solid-js';
import { observe } from './observer';

describe('observe', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    // Mock requestAnimationFrame
    vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => {
      return setTimeout(() => callback(performance.now()), 0) as unknown as number;
    });
    vi.stubGlobal('cancelAnimationFrame', (handle: number) => {
      clearTimeout(handle);
    });
    vi.stubGlobal('performance', { now: () => Date.now() });
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it('should trigger the callback when the signal changes, scheduled via requestAnimationFrame', () => {
    const [signal, setSignal] = createSignal(0);
    const callback = vi.fn();

    observe(signal, callback);

    setSignal(1);

    // The callback shouldn't have been called immediately
    expect(callback).not.toHaveBeenCalled();

    // Fast-forward time to trigger requestAnimationFrame (which we mocked with setTimeout)
    vi.runAllTimers();

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith(1);
  });
});
