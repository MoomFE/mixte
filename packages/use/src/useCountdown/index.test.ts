import { useCountdown } from '@mixte/use';
import { nextTick, ref } from 'vue-demi';

describe('useCountdown', () => {
  test('创建一个倒计时', async () => {
    vi.useFakeTimers();

    const source = ref(60);
    const { isStart, output, start, stop } = useCountdown(source);

    expect(isStart.value).toBe(false);
    expect(output.value).toBe(60);
    expect(start).toBeTypeOf('function');
    expect(stop).toBeTypeOf('function');

    // 默认情况下，倒计时不会自动开始
    vi.advanceTimersByTime(1000);
    expect(isStart.value).toBe(false);
    expect(output.value).toBe(60);

    // 开始倒计时
    start();
    await nextTick();
    expect(isStart.value).toBe(true);
    expect(output.value).toBe(60);
    vi.advanceTimersByTime(1000);
    expect(Math.round(output.value)).toBe(59);
    vi.advanceTimersByTime(4000);
    expect(Math.round(output.value)).toBe(55);
    vi.advanceTimersByTime(10000);
    expect(Math.round(output.value)).toBe(45);
    vi.advanceTimersByTime(40000);
    expect(Math.round(output.value)).toBe(5);
    vi.advanceTimersByTime(5000);
    expect(output.value).toBe(0);

    vi.useRealTimers();
  });

  test('首个传入参数为倒计时初始数字', () => {
    const res = useCountdown(60);
    const res2 = useCountdown(ref(30));
    const res3 = useCountdown(() => 15);

    expect(res.output.value).toBe(60);
    expect(res2.output.value).toBe(30);
    expect(res3.output.value).toBe(15);
  });

  test('默认倒计时所使用的时间为 60 秒', async () => {
    vi.useFakeTimers();

    const source = ref(60);
    const { isStart, output, start } = useCountdown(source);

    expect(isStart.value).toBe(false);
    expect(output.value).toBe(60);
    start();
    await nextTick();
    expect(isStart.value).toBe(true);
    expect(output.value).toBe(60);

    vi.advanceTimersByTime(59000);
    expect(isStart.value).toBe(true);
    expect(Math.round(output.value)).toBe(1);

    vi.advanceTimersByTime(1000);
    expect(isStart.value).toBe(true);
    expect(output.value).toBe(0);

    await nextTick();
    expect(isStart.value).toBe(false);
    expect(output.value).toBe(0);

    vi.useRealTimers();
  });

  test('第二个参数可传入 duration 选项控制倒计时所使用的时间', async () => {
    vi.useFakeTimers();

    const source = ref(60);
    const { isStart, output, start } = useCountdown(source, { duration: 30 * 1000 });

    expect(isStart.value).toBe(false);
    expect(output.value).toBe(60);
    start();
    await nextTick();
    expect(isStart.value).toBe(true);
    expect(output.value).toBe(60);

    vi.advanceTimersByTime(15000);
    expect(isStart.value).toBe(true);
    expect(Math.round(output.value)).toBe(30);

    vi.advanceTimersByTime(14000);
    expect(isStart.value).toBe(true);
    expect(Math.round(output.value)).toBe(2);

    vi.advanceTimersByTime(1000);
    expect(isStart.value).toBe(true);
    expect(output.value).toBe(0);

    await nextTick();
    expect(isStart.value).toBe(false);
    expect(output.value).toBe(0);

    vi.useRealTimers();
  });

  test('使用返回的 start 和 stop 方法控制倒计时开始及结束', async () => {
    vi.useFakeTimers();

    const source = ref(60);
    const { isStart, output, start, stop } = useCountdown(source);

    expect(isStart.value).toBe(false);
    expect(output.value).toBe(60);

    // 默认情况下，倒计时不会自动开始
    vi.advanceTimersByTime(10000);
    expect(output.value).toBe(60);

    // 开始倒计时
    start();
    await nextTick();
    expect(isStart.value).toBe(true);
    expect(output.value).toBe(60);

    vi.advanceTimersByTime(10000);
    expect(Math.round(output.value)).toBe(50);

    // 结束倒计时
    stop();
    await nextTick();
    expect(isStart.value).toBe(false);
    expect(output.value).toBe(60);

    // 倒计时结束后，倒计时不会再继续
    vi.advanceTimersByTime(10000);
    expect(output.value).toBe(60);

    vi.useRealTimers();
  });
});
