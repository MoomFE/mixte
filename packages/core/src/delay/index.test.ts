import { delay, wait } from './index';

describe('delay', () => {
  test('方法返回一个 Promise', () => {
    expect(delay()).toBeInstanceOf(Promise);
  });

  test('默认延迟时间为 1000', () => {
    vi.useFakeTimers();

    expect(vi.getTimerCount()).toBe(0);
    delay();
    expect(vi.getTimerCount()).toBe(1);

    vi.advanceTimersByTime(999);
    expect(vi.getTimerCount()).toBe(1);
    vi.advanceTimersByTime(1);
    expect(vi.getTimerCount()).toBe(0);

    vi.useRealTimers();
  });

  test('指定延迟时间', () => {
    vi.useFakeTimers();

    const times = [1, 10, 20, 100, 200, 1000, 2000];

    for (const time of times) {
      expect(vi.getTimerCount()).toBe(0);
      delay(time);
      expect(vi.getTimerCount()).toBe(1);

      vi.advanceTimersByTime(time - 1);
      expect(vi.getTimerCount()).toBe(1);
      vi.advanceTimersByTime(1);
      expect(vi.getTimerCount()).toBe(0);
    }

    vi.useRealTimers();
  });
});

describe('wait', () => {
  test('wait 是 delay 的别名', () => {
    expect(wait).toBe(delay);
  });
});
