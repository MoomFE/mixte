import type { EventHookOn } from '@vueuse/core';
import type { UseRequestOptions, UseRequestUserExecute } from '@mixte/use';
import { useRequest } from '@mixte/use';
import { delay } from 'mixte';
import { ref } from 'vue-demi';

describe('useRequest', () => {
  test('方法返回对象参数类型判断', () => {
    const data = useRequest(() => delay(100));

    expect(Object.keys(data).sort()).toStrictEqual([
      'response',
      'data',
      'error',

      'isExecuted',
      'isLoading',
      'isFinished',
      'isSuccess',

      'execute',

      'onSuccess',
      'onError',
      'onFinally',
    ].sort());

    expect(data.response).toBeUndefined();
    expect(data.data).toBeUndefined();
    expect(data.error).toBeUndefined();

    expect(data.isExecuted).toBeTypeOf('boolean');
    expect(data.isLoading).toBeTypeOf('boolean');
    expect(data.isFinished).toBeTypeOf('boolean');
    expect(data.isSuccess).toBeTypeOf('boolean');

    expect(data.execute).toBeTypeOf('function');

    expect(data.onSuccess).toBeTypeOf('function');
    expect(data.onError).toBeTypeOf('function');
    expect(data.onFinally).toBeTypeOf('function');
  });

  test('请求成功情况的返回对象参数', async () => {
    let throwError: boolean = false;
    let successEventCountAndArgs = [0] as [number, ...any[]];
    let errorEventCountAndArgs = [0] as [number, ...any[]];
    let finallyEventCountAndArgs = [0] as [number, ...any[]];
    let dataIndex = 1292;

    const data = useRequest(async () => {
      await delay(100);
      if (throwError) throw new Error('???');
      return {
        data: ++dataIndex,
      };
    });

    data.onSuccess((...args: any[]) => {
      expect(data.isLoading).toBe(false);
      expect(data.isFinished).toBe(true);
      expect(data.isSuccess).toBe(true);
      successEventCountAndArgs = [++successEventCountAndArgs[0], ...args];
    });
    data.onError((...args: any[]) => {
      expect(data.isLoading).toBe(false);
      expect(data.isFinished).toBe(true);
      expect(data.isSuccess).toBe(false);
      errorEventCountAndArgs = [++errorEventCountAndArgs[0], ...args];
    });
    data.onFinally((...args: any[]) => {
      expect(data.isLoading).toBe(false);
      expect(data.isFinished).toBe(true);
      expect(data.isSuccess).toBe(!data.error);
      finallyEventCountAndArgs = [++finallyEventCountAndArgs[0], ...args];
    });

    expect(data.response).toBeUndefined();
    expect(data.data).toBeUndefined();
    expect(data.error).toBeUndefined();
    expect(data.isExecuted).toBe(false);
    expect(data.isLoading).toBe(false);
    expect(data.isFinished).toBe(false);
    expect(data.isSuccess).toBe(false);
    expect(successEventCountAndArgs).toStrictEqual([0]);
    expect(errorEventCountAndArgs).toStrictEqual([0]);
    expect(finallyEventCountAndArgs).toStrictEqual([0]);

    // 进行请求成功情况的测试

    const result = data.execute();

    expect(data.response).toBeUndefined();
    expect(data.data).toBeUndefined();
    expect(data.error).toBeUndefined();
    expect(data.isExecuted).toBe(true);
    expect(data.isLoading).toBe(true);
    expect(data.isFinished).toBe(false);
    expect(data.isSuccess).toBe(false);
    expect(successEventCountAndArgs).toStrictEqual([0]);
    expect(errorEventCountAndArgs).toStrictEqual([0]);
    expect(finallyEventCountAndArgs).toStrictEqual([0]);

    expect(await result).toStrictEqual(data.response);

    expect(data.response).toStrictEqual({ data: 1293 });
    expect(data.data).toBe(1293);
    expect(data.error).toBeUndefined();
    expect(data.isExecuted).toBe(true);
    expect(data.isLoading).toBe(false);
    expect(data.isFinished).toBe(true);
    expect(data.isSuccess).toBe(true);
    expect(successEventCountAndArgs).toStrictEqual([1, { data: 1293 }]);
    expect(errorEventCountAndArgs).toStrictEqual([0]);
    expect(finallyEventCountAndArgs).toStrictEqual([1, null]);

    // 进行请求失败情况的测试

    throwError = true;
    const result2 = data.execute();

    expect(data.response).toBeUndefined();
    expect(data.data).toBeUndefined();
    expect(data.error).toBeUndefined();
    expect(data.isExecuted).toBe(true);
    expect(data.isLoading).toBe(true);
    expect(data.isFinished).toBe(false);
    expect(data.isSuccess).toBe(false);
    expect(successEventCountAndArgs).toStrictEqual([1, { data: 1293 }]);
    expect(errorEventCountAndArgs).toStrictEqual([0]);
    expect(finallyEventCountAndArgs).toStrictEqual([1, null]);

    try {
      await result2;
    }
    catch (error: any) {
      expect(error).toStrictEqual(new Error('???'));
    }

    expect(data.response).toBeUndefined();
    expect(data.data).toBeUndefined();
    expect(data.error).toStrictEqual(new Error('???'));
    expect(data.isExecuted).toBe(true);
    expect(data.isLoading).toBe(false);
    expect(data.isFinished).toBe(true);
    expect(data.isSuccess).toBe(false);
    expect(successEventCountAndArgs).toStrictEqual([1, { data: 1293 }]);
    expect(errorEventCountAndArgs).toStrictEqual([1, new Error('???')]);
    expect(finallyEventCountAndArgs).toStrictEqual([2, null]);
  });

  test('请求失败情况的返回对象参数', async () => {
    let throwError: boolean = true;
    let successEventCountAndArgs = [0] as [number, ...any[]];
    let errorEventCountAndArgs = [0] as [number, ...any[]];
    let finallyEventCountAndArgs = [0] as [number, ...any[]];
    let dataIndex = 1292;

    const data = useRequest(async () => {
      await delay(100);
      if (throwError) throw new Error('???');
      return {
        data: ++dataIndex,
      };
    });

    data.onSuccess((...args: any[]) => {
      expect(data.isLoading).toBe(false);
      expect(data.isFinished).toBe(true);
      expect(data.isSuccess).toBe(true);
      successEventCountAndArgs = [++successEventCountAndArgs[0], ...args];
    });
    data.onError((...args: any[]) => {
      expect(data.isLoading).toBe(false);
      expect(data.isFinished).toBe(true);
      expect(data.isSuccess).toBe(false);
      errorEventCountAndArgs = [++errorEventCountAndArgs[0], ...args];
    });
    data.onFinally((...args: any[]) => {
      expect(data.isLoading).toBe(false);
      expect(data.isFinished).toBe(true);
      expect(data.isSuccess).toBe(!data.error);
      finallyEventCountAndArgs = [++finallyEventCountAndArgs[0], ...args];
    });

    expect(data.response).toBeUndefined();
    expect(data.data).toBeUndefined();
    expect(data.error).toBeUndefined();
    expect(data.isExecuted).toBe(false);
    expect(data.isLoading).toBe(false);
    expect(data.isFinished).toBe(false);
    expect(data.isSuccess).toBe(false);
    expect(successEventCountAndArgs).toStrictEqual([0]);
    expect(errorEventCountAndArgs).toStrictEqual([0]);
    expect(finallyEventCountAndArgs).toStrictEqual([0]);

    // 进行请求失败情况的测试

    const result = data.execute();

    expect(data.response).toBeUndefined();
    expect(data.data).toBeUndefined();
    expect(data.error).toBeUndefined();
    expect(data.isExecuted).toBe(true);
    expect(data.isLoading).toBe(true);
    expect(data.isFinished).toBe(false);
    expect(data.isSuccess).toBe(false);
    expect(successEventCountAndArgs).toStrictEqual([0]);
    expect(errorEventCountAndArgs).toStrictEqual([0]);
    expect(finallyEventCountAndArgs).toStrictEqual([0]);

    try {
      await result;
    }
    catch (error: any) {
      expect(error).toStrictEqual(new Error('???'));
    }

    expect(data.response).toBeUndefined();
    expect(data.data).toBeUndefined();
    expect(data.error).toStrictEqual(new Error('???'));
    expect(data.isExecuted).toBe(true);
    expect(data.isLoading).toBe(false);
    expect(data.isFinished).toBe(true);
    expect(data.isSuccess).toBe(false);
    expect(successEventCountAndArgs).toStrictEqual([0]);
    expect(errorEventCountAndArgs).toStrictEqual([1, new Error('???')]);
    expect(finallyEventCountAndArgs).toStrictEqual([1, null]);

    // 进行请求成功情况的测试

    throwError = false;
    const result2 = data.execute();

    expect(data.response).toBeUndefined();
    expect(data.data).toBeUndefined();
    expect(data.error).toBeUndefined();
    expect(data.isExecuted).toBe(true);
    expect(data.isLoading).toBe(true);
    expect(data.isFinished).toBe(false);
    expect(data.isSuccess).toBe(false);
    expect(successEventCountAndArgs).toStrictEqual([0]);
    expect(errorEventCountAndArgs).toStrictEqual([1, new Error('???')]);
    expect(finallyEventCountAndArgs).toStrictEqual([1, null]);

    expect(await result2).toStrictEqual(data.response);

    expect(data.response).toStrictEqual({ data: 1293 });
    expect(data.data).toBe(1293);
    expect(data.error).toBeUndefined();
    expect(data.isExecuted).toBe(true);
    expect(data.isLoading).toBe(false);
    expect(data.isFinished).toBe(true);
    expect(data.isSuccess).toBe(true);
    expect(successEventCountAndArgs).toStrictEqual([1, { data: 1293 }]);
    expect(errorEventCountAndArgs).toStrictEqual([1, new Error('???')]);
    expect(finallyEventCountAndArgs).toStrictEqual([2, null]);
  });

  test('支持传入 immediate: true 选项立即发起请求', async () => {
    const data = useRequest(async () => {
      await delay(100);
      return {
        data: 1,
      };
    }, {
      immediate: true,
    });

    expect(data.response).toBeUndefined();
    expect(data.data).toBeUndefined();
    expect(data.error).toBeUndefined();
    expect(data.isExecuted).toBe(true);
    expect(data.isLoading).toBe(true);
    expect(data.isFinished).toBe(false);
    expect(data.isSuccess).toBe(false);

    await delay(100);

    expect(data.response).toStrictEqual({ data: 1 });
    expect(data.data).toBe(1);
    expect(data.error).toBeUndefined();
    expect(data.isExecuted).toBe(true);
    expect(data.isLoading).toBe(false);
    expect(data.isFinished).toBe(true);
    expect(data.isSuccess).toBe(true);
  });

  test('支持传入 initialData 选项定义初始数据, 发起请求时会重置 data 为传入的 initialData', async () => {
    const data = useRequest(async () => {
      await delay(100);
      return {
        data: 1,
      };
    }, {
      initialData: 666,
    });

    // 初始数据
    expect(data.response).toBeUndefined();
    expect(data.data).toBe(666);
    // 发起请求时数据被重置为初始数据
    const result = data.execute();
    expect(data.response).toBeUndefined();
    expect(data.data).toBe(666);
    // 等待请求执行完毕
    await result;
    // 请求结束
    expect(data.response).toStrictEqual({ data: 1 });
    expect(data.data).toBe(1);
    // 发起请求时数据被重置为初始数据
    data.execute();
    expect(data.response).toBeUndefined();
    expect(data.data).toBe(666);
  });

  test('支持传入 initialData 选项定义初始数据, 选项支持传入 MaybeRefOrGetter 类型对象', async () => {
    // Ref
    {
      const data = useRequest(async () => {
        await delay(100);
        return {
          data: 1,
        };
      }, {
        initialData: ref(666),
      });

      // 初始数据
      expect(data.response).toBeUndefined();
      expect(data.data).toBe(666);
      // 发起请求时数据被重置为初始数据
      const result = data.execute();
      expect(data.response).toBeUndefined();
      expect(data.data).toBe(666);
      // 等待请求执行完毕
      await result;
      // 请求结束
      expect(data.response).toStrictEqual({ data: 1 });
      expect(data.data).toBe(1);
      // 发起请求时数据被重置为初始数据
      data.execute();
      expect(data.response).toBeUndefined();
      expect(data.data).toBe(666);
    }

    // Getter
    {
      const data = useRequest(async () => {
        await delay(100);
        return {
          data: 1,
        };
      }, {
        initialData: () => 666,
      });

      // 初始数据
      expect(data.response).toBeUndefined();
      expect(data.data).toBe(666);
      // 发起请求时数据被重置为初始数据
      const result = data.execute();
      expect(data.response).toBeUndefined();
      expect(data.data).toBe(666);
      // 等待请求执行完毕
      await result;
      // 请求结束
      expect(data.response).toStrictEqual({ data: 1 });
      expect(data.data).toBe(1);
      // 发起请求时数据被重置为初始数据
      data.execute();
      expect(data.response).toBeUndefined();
      expect(data.data).toBe(666);
    }
  });

  test('支持传入 resetOnExecute 选项, 用于控制是否在发起请求时重置数据, 默认为 true', async () => {
    let throwError: boolean = false;
    let dataIndex = 1292;

    const data = useRequest(async () => {
      await delay(100);
      if (throwError) throw new Error('???');
      return {
        data: ++dataIndex,
      };
    }, {
      resetOnExecute: false,
    });

    // 初始数据
    expect(data.response).toBeUndefined();
    expect(data.data).toBeUndefined();
    expect(data.error).toBeUndefined();

    // 进行请求成功情况的测试

    const result = data.execute();

    expect(data.response).toBeUndefined();
    expect(data.data).toBeUndefined();
    expect(data.error).toBeUndefined();

    await result;

    expect(data.response).toStrictEqual({ data: 1293 });
    expect(data.data).toBe(1293);
    expect(data.error).toBeUndefined();

    data.execute();

    expect(data.response).toStrictEqual({ data: 1293 });
    expect(data.data).toBe(1293);
    expect(data.error).toBeUndefined();

    // 进行请求失败情况的测试

    await delay(100);
    throwError = true;
    const result3 = data.execute();

    expect(data.response).toStrictEqual({ data: 1294 });
    expect(data.data).toBe(1294);
    expect(data.error).toBeUndefined();

    try {
      await result3;
    }
    catch (error: any) {
      expect(error).toStrictEqual(new Error('???'));
    }

    expect(data.response).toStrictEqual({ data: 1294 });
    expect(data.data).toBe(1294);
    expect(data.error).toStrictEqual(new Error('???'));

    data.execute();

    expect(data.response).toStrictEqual({ data: 1294 });
    expect(data.data).toBe(1294);
    expect(data.error).toStrictEqual(new Error('???'));
  });

  test('类型测试', async () => {
    expectTypeOf(useRequest).parameters.toEqualTypeOf<[
      UseRequestUserExecute<unknown, any[]>,
      UseRequestOptions<never>?,
    ]>();

    // 非异步, 无方法传参, 无其他参数返回
    {
      const res = useRequest(() => ({ data: 1 }));

      expectTypeOf(res.response).toEqualTypeOf<{ data: number } | undefined>();
      expectTypeOf(res.data).toEqualTypeOf<number | undefined>();
      expectTypeOf(res.error).toEqualTypeOf<any>();
      expectTypeOf(res.isExecuted).toEqualTypeOf<boolean>();
      expectTypeOf(res.isLoading).toEqualTypeOf<boolean>();
      expectTypeOf(res.isFinished).toEqualTypeOf<boolean>();
      expectTypeOf(res.isSuccess).toEqualTypeOf<boolean>();
      expectTypeOf(res.execute).toEqualTypeOf<() => Promise<{ data: number }>>();
      expectTypeOf(res.onSuccess).toEqualTypeOf<EventHookOn<{ data: number }>>();
      expectTypeOf(res.onError).toEqualTypeOf<EventHookOn<any>>();
      expectTypeOf(res.onFinally).toEqualTypeOf<EventHookOn<null>>();
    }

    // 非异步, 有方法传参, 有其他参数返回
    {
      const res = useRequest((a: number) => ({ data: a, code: 0 }));

      expectTypeOf(res.response).toEqualTypeOf<{ data: number; code: number } | undefined>();
      expectTypeOf(res.data).toEqualTypeOf<number | undefined>();
      expectTypeOf(res.error).toEqualTypeOf<any>();
      expectTypeOf(res.isExecuted).toEqualTypeOf<boolean>();
      expectTypeOf(res.isLoading).toEqualTypeOf<boolean>();
      expectTypeOf(res.isFinished).toEqualTypeOf<boolean>();
      expectTypeOf(res.isSuccess).toEqualTypeOf<boolean>();
      expectTypeOf(res.execute).toEqualTypeOf<(a: number) => Promise<{ data: number; code: number }>>();
      expectTypeOf(res.onSuccess).toEqualTypeOf<EventHookOn<{ data: number; code: number }>>();
      expectTypeOf(res.onError).toEqualTypeOf<EventHookOn<any>>();
      expectTypeOf(res.onFinally).toEqualTypeOf<EventHookOn<null>>();
    }

    // 异步, 无方法传参, 无其他参数返回
    {
      const res = useRequest(async () => {
        delay(100);
        return { data: 1 };
      });

      expectTypeOf(res.response).toEqualTypeOf<{ data: number } | undefined>();
      expectTypeOf(res.data).toEqualTypeOf<number | undefined>();
      expectTypeOf(res.error).toEqualTypeOf<any>();
      expectTypeOf(res.isExecuted).toEqualTypeOf<boolean>();
      expectTypeOf(res.isLoading).toEqualTypeOf<boolean>();
      expectTypeOf(res.isFinished).toEqualTypeOf<boolean>();
      expectTypeOf(res.isSuccess).toEqualTypeOf<boolean>();
      expectTypeOf(res.execute).toEqualTypeOf<() => Promise<{ data: number }>>();
      expectTypeOf(res.onSuccess).toEqualTypeOf<EventHookOn<{ data: number }>>();
      expectTypeOf(res.onError).toEqualTypeOf<EventHookOn<any>>();
      expectTypeOf(res.onFinally).toEqualTypeOf<EventHookOn<null>>();
    }

    // 异步, 有方法传参, 有其他参数返回
    {
      const res = useRequest(async (a: number) => {
        delay(100);
        return { data: a, code: 0 };
      });

      expectTypeOf(res.response).toEqualTypeOf<{ data: number; code: number } | undefined>();
      expectTypeOf(res.data).toEqualTypeOf<number | undefined>();
      expectTypeOf(res.error).toEqualTypeOf<any>();
      expectTypeOf(res.isExecuted).toEqualTypeOf<boolean>();
      expectTypeOf(res.isLoading).toEqualTypeOf<boolean>();
      expectTypeOf(res.isFinished).toEqualTypeOf<boolean>();
      expectTypeOf(res.isSuccess).toEqualTypeOf<boolean>();
      expectTypeOf(res.execute).toEqualTypeOf<(a: number) => Promise<{ data: number; code: number }>>();
      expectTypeOf(res.onSuccess).toEqualTypeOf<EventHookOn<{ data: number; code: number }>>();
      expectTypeOf(res.onError).toEqualTypeOf<EventHookOn<any>>();
      expectTypeOf(res.onFinally).toEqualTypeOf<EventHookOn<null>>();
    }
  });
});
