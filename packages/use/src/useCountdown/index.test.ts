import { useCountdown } from '@mixte/use';
import { nextTick, ref } from 'vue-demi';

describe('useCountdown', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it('创建一个倒计时', async () => {
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
  });

  it('首个传入参数为倒计时初始数字', () => {
    const res = useCountdown(60);
    const res2 = useCountdown(ref(30));
    const res3 = useCountdown(() => 15);

    expect(res.output.value).toBe(60);
    expect(res2.output.value).toBe(30);
    expect(res3.output.value).toBe(15);
  });

  it('开启倒计时时, 会重新读取最新的倒计时初始数字进行倒计时', async () => {
    const source = ref(60);
    const { isStart, output, start } = useCountdown(source);

    expect(isStart.value).toBe(false);
    expect(output.value).toBe(60);

    source.value = 120;

    expect(isStart.value).toBe(false);
    expect(output.value).toBe(120);

    await nextTick();

    expect(isStart.value).toBe(false);
    expect(output.value).toBe(120);

    start();
    await nextTick();

    expect(isStart.value).toBe(true);
    expect(output.value).toBe(120);

    vi.advanceTimersByTime(30000);
    expect(isStart.value).toBe(true);
    expect(output.value).toBe(60);

    vi.advanceTimersByTime(30000);
    expect(isStart.value).toBe(true);
    expect(output.value).toBe(0);

    await nextTick();
    expect(isStart.value).toBe(false);
    expect(output.value).toBe(120);
  });

  it('停止倒计时过一会又重新开始, 会重新读取最新的倒计时初始数字进行倒计时', async () => {
    const source = ref(60);
    const { isStart, output, start, stop } = useCountdown(source);

    expect(isStart.value).toBe(false);
    expect(output.value).toBe(60);
    start();
    await nextTick();
    expect(isStart.value).toBe(true);
    expect(output.value).toBe(60);

    vi.advanceTimersByTime(30000);
    expect(isStart.value).toBe(true);
    expect(output.value).toBe(30);
    stop();
    await nextTick();
    expect(isStart.value).toBe(false);
    expect(output.value).toBe(60);

    vi.advanceTimersByTime(100000);

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
    expect(output.value).toBe(60);
  });

  it('默认倒计时所使用的时间为 60 秒', async () => {
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
    expect(output.value).toBe(60);
  });

  it('第二个参数可传入 duration 选项控制倒计时所使用的时间', async () => {
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
    expect(output.value).toBe(60);
  });

  it('使用返回的 start 和 stop 方法控制倒计时开始及结束', async () => {
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
  });

  it('作用域销毁时, 倒计时会自动停止', async () => {
    let isStart: Ref<boolean>;
    let output: Ref<number>;
    let start: (() => void);

    const scope = effectScope();

    scope.run(() => {
      const {
        isStart: _isStart,
        output: _output,
        start: _start,
      } = useCountdown(60);

      isStart = _isStart;
      output = _output;
      start = _start;
    });

    expect(isStart!.value).toBe(false);
    expect(output!.value).toBe(60);
    expect(start!).toBeTypeOf('function');

    // 开始倒计时
    start!();
    await nextTick();
    expect(isStart!.value).toBe(true);
    expect(output!.value).toBe(60);

    vi.advanceTimersByTime(10000);
    expect(isStart!.value).toBe(true);
    expect(Math.round(output!.value)).toBe(50);

    // 销毁作用域
    scope.stop();
    await nextTick();

    // 倒计时结束后，倒计时不会再继续, 相关的 ref 也会被销毁
    expect(isStart!.value).toBe(true);
    expect(output!.value).toBe(50);

    vi.advanceTimersByTime(10000);
    expect(isStart!.value).toBe(true);
    expect(Math.round(output!.value)).toBe(50);

    vi.advanceTimersByTime(10000);
    expect(isStart!.value).toBe(true);
    expect(Math.round(output!.value)).toBe(50);
  });
});
