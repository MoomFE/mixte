import type { EventHookOn } from '@vueuse/core';
import type { UseRequestOptions, UseRequestUserExecute } from '@mixte/use';
import { useRequest, useRequestReactive, watchImmediateDeep } from '@mixte/use';
import { delay } from 'mixte';
import type { ShallowRef } from 'vue-demi';
import { isRef, nextTick, ref } from 'vue-demi';

describe('useRequest', () => {
  test('方法返回对象参数类型判断', async () => {
    let throwError: boolean = false;
    const data = useRequest(async () => {
      await delay(100);
      if (throwError) throw new Error('???');
      return {
        data: {
          a: { b: 2 },
        },
      };
    });

    // 返回属性测试
    expect(Object.keys(data).sort()).toStrictEqual([
      'response', 'data', 'error',
      'isExecuted', 'isLoading', 'isFinished', 'isSuccess',
      'successCount', 'clearSuccessCount',
      'execute',
      'onSuccess', 'onError', 'onFinally',
      'reactive',
    ].sort());

    expect(Object.keys(data.reactive).sort()).toStrictEqual([
      'response', 'data', 'error',
      'isExecuted', 'isLoading', 'isFinished', 'isSuccess',
      'successCount', 'clearSuccessCount',
      'execute',
      'onSuccess', 'onError', 'onFinally',
    ].sort());

    // 类型测试
    ([
      { key: 'response', type: 'undefined' },
      { key: 'data', type: 'undefined' },
      { key: 'error', type: 'undefined' },

      { key: 'isExecuted', type: 'boolean' },
      { key: 'isLoading', type: 'boolean' },
      { key: 'isFinished', type: 'boolean' },
      { key: 'isSuccess', type: 'boolean' },

      { key: 'successCount', type: 'number' },
      { key: 'clearSuccessCount', type: 'function' },

      { key: 'execute', type: 'function' },
      { key: 'onSuccess', type: 'function' },
      { key: 'onError', type: 'function' },
      { key: 'onFinally', type: 'function' },
    ] as const).forEach(({ key, type }) => {
      expect(data.reactive[key]).toBeTypeOf(type);
      expect(
        isRef(data[key])
          ? (data[key] as Ref<any>).value
          : data[key],
      ).toBeTypeOf(type);
    });

    // 方法相等测试 ( 后续就不用分开测了 )
    expect(data.execute).toBe(data.reactive.execute);
    expect(data.onSuccess).toBe(data.reactive.onSuccess);
    expect(data.onError).toBe(data.reactive.onError);
    expect(data.onFinally).toBe(data.reactive.onFinally);
    expect(data.clearSuccessCount).toBe(data.reactive.clearSuccessCount);

    await data.execute();

    // response 相等测试 ( 后续就不用分开测了 )
    expect(data.response.value).toStrictEqual({ data: { a: { b: 2 } } });
    expect(toRaw(data.response.value)).toBe(toRaw(data.reactive.response));

    // data 相等测试 ( 后续就不用分开测了 )
    expect(data.data.value).toStrictEqual({ a: { b: 2 } });
    expect(toRaw(data.data.value)).toBe(toRaw(data.reactive.data));

    throwError = true;
    try {
      await data.execute();
    }
    catch (error) {}

    // error 相等测试 ( 后续就不用分开测了 )
    expect(data.error.value).toStrictEqual(new Error('???'));
    expect(toRaw(data.error.value)).toBe(toRaw(data.reactive.error));
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
      expect(data.isLoading.value).toBe(false);
      expect(data.isFinished.value).toBe(true);
      expect(data.isSuccess.value).toBe(true);
      expect(data.reactive.isLoading).toBe(false);
      expect(data.reactive.isFinished).toBe(true);
      expect(data.reactive.isSuccess).toBe(true);
      successEventCountAndArgs = [++successEventCountAndArgs[0], ...args];
    });
    data.onError((...args: any[]) => {
      expect(data.isLoading.value).toBe(false);
      expect(data.isFinished.value).toBe(true);
      expect(data.isSuccess.value).toBe(false);
      errorEventCountAndArgs = [++errorEventCountAndArgs[0], ...args];
    });
    data.onFinally((...args: any[]) => {
      expect(data.isLoading.value).toBe(false);
      expect(data.isFinished.value).toBe(true);
      expect(data.isSuccess.value).toBe(!data.error.value);
      finallyEventCountAndArgs = [++finallyEventCountAndArgs[0], ...args];
    });

    expect(data.response.value).toBeUndefined();
    expect(data.data.value).toBeUndefined();
    expect(data.error.value).toBeUndefined();
    expect(data.isExecuted.value).toBe(false);
    expect(data.isLoading.value).toBe(false);
    expect(data.isFinished.value).toBe(false);
    expect(data.isSuccess.value).toBe(false);
    expect(data.successCount.value).toBe(0);
    expect(successEventCountAndArgs).toStrictEqual([0]);
    expect(errorEventCountAndArgs).toStrictEqual([0]);
    expect(finallyEventCountAndArgs).toStrictEqual([0]);

    // 进行请求成功情况的测试

    const result = data.execute();

    expect(data.response.value).toBeUndefined();
    expect(data.data.value).toBeUndefined();
    expect(data.error.value).toBeUndefined();
    expect(data.isExecuted.value).toBe(true);
    expect(data.isLoading.value).toBe(true);
    expect(data.isFinished.value).toBe(false);
    expect(data.isSuccess.value).toBe(false);
    expect(data.successCount.value).toBe(0);
    expect(successEventCountAndArgs).toStrictEqual([0]);
    expect(errorEventCountAndArgs).toStrictEqual([0]);
    expect(finallyEventCountAndArgs).toStrictEqual([0]);

    expect(await result).toStrictEqual(data.response.value);

    expect(data.response.value).toStrictEqual({ data: 1293 });
    expect(data.data.value).toBe(1293);
    expect(data.error.value).toBeUndefined();
    expect(data.isExecuted.value).toBe(true);
    expect(data.isLoading.value).toBe(false);
    expect(data.isFinished.value).toBe(true);
    expect(data.isSuccess.value).toBe(true);
    expect(data.successCount.value).toBe(1);
    expect(successEventCountAndArgs).toStrictEqual([1, { data: 1293 }]);
    expect(errorEventCountAndArgs).toStrictEqual([0]);
    expect(finallyEventCountAndArgs).toStrictEqual([1]);

    // 进行请求失败情况的测试

    throwError = true;
    const result2 = data.execute();

    expect(data.response.value).toBeUndefined();
    expect(data.data.value).toBeUndefined();
    expect(data.error.value).toBeUndefined();
    expect(data.isExecuted.value).toBe(true);
    expect(data.isLoading.value).toBe(true);
    expect(data.isFinished.value).toBe(false);
    expect(data.isSuccess.value).toBe(false);
    expect(data.successCount.value).toBe(1);
    expect(successEventCountAndArgs).toStrictEqual([1, { data: 1293 }]);
    expect(errorEventCountAndArgs).toStrictEqual([0]);
    expect(finallyEventCountAndArgs).toStrictEqual([1]);

    try {
      await result2;
    }
    catch (error: any) {
      expect(error).toStrictEqual(new Error('???'));
    }

    expect(data.response.value).toBeUndefined();
    expect(data.data.value).toBeUndefined();
    expect(data.error.value).toStrictEqual(new Error('???'));
    expect(data.isExecuted.value).toBe(true);
    expect(data.isLoading.value).toBe(false);
    expect(data.isFinished.value).toBe(true);
    expect(data.isSuccess.value).toBe(false);
    expect(data.successCount.value).toBe(1);
    expect(successEventCountAndArgs).toStrictEqual([1, { data: 1293 }]);
    expect(errorEventCountAndArgs).toStrictEqual([1, new Error('???')]);
    expect(finallyEventCountAndArgs).toStrictEqual([2]);
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
      expect(data.isLoading.value).toBe(false);
      expect(data.isFinished.value).toBe(true);
      expect(data.isSuccess.value).toBe(true);
      successEventCountAndArgs = [++successEventCountAndArgs[0], ...args];
    });
    data.onError((...args: any[]) => {
      expect(data.isLoading.value).toBe(false);
      expect(data.isFinished.value).toBe(true);
      expect(data.isSuccess.value).toBe(false);
      errorEventCountAndArgs = [++errorEventCountAndArgs[0], ...args];
    });
    data.onFinally((...args: any[]) => {
      expect(data.isLoading.value).toBe(false);
      expect(data.isFinished.value).toBe(true);
      expect(data.isSuccess.value).toBe(!data.error.value);
      finallyEventCountAndArgs = [++finallyEventCountAndArgs[0], ...args];
    });

    expect(data.response.value).toBeUndefined();
    expect(data.data.value).toBeUndefined();
    expect(data.error.value).toBeUndefined();
    expect(data.isExecuted.value).toBe(false);
    expect(data.isLoading.value).toBe(false);
    expect(data.isFinished.value).toBe(false);
    expect(data.isSuccess.value).toBe(false);
    expect(data.successCount.value).toBe(0);
    expect(successEventCountAndArgs).toStrictEqual([0]);
    expect(errorEventCountAndArgs).toStrictEqual([0]);
    expect(finallyEventCountAndArgs).toStrictEqual([0]);

    // 进行请求失败情况的测试

    const result = data.execute();

    expect(data.response.value).toBeUndefined();
    expect(data.data.value).toBeUndefined();
    expect(data.error.value).toBeUndefined();
    expect(data.isExecuted.value).toBe(true);
    expect(data.isLoading.value).toBe(true);
    expect(data.isFinished.value).toBe(false);
    expect(data.isSuccess.value).toBe(false);
    expect(data.successCount.value).toBe(0);
    expect(successEventCountAndArgs).toStrictEqual([0]);
    expect(errorEventCountAndArgs).toStrictEqual([0]);
    expect(finallyEventCountAndArgs).toStrictEqual([0]);

    try {
      await result;
    }
    catch (error: any) {
      expect(error).toStrictEqual(new Error('???'));
    }

    expect(data.response.value).toBeUndefined();
    expect(data.data.value).toBeUndefined();
    expect(data.error.value).toStrictEqual(new Error('???'));
    expect(data.isExecuted.value).toBe(true);
    expect(data.isLoading.value).toBe(false);
    expect(data.isFinished.value).toBe(true);
    expect(data.isSuccess.value).toBe(false);
    expect(data.successCount.value).toBe(0);
    expect(successEventCountAndArgs).toStrictEqual([0]);
    expect(errorEventCountAndArgs).toStrictEqual([1, new Error('???')]);
    expect(finallyEventCountAndArgs).toStrictEqual([1]);

    // 进行请求成功情况的测试

    throwError = false;
    const result2 = data.execute();

    expect(data.response.value).toBeUndefined();
    expect(data.data.value).toBeUndefined();
    expect(data.error.value).toBeUndefined();
    expect(data.isExecuted.value).toBe(true);
    expect(data.isLoading.value).toBe(true);
    expect(data.isFinished.value).toBe(false);
    expect(data.isSuccess.value).toBe(false);
    expect(data.successCount.value).toBe(0);
    expect(successEventCountAndArgs).toStrictEqual([0]);
    expect(errorEventCountAndArgs).toStrictEqual([1, new Error('???')]);
    expect(finallyEventCountAndArgs).toStrictEqual([1]);

    expect(await result2).toStrictEqual(data.response.value);

    expect(data.response.value).toStrictEqual({ data: 1293 });
    expect(data.data.value).toBe(1293);
    expect(data.error.value).toBeUndefined();
    expect(data.isExecuted.value).toBe(true);
    expect(data.isLoading.value).toBe(false);
    expect(data.isFinished.value).toBe(true);
    expect(data.isSuccess.value).toBe(true);
    expect(data.successCount.value).toBe(1);
    expect(successEventCountAndArgs).toStrictEqual([1, { data: 1293 }]);
    expect(errorEventCountAndArgs).toStrictEqual([1, new Error('???')]);
    expect(finallyEventCountAndArgs).toStrictEqual([2]);
  });

  test('请求完成后修改传参', async () => {
    const data = useRequest(async () => ({
      data: {
        a: { b: 2 },
      },
    }));

    data.onSuccess(() => {
      data.data.value!.a.b++;
    });

    await data.execute();

    expect(data.data.value).toStrictEqual({ a: { b: 3 } });
  });

  test('同时发起多个请求, 仅最后一次请求生效', async () => {
    let throwError: boolean = false;
    let successIndex = 0;
    let finallyIndex = 0;
    let errorIndex = 0;

    const data = useRequest(async () => {
      if (throwError) throw new Error('???');
      return 123;
    });

    data.onSuccess(() => {
      successIndex++;
    });
    data.onFinally(() => {
      finallyIndex++;
    });
    data.onError(() => {
      errorIndex++;
    });

    await Promise.all([data.execute(), data.execute(), data.execute()]);

    expect(successIndex).toBe(1);
    expect(finallyIndex).toBe(1);
    expect(errorIndex).toBe(0);
    expect(data.successCount.value).toBe(1);

    throwError = true;

    await Promise.allSettled([data.execute(), data.execute(), data.execute()]);

    expect(successIndex).toBe(1);
    expect(finallyIndex).toBe(2);
    expect(errorIndex).toBe(1);
    expect(data.successCount.value).toBe(1);
  });

  test('请求成功后, 请求成功次数会进行累计, 可以使用方法清除请求成功次数', async () => {
    let throwError: boolean = false;

    const data = useRequest(async () => {
      if (throwError) throw new Error('???');
      return 123;
    });

    expect(data.successCount.value).toBe(0);

    await data.execute();

    expect(data.successCount.value).toBe(1);

    await data.execute();

    expect(data.successCount.value).toBe(2);

    throwError = true;
    try {
      await data.execute();
    }
    catch (error) {
      expect(error).toStrictEqual(new Error('???'));
    }

    expect(data.successCount.value).toBe(2);

    try {
      await data.execute();
    }
    catch (error) {
      expect(error).toStrictEqual(new Error('???'));
    }

    expect(data.successCount.value).toBe(2);

    throwError = false;
    await data.execute();

    expect(data.successCount.value).toBe(3);

    data.clearSuccessCount();
    expect(data.successCount.value).toBe(0);

    await data.execute();

    expect(data.successCount.value).toBe(1);
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

    expect(data.response.value).toBeUndefined();
    expect(data.data.value).toBeUndefined();
    expect(data.error.value).toBeUndefined();
    expect(data.isExecuted.value).toBe(true);
    expect(data.isLoading.value).toBe(true);
    expect(data.isFinished.value).toBe(false);
    expect(data.isSuccess.value).toBe(false);
    expect(data.successCount.value).toBe(0);

    await delay(100);

    expect(data.response.value).toStrictEqual({ data: 1 });
    expect(data.data.value).toBe(1);
    expect(data.error.value).toBeUndefined();
    expect(data.isExecuted.value).toBe(true);
    expect(data.isLoading.value).toBe(false);
    expect(data.isFinished.value).toBe(true);
    expect(data.isSuccess.value).toBe(true);
    expect(data.successCount.value).toBe(1);
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
    expect(data.response.value).toBeUndefined();
    expect(data.data.value).toBe(666);
    // 发起请求时数据被重置为初始数据
    const result = data.execute();
    expect(data.response.value).toBeUndefined();
    expect(data.data.value).toBe(666);
    // 等待请求执行完毕
    await result;
    // 请求结束
    expect(data.response.value).toStrictEqual({ data: 1 });
    expect(data.data.value).toBe(1);
    // 发起请求时数据被重置为初始数据
    data.execute();
    expect(data.response.value).toBeUndefined();
    expect(data.data.value).toBe(666);
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
      expect(data.response.value).toBeUndefined();
      expect(data.data.value).toBe(666);
      // 发起请求时数据被重置为初始数据
      const result = data.execute();
      expect(data.response.value).toBeUndefined();
      expect(data.data.value).toBe(666);
      // 等待请求执行完毕
      await result;
      // 请求结束
      expect(data.response.value).toStrictEqual({ data: 1 });
      expect(data.data.value).toBe(1);
      // 发起请求时数据被重置为初始数据
      data.execute();
      expect(data.response.value).toBeUndefined();
      expect(data.data.value).toBe(666);
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
      expect(data.response.value).toBeUndefined();
      expect(data.data.value).toBe(666);
      // 发起请求时数据被重置为初始数据
      const result = data.execute();
      expect(data.response.value).toBeUndefined();
      expect(data.data.value).toBe(666);
      // 等待请求执行完毕
      await result;
      // 请求结束
      expect(data.response.value).toStrictEqual({ data: 1 });
      expect(data.data.value).toBe(1);
      // 发起请求时数据被重置为初始数据
      data.execute();
      expect(data.response.value).toBeUndefined();
      expect(data.data.value).toBe(666);
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
    expect(data.response.value).toBeUndefined();
    expect(data.data.value).toBeUndefined();
    expect(data.error.value).toBeUndefined();

    // 进行请求成功情况的测试

    const result = data.execute();

    expect(data.response.value).toBeUndefined();
    expect(data.data.value).toBeUndefined();
    expect(data.error.value).toBeUndefined();

    await result;

    expect(data.response.value).toStrictEqual({ data: 1293 });
    expect(data.data.value).toBe(1293);
    expect(data.error.value).toBeUndefined();

    data.execute();

    expect(data.response.value).toStrictEqual({ data: 1293 });
    expect(data.data.value).toBe(1293);
    expect(data.error.value).toBeUndefined();

    // 进行请求失败情况的测试

    await delay(100);
    throwError = true;
    const result3 = data.execute();

    expect(data.response.value).toStrictEqual({ data: 1294 });
    expect(data.data.value).toBe(1294);
    expect(data.error.value).toBeUndefined();

    try {
      await result3;
    }
    catch (error: any) {
      expect(error).toStrictEqual(new Error('???'));
    }

    expect(data.response.value).toStrictEqual({ data: 1294 });
    expect(data.data.value).toBe(1294);
    expect(data.error.value).toStrictEqual(new Error('???'));

    const result4 = data.execute();

    expect(data.response.value).toStrictEqual({ data: 1294 });
    expect(data.data.value).toBe(1294);
    expect(data.error.value).toStrictEqual(new Error('???'));

    try {
      await result4;
    }
    catch (error: any) {
      expect(error).toStrictEqual(new Error('???'));
    }
  });

  test('支持传入 resetOnExecute 选项, 选项支持传入 MaybeRefOrGetter 类型对象', async () => {
    // Ref
    {
      let throwError: boolean = false;
      let dataIndex = 1292;

      const data = useRequest(async () => {
        await delay(100);
        if (throwError) throw new Error('???');
        return {
          data: ++dataIndex,
        };
      }, {
        resetOnExecute: ref(false),
      });

      // 初始数据
      expect(data.response.value).toBeUndefined();
      expect(data.data.value).toBeUndefined();
      expect(data.error.value).toBeUndefined();

      // 进行请求成功情况的测试

      const result = data.execute();

      expect(data.response.value).toBeUndefined();
      expect(data.data.value).toBeUndefined();
      expect(data.error.value).toBeUndefined();

      await result;

      expect(data.response.value).toStrictEqual({ data: 1293 });
      expect(data.data.value).toBe(1293);
      expect(data.error.value).toBeUndefined();

      data.execute();

      expect(data.response.value).toStrictEqual({ data: 1293 });
      expect(data.data.value).toBe(1293);
      expect(data.error.value).toBeUndefined();

      // 进行请求失败情况的测试

      await delay(100);
      throwError = true;
      const result3 = data.execute();

      expect(data.response.value).toStrictEqual({ data: 1294 });
      expect(data.data.value).toBe(1294);
      expect(data.error.value).toBeUndefined();

      try {
        await result3;
      }
      catch (error: any) {
        expect(error).toStrictEqual(new Error('???'));
      }

      expect(data.response.value).toStrictEqual({ data: 1294 });
      expect(data.data.value).toBe(1294);
      expect(data.error.value).toStrictEqual(new Error('???'));

      const result4 = data.execute();

      expect(data.response.value).toStrictEqual({ data: 1294 });
      expect(data.data.value).toBe(1294);
      expect(data.error.value).toStrictEqual(new Error('???'));

      try {
        await result4;
      }
      catch (error: any) {
        expect(error).toStrictEqual(new Error('???'));
      }
    }

    // Getter
    {
      let throwError: boolean = false;
      let dataIndex = 1292;

      const data = useRequest(async () => {
        await delay(100);
        if (throwError) throw new Error('???');
        return {
          data: ++dataIndex,
        };
      }, {
        resetOnExecute: () => false,
      });

      // 初始数据
      expect(data.response.value).toBeUndefined();
      expect(data.data.value).toBeUndefined();
      expect(data.error.value).toBeUndefined();

      // 进行请求成功情况的测试

      const result = data.execute();

      expect(data.response.value).toBeUndefined();
      expect(data.data.value).toBeUndefined();
      expect(data.error.value).toBeUndefined();

      await result;

      expect(data.response.value).toStrictEqual({ data: 1293 });
      expect(data.data.value).toBe(1293);
      expect(data.error.value).toBeUndefined();

      data.execute();

      expect(data.response.value).toStrictEqual({ data: 1293 });
      expect(data.data.value).toBe(1293);
      expect(data.error.value).toBeUndefined();

      // 进行请求失败情况的测试

      await delay(100);
      throwError = true;
      const result3 = data.execute();

      expect(data.response.value).toStrictEqual({ data: 1294 });
      expect(data.data.value).toBe(1294);
      expect(data.error.value).toBeUndefined();

      try {
        await result3;
      }
      catch (error: any) {
        expect(error).toStrictEqual(new Error('???'));
      }

      expect(data.response.value).toStrictEqual({ data: 1294 });
      expect(data.data.value).toBe(1294);
      expect(data.error.value).toStrictEqual(new Error('???'));

      const result4 = data.execute();

      expect(data.response.value).toStrictEqual({ data: 1294 });
      expect(data.data.value).toBe(1294);
      expect(data.error.value).toStrictEqual(new Error('???'));

      try {
        await result4;
      }
      catch (error: any) {
        expect(error).toStrictEqual(new Error('???'));
      }
    }
  });

  test('支持传入 shallow: true 选项, 用于控制是否使用 shallowRef 代替 ref 包裹 data 数据', async () => {
    const data = useRequest(() => ({ data: { a: { b: 2 } } }), { immediate: true });
    const data2 = useRequest(() => ({ data: { a: { b: 2 } } }), { immediate: true, shallow: true });

    await delay(10);

    expect(data.data.value).toStrictEqual({ a: { b: 2 } });
    expect(data2.data.value).toStrictEqual({ a: { b: 2 } });

    const dataTriggerCount = [0, 0];
    const data2TriggerCount = [0, 0];

    watchImmediateDeep(data.data, () => dataTriggerCount[0]++);
    watchImmediateDeep(() => data.reactive.data, () => dataTriggerCount[1]++);
    watchImmediateDeep(data2.data, () => data2TriggerCount[0]++);
    watchImmediateDeep(() => data2.reactive.data, () => data2TriggerCount[1]++);

    expect(dataTriggerCount).toStrictEqual([1, 1]);
    expect(data2TriggerCount).toStrictEqual([1, 1]);

    data.data.value!.a.b++;
    data2.data.value!.a.b++;

    await nextTick();

    expect(dataTriggerCount).toStrictEqual([2, 2]);
    expect(data2TriggerCount).toStrictEqual([1, 1]);
  });

  test('类型测试', async () => {
    expectTypeOf(useRequest).parameters.toEqualTypeOf<[
      UseRequestUserExecute<unknown, any[]>,
      UseRequestOptions?,
    ]>();

    // 非异步, 无方法传参, 无其他参数返回
    {
      const res = useRequest(() => ({ data: 1 }));

      expectTypeOf(res.response).toEqualTypeOf<ShallowRef<{ data: number } | undefined>>();
      expectTypeOf(res.data).toEqualTypeOf<Ref<number | undefined>>();
      expectTypeOf(res.error).toEqualTypeOf<ShallowRef<any>>();
      expectTypeOf(res.isExecuted).toEqualTypeOf<Ref<boolean>>();
      expectTypeOf(res.isLoading).toEqualTypeOf<Ref<boolean>>();
      expectTypeOf(res.isFinished).toEqualTypeOf<Ref<boolean>>();
      expectTypeOf(res.isSuccess).toEqualTypeOf<Ref<boolean>>();
      expectTypeOf(res.execute).toEqualTypeOf<() => Promise<{ data: number }>>();
      expectTypeOf(res.onSuccess).toEqualTypeOf<EventHookOn<{ data: number }>>();
      expectTypeOf(res.onError).toEqualTypeOf<EventHookOn<any>>();
      expectTypeOf(res.onFinally).toEqualTypeOf<EventHookOn>();
      expectTypeOf(res.reactive).toEqualTypeOf<{
        response: { data: number } | undefined
        data: number | undefined
        error: any
        isExecuted: boolean
        isLoading: boolean
        isFinished: boolean
        isSuccess: boolean
        successCount: number
        clearSuccessCount: () => void
        execute: () => Promise<{ data: number }>
        onSuccess: EventHookOn<{ data: number }>
        onError: EventHookOn<any>
        onFinally: EventHookOn
      }>();
    }

    // 非异步, 有方法传参, 有其他参数返回
    {
      const res = useRequest((a: number) => ({ data: a, code: 0 }));

      expectTypeOf(res.response).toEqualTypeOf<ShallowRef<{ data: number; code: number } | undefined>>();
      expectTypeOf(res.data).toEqualTypeOf<Ref<number | undefined>>();
      expectTypeOf(res.error).toEqualTypeOf<ShallowRef<any>>();
      expectTypeOf(res.isExecuted).toEqualTypeOf<Ref<boolean>>();
      expectTypeOf(res.isLoading).toEqualTypeOf<Ref<boolean>>();
      expectTypeOf(res.isFinished).toEqualTypeOf<Ref<boolean>>();
      expectTypeOf(res.isSuccess).toEqualTypeOf<Ref<boolean>>();
      expectTypeOf(res.execute).toEqualTypeOf<(a: number) => Promise<{ data: number; code: number }>>();
      expectTypeOf(res.onSuccess).toEqualTypeOf<EventHookOn<{ data: number; code: number }>>();
      expectTypeOf(res.onError).toEqualTypeOf<EventHookOn<any>>();
      expectTypeOf(res.onFinally).toEqualTypeOf<EventHookOn>();
      expectTypeOf(res.reactive).toEqualTypeOf<{
        response: { data: number; code: number } | undefined
        data: number | undefined
        error: any
        isExecuted: boolean
        isLoading: boolean
        isFinished: boolean
        isSuccess: boolean
        successCount: number
        clearSuccessCount: () => void
        execute: (a: number) => Promise<{ data: number; code: number }>
        onSuccess: EventHookOn<{ data: number; code: number }>
        onError: EventHookOn<any>
        onFinally: EventHookOn
      }>();
    }

    // 异步, 无方法传参, 无其他参数返回
    {
      const res = useRequest(async () => {
        delay(100);
        return { data: 1 };
      });

      expectTypeOf(res.response).toEqualTypeOf<ShallowRef<{ data: number } | undefined>>();
      expectTypeOf(res.data).toEqualTypeOf<Ref<number | undefined>>();
      expectTypeOf(res.error).toEqualTypeOf<ShallowRef<any>>();
      expectTypeOf(res.isExecuted).toEqualTypeOf<Ref<boolean>>();
      expectTypeOf(res.isLoading).toEqualTypeOf<Ref<boolean>>();
      expectTypeOf(res.isFinished).toEqualTypeOf<Ref<boolean>>();
      expectTypeOf(res.isSuccess).toEqualTypeOf<Ref<boolean>>();
      expectTypeOf(res.execute).toEqualTypeOf<() => Promise<{ data: number }>>();
      expectTypeOf(res.onSuccess).toEqualTypeOf<EventHookOn<{ data: number }>>();
      expectTypeOf(res.onError).toEqualTypeOf<EventHookOn<any>>();
      expectTypeOf(res.onFinally).toEqualTypeOf<EventHookOn>();
      expectTypeOf(res.reactive).toEqualTypeOf<{
        response: { data: number } | undefined
        data: number | undefined
        error: any
        isExecuted: boolean
        isLoading: boolean
        isFinished: boolean
        isSuccess: boolean
        successCount: number
        clearSuccessCount: () => void
        execute: () => Promise<{ data: number }>
        onSuccess: EventHookOn<{ data: number }>
        onError: EventHookOn<any>
        onFinally: EventHookOn
      }>();
    }

    // 异步, 有方法传参, 有其他参数返回
    {
      const res = useRequest(async (a: number) => {
        delay(100);
        return { data: a, code: 0 };
      });

      expectTypeOf(res.response).toEqualTypeOf<ShallowRef<{ data: number; code: number } | undefined>>();
      expectTypeOf(res.data).toEqualTypeOf<Ref<number | undefined>>();
      expectTypeOf(res.error).toEqualTypeOf<ShallowRef<any>>();
      expectTypeOf(res.isExecuted).toEqualTypeOf<Ref<boolean>>();
      expectTypeOf(res.isLoading).toEqualTypeOf<Ref<boolean>>();
      expectTypeOf(res.isFinished).toEqualTypeOf<Ref<boolean>>();
      expectTypeOf(res.isSuccess).toEqualTypeOf<Ref<boolean>>();
      expectTypeOf(res.execute).toEqualTypeOf<(a: number) => Promise<{ data: number; code: number }>>();
      expectTypeOf(res.onSuccess).toEqualTypeOf<EventHookOn<{ data: number; code: number }>>();
      expectTypeOf(res.onError).toEqualTypeOf<EventHookOn<any>>();
      expectTypeOf(res.onFinally).toEqualTypeOf<EventHookOn>();
      expectTypeOf(res.reactive).toEqualTypeOf<{
        response: { data: number; code: number } | undefined
        data: number | undefined
        error: any
        isExecuted: boolean
        isLoading: boolean
        isFinished: boolean
        isSuccess: boolean
        successCount: number
        clearSuccessCount: () => void
        execute: (a: number) => Promise<{ data: number; code: number }>
        onSuccess: EventHookOn<{ data: number; code: number }>
        onError: EventHookOn<any>
        onFinally: EventHookOn
      }>();
    }
  });
});

describe('useRequestReactive', () => {
  test('方法返回对象参数类型判断', async () => {
    let throwError: boolean = false;
    const data = useRequestReactive(async () => {
      await delay(100);
      if (throwError) throw new Error('???');
      return {
        data: {
          a: { b: 2 },
        },
      };
    });

    // 返回属性测试
    expect(Object.keys(data).sort()).toStrictEqual([
      'response', 'data', 'error',
      'isExecuted', 'isLoading', 'isFinished', 'isSuccess',
      'successCount', 'clearSuccessCount',
      'execute',
      'onSuccess', 'onError', 'onFinally',
    ].sort());

    // 类型测试
    ([
      { key: 'response', type: 'undefined' },
      { key: 'data', type: 'undefined' },
      { key: 'error', type: 'undefined' },

      { key: 'isExecuted', type: 'boolean' },
      { key: 'isLoading', type: 'boolean' },
      { key: 'isFinished', type: 'boolean' },
      { key: 'isSuccess', type: 'boolean' },

      { key: 'successCount', type: 'number' },
      { key: 'clearSuccessCount', type: 'function' },

      { key: 'execute', type: 'function' },
      { key: 'onSuccess', type: 'function' },
      { key: 'onError', type: 'function' },
      { key: 'onFinally', type: 'function' },
    ] as const).forEach(({ key, type }) => {
      expect(data[key]).toBeTypeOf(type);
    });

    await data.execute();

    expect(data.response).toStrictEqual({ data: { a: { b: 2 } } });
    expect(data.data).toStrictEqual({ a: { b: 2 } });

    throwError = true;
    try {
      await data.execute();
    }
    catch (error) {}

    expect(data.error).toStrictEqual(new Error('???'));
  });

  test('类型测试', async () => {
    expectTypeOf(useRequestReactive).parameters.toEqualTypeOf<[
      UseRequestUserExecute<unknown, any[]>,
      UseRequestOptions?,
    ]>();

    // 非异步, 无方法传参, 无其他参数返回
    {
      const res = useRequestReactive(() => ({ data: 1 }));

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
      expectTypeOf(res.onFinally).toEqualTypeOf<EventHookOn>();
    }

    // 非异步, 有方法传参, 有其他参数返回
    {
      const res = useRequestReactive((a: number) => ({ data: a, code: 0 }));

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
      expectTypeOf(res.onFinally).toEqualTypeOf<EventHookOn>();
    }

    // 异步, 无方法传参, 无其他参数返回
    {
      const res = useRequestReactive(async () => {
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
      expectTypeOf(res.onFinally).toEqualTypeOf<EventHookOn>();
    }

    // 异步, 有方法传参, 有其他参数返回
    {
      const res = useRequestReactive(async (a: number) => {
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
      expectTypeOf(res.onFinally).toEqualTypeOf<EventHookOn>();
    }
  });
});
