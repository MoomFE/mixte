import { delay, onceRun } from 'mixte';

describe.concurrent('onceRun', () => {
  it('返回一个新的函数', () => {
    const fn = () => {};
    const wrapFn = onceRun(fn);

    expect(typeof wrapFn === 'function').is.true;
    expect(wrapFn !== fn).is.true;
  });

  it('运行函数返回一个 Promise', () => {
    const fn = () => {};
    const wrapFn = onceRun(fn);

    expect(wrapFn()).toBeInstanceOf(Promise);
    expect(wrapFn()).toBeInstanceOf(Promise);
    expect(wrapFn()).toBeInstanceOf(Promise);
  });

  it('传入的函数未执行完成时, 重复执行时返回的 Promise 和首次一致', () => {
    const list: number[] = [];
    let index = 0;

    const fn = async () => {
      await delay(100);
      list.push(index++);
    };
    const wrapFn = onceRun(fn);

    const res = wrapFn();
    const res2 = wrapFn();
    const res3 = wrapFn();

    expect(res).toBe(res2);
    expect(res2).toBe(res3);
  });

  it('传入的函数未执行完成时, 重复执行无效果', async ({ expect }) => {
    const list: number[] = [];
    let index = 0;

    const fn = async () => {
      await delay(100);
      list.push(index++);
    };
    const wrapFn = onceRun(fn);

    await Promise.all([
      wrapFn(),
      wrapFn(),
      wrapFn(),
    ]);

    expect(list).toStrictEqual([0]);
  });

  it('传入的函数运行过程中报错, 不会影响下次运行', async ({ expect }) => {
    const list: number[] = [];
    let index = 0;

    const fn = async () => {
      await delay(100);

      if (index === 1) {
        index++;
        throw new Error('???');
      }
      else {
        list.push(index++);
      }
    };
    const wrapFn = onceRun(fn);

    // 正常
    await Promise.allSettled([wrapFn(), wrapFn(), wrapFn()]);
    expect(list).toStrictEqual([0]);

    // 报错
    await Promise.allSettled([wrapFn(), wrapFn(), wrapFn()]);
    expect(list).toStrictEqual([0]);

    // 正常
    await Promise.allSettled([wrapFn(), wrapFn(), wrapFn()]);
    expect(list).toStrictEqual([0, 2]);
  });

  it('执行完成会返回传入函数的返回值', async ({ expect }) => {
    let index = 0;

    const wrapFn = onceRun(() => index++);
    const wrapFn2 = onceRun(async () => {
      await delay(100);
      return index++;
    });

    const res = wrapFn();
    const res2 = wrapFn();
    const res3 = wrapFn2();
    const res4 = wrapFn2();

    expect(await res).toBe(0);
    expect(await res2).toBe(0);
    expect(await res3).toBe(1);
    expect(await res4).toBe(1);
  });

  it('传入的函数执行时的 this 应该被继承', async ({ expect }) => {
    const that = 6;
    let res;

    const wrapFn = onceRun(function () {
      // @ts-expect-error
      // eslint-disable-next-line ts/no-this-alias
      res = this;
    });

    await wrapFn.call(that);

    expect(res).toBe(that);
  });
});
