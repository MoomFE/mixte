import type { UseRequestOptions, UseRequestUserExecute } from '@mixte/use';
import type { EventHookOn } from '@vueuse/core';
import type { ShallowRef } from 'vue';
import { useRequest, useRequestReactive, watchImmediateDeep } from '@mixte/use';
import { delay } from 'mixte';
import { isRef, isShallow, nextTick, ref } from 'vue';

describe.concurrent('useRequest', () => {
  it('方法返回对象参数类型判断', async ({ expect }) => {
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
      'response',
      'data',
      'error',
      'isExecuted',
      'isLoading',
      'isFinished',
      'isSuccess',
      'execute',
      'reset',
      'onSuccess',
      'onError',
      'onFinally',
      'reactive',
    ].sort());

    expect(Object.keys(data.reactive).sort()).toStrictEqual([
      'response',
      'data',
      'error',
      'isExecuted',
      'isLoading',
      'isFinished',
      'isSuccess',
      'execute',
      'reset',
      'onSuccess',
      'onError',
      'onFinally',
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

      { key: 'execute', type: 'function' },
      { key: 'reset', type: 'function' },

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
    expect(data.reset).toBe(data.reactive.reset);
    expect(data.onSuccess).toBe(data.reactive.onSuccess);
    expect(data.onError).toBe(data.reactive.onError);
    expect(data.onFinally).toBe(data.reactive.onFinally);

    await data.execute();

    // response 相等测试 ( 后续就不用分开测了 )
    expect(data.response.value).toStrictEqual({ data: { a: { b: 2 } } });
    expect(toRaw(data.response.value)).toBe(toRaw(data.reactive.response));

    // data 相等测试 ( 后续就不用分开测了 )
    expect(data.data.value).toStrictEqual({ a: { b: 2 } });
    expect(toRaw(data.data.value)).toBe(toRaw(data.reactive.data));

    throwError = true;
    await expect(() => data.execute()).rejects.toThrow('???');

    // error 相等测试 ( 后续就不用分开测了 )
    expect(data.error.value).toStrictEqual(new Error('???'));
    expect(toRaw(data.error.value)).toBe(toRaw(data.reactive.error));
  });

  it('请求成功情况的返回对象参数', async ({ expect }) => {
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
    expect(successEventCountAndArgs).toStrictEqual([1, { data: 1293 }]);
    expect(errorEventCountAndArgs).toStrictEqual([0]);
    expect(finallyEventCountAndArgs).toStrictEqual([1]);

    await expect(() => result2).rejects.toThrow('???');

    expect(data.response.value).toBeUndefined();
    expect(data.data.value).toBeUndefined();
    expect(data.error.value).toStrictEqual(new Error('???'));
    expect(data.isExecuted.value).toBe(true);
    expect(data.isLoading.value).toBe(false);
    expect(data.isFinished.value).toBe(true);
    expect(data.isSuccess.value).toBe(false);
    expect(successEventCountAndArgs).toStrictEqual([1, { data: 1293 }]);
    expect(errorEventCountAndArgs).toStrictEqual([1, new Error('???')]);
    expect(finallyEventCountAndArgs).toStrictEqual([2]);
  });

  it('请求失败情况的返回对象参数', async ({ expect }) => {
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
    expect(successEventCountAndArgs).toStrictEqual([0]);
    expect(errorEventCountAndArgs).toStrictEqual([0]);
    expect(finallyEventCountAndArgs).toStrictEqual([0]);

    await expect(() => result).rejects.toThrow('???');

    expect(data.response.value).toBeUndefined();
    expect(data.data.value).toBeUndefined();
    expect(data.error.value).toStrictEqual(new Error('???'));
    expect(data.isExecuted.value).toBe(true);
    expect(data.isLoading.value).toBe(false);
    expect(data.isFinished.value).toBe(true);
    expect(data.isSuccess.value).toBe(false);
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
    expect(successEventCountAndArgs).toStrictEqual([1, { data: 1293 }]);
    expect(errorEventCountAndArgs).toStrictEqual([1, new Error('???')]);
    expect(finallyEventCountAndArgs).toStrictEqual([2]);
  });

  it('请求完成后修改传参', async ({ expect }) => {
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

  it('同时发起多个请求, 仅最后一次请求生效', async ({ expect }) => {
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

    throwError = true;

    await Promise.allSettled([data.execute(), data.execute(), data.execute()]);

    expect(successIndex).toBe(1);
    expect(finallyIndex).toBe(2);
    expect(errorIndex).toBe(1);
  });

  describe('辅助方法', () => {
    describe('reset: 重置请求到初始状态', () => {
      it('请求成功后重置', async () => {
        const data = useRequest(async () => {
          await delay(100);
          return {
            data: {
              a: { b: 2 },
            },
          };
        });

        expect(data.response.value).toBeUndefined();
        expect(data.data.value).toBeUndefined();
        expect(data.error.value).toBeUndefined();
        expect(data.isExecuted.value).toBe(false);
        expect(data.isLoading.value).toBe(false);
        expect(data.isFinished.value).toBe(false);
        expect(data.isSuccess.value).toBe(false);

        await data.execute();

        expect(data.response.value).toStrictEqual({ data: { a: { b: 2 } } });
        expect(data.data.value).toStrictEqual({ a: { b: 2 } });
        expect(data.error.value).toBeUndefined();
        expect(data.isExecuted.value).toBe(true);
        expect(data.isLoading.value).toBe(false);
        expect(data.isFinished.value).toBe(true);
        expect(data.isSuccess.value).toBe(true);

        data.reset();

        expect(data.response.value).toBeUndefined();
        expect(data.data.value).toBeUndefined();
        expect(data.error.value).toBeUndefined();
        expect(data.isExecuted.value).toBe(false);
        expect(data.isLoading.value).toBe(false);
        expect(data.isFinished.value).toBe(false);
        expect(data.isSuccess.value).toBe(false);
      });

      it('请求错误后重置', async () => {
        const data = useRequest(async () => {
          await delay(100);
          throw new Error('???');
        });

        expect(data.response.value).toBeUndefined();
        expect(data.data.value).toBeUndefined();
        expect(data.error.value).toBeUndefined();
        expect(data.isExecuted.value).toBe(false);
        expect(data.isLoading.value).toBe(false);
        expect(data.isFinished.value).toBe(false);
        expect(data.isSuccess.value).toBe(false);

        await expect(() => data.execute()).rejects.toThrow('???');

        expect(data.response.value).toBeUndefined();
        expect(data.data.value).toBeUndefined();
        expect(data.error.value).toStrictEqual(new Error('???'));
        expect(data.isExecuted.value).toBe(true);
        expect(data.isLoading.value).toBe(false);
        expect(data.isFinished.value).toBe(true);
        expect(data.isSuccess.value).toBe(false);

        data.reset();

        expect(data.response.value).toBeUndefined();
        expect(data.data.value).toBeUndefined();
        expect(data.error.value).toBeUndefined();
        expect(data.isExecuted.value).toBe(false);
        expect(data.isLoading.value).toBe(false);
        expect(data.isFinished.value).toBe(false);
        expect(data.isSuccess.value).toBe(false);
      });

      it('请求中重置', async () => {
        const data = useRequest(async () => {
          await delay(100);
          return {
            data: {
              a: { b: 2 },
            },
          };
        });

        expect(data.response.value).toBeUndefined();
        expect(data.data.value).toBeUndefined();
        expect(data.error.value).toBeUndefined();
        expect(data.isExecuted.value).toBe(false);
        expect(data.isLoading.value).toBe(false);
        expect(data.isFinished.value).toBe(false);
        expect(data.isSuccess.value).toBe(false);

        const result = data.execute();

        expect(data.response.value).toBeUndefined();
        expect(data.data.value).toBeUndefined();
        expect(data.error.value).toBeUndefined();
        expect(data.isExecuted.value).toBe(true);
        expect(data.isLoading.value).toBe(true);
        expect(data.isFinished.value).toBe(false);
        expect(data.isSuccess.value).toBe(false);

        let isSuccess = false;

        data.onSuccess(() => {
          isSuccess = true;
        });

        data.reset();

        await result;

        expect(isSuccess).toBe(false);
      });
    });
  });

  describe('配置项', () => {
    describe('immediate: 是否立即发起请求', () => {
      it('传入 true 立即发起请求', async ({ expect }) => {
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

        await delay(100);

        expect(data.response.value).toStrictEqual({ data: 1 });
        expect(data.data.value).toBe(1);
        expect(data.error.value).toBeUndefined();
        expect(data.isExecuted.value).toBe(true);
        expect(data.isLoading.value).toBe(false);
        expect(data.isFinished.value).toBe(true);
        expect(data.isSuccess.value).toBe(true);
      });
    });

    describe('initialData: 初始数据', () => {
      it('发起请求时会重置 data 为传入的 initialData', async ({ expect }) => {
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
        let result = data.execute();
        expect(data.response.value).toBeUndefined();
        expect(data.data.value).toBe(666);
        // 等待请求执行完毕
        await result;
        // 请求结束
        expect(data.response.value).toStrictEqual({ data: 1 });
        expect(data.data.value).toBe(1);
        // 发起请求时数据被重置为初始数据
        result = data.execute();
        expect(data.response.value).toBeUndefined();
        expect(data.data.value).toBe(666);
        // 等待请求执行完毕
        await result;
      });

      it('选项支持传入 MaybeRefOrGetter 类型对象', async ({ expect }) => {
        // Ref
        {
          const initialData = ref(666);
          const data = useRequest(async () => {
            await delay(100);
            return {
              data: 1,
            };
          }, {
            initialData,
          });

          // 初始数据
          expect(data.response.value).toBeUndefined();
          expect(data.data.value).toBe(666);

          // 基础测试
          {
            // 发起请求时数据被重置为初始数据
            let result = data.execute();
            expect(data.response.value).toBeUndefined();
            expect(data.data.value).toBe(666);
            // 等待请求执行完毕
            await result;
            // 请求结束
            expect(data.response.value).toStrictEqual({ data: 1 });
            expect(data.data.value).toBe(1);
            // 发起请求时数据被重置为初始数据
            result = data.execute();
            expect(data.response.value).toBeUndefined();
            expect(data.data.value).toBe(666);
            // 等待请求执行完毕
            await result;
          }

          // 修改 initialData 的值, 再走一遍流程
          {
            initialData.value = 888;

            // 发起请求时数据被重置为初始数据
            let result = data.execute();
            expect(data.response.value).toBeUndefined();
            expect(data.data.value).toBe(888);
            // 等待请求执行完毕
            await result;
            // 请求结束
            expect(data.response.value).toStrictEqual({ data: 1 });
            expect(data.data.value).toBe(1);
            // 发起请求时数据被重置为初始数据
            result = data.execute();
            expect(data.response.value).toBeUndefined();
            expect(data.data.value).toBe(888);
            // 等待请求执行完毕
            await result;
          }
        }

        // Getter
        {
          let value = 666;
          const data = useRequest(async () => {
            await delay(100);
            return {
              data: 1,
            };
          }, {
            initialData: () => value,
          });

          // 初始数据
          expect(data.response.value).toBeUndefined();
          expect(data.data.value).toBe(666);

          // 基础测试
          {
            // 发起请求时数据被重置为初始数据
            let result = data.execute();
            expect(data.response.value).toBeUndefined();
            expect(data.data.value).toBe(666);
            // 等待请求执行完毕
            await result;
            // 请求结束
            expect(data.response.value).toStrictEqual({ data: 1 });
            expect(data.data.value).toBe(1);
            // 发起请求时数据被重置为初始数据
            result = data.execute();
            expect(data.response.value).toBeUndefined();
            expect(data.data.value).toBe(666);
            // 等待请求执行完毕
            await result;
          }

          // 修改 value 的值, 再走一遍流程
          {
            value = 888;

            // 发起请求时数据被重置为初始数据
            let result = data.execute();
            expect(data.response.value).toBeUndefined();
            expect(data.data.value).toBe(888);
            // 等待请求执行完毕
            await result;
            // 请求结束
            expect(data.response.value).toStrictEqual({ data: 1 });
            expect(data.data.value).toBe(1);
            // 发起请求时数据被重置为初始数据
            result = data.execute();
            expect(data.response.value).toBeUndefined();
            expect(data.data.value).toBe(888);
            // 等待请求执行完毕
            await result;
          }
        }
      });
    });

    describe('resetOnExecute: 是否在发起请求时重置数据', () => {
      it('选项默认为 true', async ({ expect }) => {
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

        let result = data.execute();

        expect(data.response.value).toBeUndefined();
        expect(data.data.value).toBeUndefined();
        expect(data.error.value).toBeUndefined();

        await result;

        expect(data.response.value).toStrictEqual({ data: 1293 });
        expect(data.data.value).toBe(1293);
        expect(data.error.value).toBeUndefined();

        result = data.execute();

        expect(data.response.value).toStrictEqual({ data: 1293 });
        expect(data.data.value).toBe(1293);
        expect(data.error.value).toBeUndefined();

        await result;

        expect(data.response.value).toStrictEqual({ data: 1294 });
        expect(data.data.value).toBe(1294);
        expect(data.error.value).toBeUndefined();

        // 进行请求失败情况的测试

        await delay(100);
        throwError = true;
        result = data.execute();

        expect(data.response.value).toStrictEqual({ data: 1294 });
        expect(data.data.value).toBe(1294);
        expect(data.error.value).toBeUndefined();

        await expect(() => result).rejects.toThrow('???');

        expect(data.response.value).toBeUndefined();
        expect(data.data.value).toBeUndefined();
        expect(data.error.value).toStrictEqual(new Error('???'));

        result = data.execute();

        expect(data.response.value).toBeUndefined();
        expect(data.data.value).toBeUndefined();
        expect(data.error.value).toStrictEqual(new Error('???'));

        await expect(() => result).rejects.toThrow('???');

        expect(data.response.value).toBeUndefined();
        expect(data.data.value).toBeUndefined();
        expect(data.error.value).toStrictEqual(new Error('???'));

        // 再走一遍请求成功情况下的测试

        await delay(100);
        throwError = false;
        result = data.execute();

        expect(data.response.value).toBeUndefined();
        expect(data.data.value).toBeUndefined();
        expect(data.error.value).toStrictEqual(new Error('???'));

        await result;

        expect(data.response.value).toStrictEqual({ data: 1295 });
        expect(data.data.value).toBe(1295);
        expect(data.error.value).toBeUndefined();
      });

      it('选项支持传入 MaybeRefOrGetter 类型对象', async ({ expect }) => {
        // Ref
        {
          let throwError: boolean = false;
          let dataIndex = 1292;

          const resetOnExecute = ref(false);
          const data = useRequest(async () => {
            await delay(100);
            if (throwError) throw new Error('???');
            return {
              data: ++dataIndex,
            };
          }, {
            resetOnExecute,
          });

          // 初始数据
          expect(data.response.value).toBeUndefined();
          expect(data.data.value).toBeUndefined();
          expect(data.error.value).toBeUndefined();

          // 基础测试
          {
            // 进行请求成功情况的测试

            let result = data.execute();

            expect(data.response.value).toBeUndefined();
            expect(data.data.value).toBeUndefined();
            expect(data.error.value).toBeUndefined();

            await result;

            expect(data.response.value).toStrictEqual({ data: 1293 });
            expect(data.data.value).toBe(1293);
            expect(data.error.value).toBeUndefined();

            result = data.execute();

            expect(data.response.value).toStrictEqual({ data: 1293 });
            expect(data.data.value).toBe(1293);
            expect(data.error.value).toBeUndefined();

            await result;

            expect(data.response.value).toStrictEqual({ data: 1294 });
            expect(data.data.value).toBe(1294);
            expect(data.error.value).toBeUndefined();

            // 进行请求失败情况的测试

            await delay(100);
            throwError = true;
            result = data.execute();

            expect(data.response.value).toStrictEqual({ data: 1294 });
            expect(data.data.value).toBe(1294);
            expect(data.error.value).toBeUndefined();

            await expect(() => result).rejects.toThrow('???');

            expect(data.response.value).toBeUndefined();
            expect(data.data.value).toBeUndefined();
            expect(data.error.value).toStrictEqual(new Error('???'));

            result = data.execute();

            expect(data.response.value).toBeUndefined();
            expect(data.data.value).toBeUndefined();
            expect(data.error.value).toStrictEqual(new Error('???'));

            await expect(() => result).rejects.toThrow('???');

            expect(data.response.value).toBeUndefined();
            expect(data.data.value).toBeUndefined();
            expect(data.error.value).toStrictEqual(new Error('???'));

            // 再走一遍请求成功情况下的测试

            await delay(100);
            throwError = false;
            result = data.execute();

            expect(data.response.value).toBeUndefined();
            expect(data.data.value).toBeUndefined();
            expect(data.error.value).toStrictEqual(new Error('???'));

            await result;

            expect(data.response.value).toStrictEqual({ data: 1295 });
            expect(data.data.value).toBe(1295);
            expect(data.error.value).toBeUndefined();
          }

          // 修改 resetOnExecute 的值, 再走一遍流程
          {
            throwError = false;
            resetOnExecute.value = true;

            // 进行请求成功情况的测试

            let result = data.execute();

            expect(data.response.value).toBeUndefined();
            expect(data.data.value).toBeUndefined();
            expect(data.error.value).toBeUndefined();

            await result;

            expect(data.response.value).toStrictEqual({ data: 1296 });
            expect(data.data.value).toBe(1296);
            expect(data.error.value).toBeUndefined();

            result = data.execute();

            expect(data.response.value).toBeUndefined();
            expect(data.data.value).toBeUndefined();
            expect(data.error.value).toBeUndefined();

            await result;

            expect(data.response.value).toStrictEqual({ data: 1297 });
            expect(data.data.value).toBe(1297);
            expect(data.error.value).toBeUndefined();

            // 进行请求失败情况的测试

            await delay(100);
            throwError = true;
            result = data.execute();

            expect(data.response.value).toBeUndefined();
            expect(data.data.value).toBeUndefined();
            expect(data.error.value).toBeUndefined();

            await expect(() => result).rejects.toThrow('???');

            expect(data.response.value).toBeUndefined();
            expect(data.data.value).toBeUndefined();
            expect(data.error.value).toStrictEqual(new Error('???'));

            result = data.execute();

            expect(data.response.value).toBeUndefined();
            expect(data.data.value).toBeUndefined();
            expect(data.error.value).toBeUndefined();

            await expect(() => result).rejects.toThrow('???');

            expect(data.response.value).toBeUndefined();
            expect(data.data.value).toBeUndefined();
            expect(data.error.value).toStrictEqual(new Error('???'));

            // 再走一遍请求成功情况下的测试

            await delay(100);
            throwError = false;
            result = data.execute();

            expect(data.response.value).toBeUndefined();
            expect(data.data.value).toBeUndefined();
            expect(data.error.value).toBeUndefined();

            await result;

            expect(data.response.value).toStrictEqual({ data: 1298 });
            expect(data.data.value).toBe(1298);
            expect(data.error.value).toBeUndefined();
          }
        }

        // Getter
        {
          let throwError: boolean = false;
          let dataIndex = 1292;

          let value = false;
          const data = useRequest(async () => {
            await delay(100);
            if (throwError) throw new Error('???');
            return {
              data: ++dataIndex,
            };
          }, {
            resetOnExecute: () => value,
          });

          // 初始数据
          expect(data.response.value).toBeUndefined();
          expect(data.data.value).toBeUndefined();
          expect(data.error.value).toBeUndefined();

          // 基础测试
          {
            // 进行请求成功情况的测试

            let result = data.execute();

            expect(data.response.value).toBeUndefined();
            expect(data.data.value).toBeUndefined();
            expect(data.error.value).toBeUndefined();

            await result;

            expect(data.response.value).toStrictEqual({ data: 1293 });
            expect(data.data.value).toBe(1293);
            expect(data.error.value).toBeUndefined();

            result = data.execute();

            expect(data.response.value).toStrictEqual({ data: 1293 });
            expect(data.data.value).toBe(1293);
            expect(data.error.value).toBeUndefined();

            await result;

            expect(data.response.value).toStrictEqual({ data: 1294 });
            expect(data.data.value).toBe(1294);
            expect(data.error.value).toBeUndefined();

            // 进行请求失败情况的测试

            await delay(100);
            throwError = true;
            result = data.execute();

            expect(data.response.value).toStrictEqual({ data: 1294 });
            expect(data.data.value).toBe(1294);
            expect(data.error.value).toBeUndefined();

            await expect(() => result).rejects.toThrow('???');

            expect(data.response.value).toBeUndefined();
            expect(data.data.value).toBeUndefined();
            expect(data.error.value).toStrictEqual(new Error('???'));

            result = data.execute();

            expect(data.response.value).toBeUndefined();
            expect(data.data.value).toBeUndefined();
            expect(data.error.value).toStrictEqual(new Error('???'));

            await expect(() => result).rejects.toThrow('???');

            expect(data.response.value).toBeUndefined();
            expect(data.data.value).toBeUndefined();
            expect(data.error.value).toStrictEqual(new Error('???'));

            // 再走一遍请求成功情况下的测试

            await delay(100);
            throwError = false;
            result = data.execute();

            expect(data.response.value).toBeUndefined();
            expect(data.data.value).toBeUndefined();
            expect(data.error.value).toStrictEqual(new Error('???'));

            await result;

            expect(data.response.value).toStrictEqual({ data: 1295 });
            expect(data.data.value).toBe(1295);
            expect(data.error.value).toBeUndefined();
          }

          // 修改 value 的值, 再走一遍流程
          {
            throwError = false;
            value = true;

            // 进行请求成功情况的测试

            let result = data.execute();

            expect(data.response.value).toBeUndefined();
            expect(data.data.value).toBeUndefined();
            expect(data.error.value).toBeUndefined();

            await result;

            expect(data.response.value).toStrictEqual({ data: 1296 });
            expect(data.data.value).toBe(1296);
            expect(data.error.value).toBeUndefined();

            result = data.execute();

            expect(data.response.value).toBeUndefined();
            expect(data.data.value).toBeUndefined();
            expect(data.error.value).toBeUndefined();

            await result;

            expect(data.response.value).toStrictEqual({ data: 1297 });
            expect(data.data.value).toBe(1297);
            expect(data.error.value).toBeUndefined();

            // 进行请求失败情况的测试

            await delay(100);
            throwError = true;
            result = data.execute();

            expect(data.response.value).toBeUndefined();
            expect(data.data.value).toBeUndefined();
            expect(data.error.value).toBeUndefined();

            await expect(() => result).rejects.toThrow('???');

            expect(data.response.value).toBeUndefined();
            expect(data.data.value).toBeUndefined();
            expect(data.error.value).toStrictEqual(new Error('???'));

            result = data.execute();

            expect(data.response.value).toBeUndefined();
            expect(data.data.value).toBeUndefined();
            expect(data.error.value).toBeUndefined();

            await expect(() => result).rejects.toThrow('???');

            expect(data.response.value).toBeUndefined();
            expect(data.data.value).toBeUndefined();
            expect(data.error.value).toStrictEqual(new Error('???'));

            // 再走一遍请求成功情况下的测试

            await delay(100);
            throwError = false;
            result = data.execute();

            expect(data.response.value).toBeUndefined();
            expect(data.data.value).toBeUndefined();
            expect(data.error.value).toBeUndefined();

            await result;

            expect(data.response.value).toStrictEqual({ data: 1298 });
            expect(data.data.value).toBe(1298);
            expect(data.error.value).toBeUndefined();
          }
        }
      });
    });

    describe('shallow: 是否使用 shallowRef 代替 ref 包裹 data 数据', () => {
      it('基础测试', async ({ expect }) => {
        const data = useRequest(() => ({ data: { a: { b: 2 } } }), { immediate: true });
        const data2 = useRequest(() => ({ data: { a: { b: 2 } } }), { immediate: true, shallow: true });

        expect(isRef(data.data)).toBe(true);
        expect(isShallow(data.data)).toBe(false);
        expect(isRef(data2.data)).toBe(true);
        expect(isShallow(data2.data)).toBe(true);

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
    });

    describe('onSuccess, onError, onFinally: 事件钩子配置项', () => {
      it('基础测试', async ({ expect }) => {
        let throwError: boolean = false;
        let dataIndex = 1292;
        const executionOrder: string[] = [];

        // 统计配置项事件钩子调用次数
        let optionSuccessCallCount = 0;
        const optionSuccessArgs: any[] = [];
        let optionErrorCallCount = 0;
        const optionErrorArgs: any[] = [];
        let optionFinallyCallCount = 0;

        // 统计方法返回值事件钩子调用次数
        let methodSuccessCallCount = 0;
        const methodSuccessArgs: any[] = [];
        let methodErrorCallCount = 0;
        const methodErrorArgs: any[] = [];
        let methodFinallyCallCount = 0;

        const data = useRequest(async () => {
          await delay(100);
          if (throwError) throw new Error('test error');
          return {
            data: ++dataIndex,
          };
        }, {
          onSuccess: (response) => {
            optionSuccessCallCount++;
            optionSuccessArgs.push(response);
            executionOrder.push('option-success');
          },
          onError: (error) => {
            optionErrorCallCount++;
            optionErrorArgs.push(error);
            executionOrder.push('option-error');
          },
          onFinally: () => {
            optionFinallyCallCount++;
            executionOrder.push('option-finally');
          },
        });

        // 通过方法返回值注册事件钩子，验证两种方式可以共存
        data.onSuccess((response) => {
          methodSuccessCallCount++;
          methodSuccessArgs.push(response);
          executionOrder.push('method-success');
        });
        data.onError((error) => {
          methodErrorCallCount++;
          methodErrorArgs.push(error);
          executionOrder.push('method-error');
        });
        data.onFinally(() => {
          methodFinallyCallCount++;
          executionOrder.push('method-finally');
        });

        // 初始状态
        expect(optionSuccessCallCount).toBe(0);
        expect(optionErrorCallCount).toBe(0);
        expect(optionFinallyCallCount).toBe(0);
        expect(methodSuccessCallCount).toBe(0);
        expect(methodErrorCallCount).toBe(0);
        expect(methodFinallyCallCount).toBe(0);

        // 测试成功情况
        await data.execute();

        expect(optionSuccessCallCount).toBe(1);
        expect(optionErrorCallCount).toBe(0);
        expect(optionFinallyCallCount).toBe(1);
        expect(methodSuccessCallCount).toBe(1);
        expect(methodErrorCallCount).toBe(0);
        expect(methodFinallyCallCount).toBe(1);
        expect(optionSuccessArgs).toStrictEqual([{ data: 1293 }]);
        expect(methodSuccessArgs).toStrictEqual([{ data: 1293 }]);
        expect(executionOrder).toStrictEqual(['option-success', 'method-success', 'option-finally', 'method-finally']);

        // 重置执行顺序
        executionOrder.length = 0;

        // 测试失败情况
        throwError = true;
        await expect(() => data.execute()).rejects.toThrow('test error');

        expect(optionSuccessCallCount).toBe(1);
        expect(optionErrorCallCount).toBe(1);
        expect(optionFinallyCallCount).toBe(2);
        expect(methodSuccessCallCount).toBe(1);
        expect(methodErrorCallCount).toBe(1);
        expect(methodFinallyCallCount).toBe(2);
        expect(optionErrorArgs.length).toBe(1);
        expect(optionErrorArgs[0]).toBeInstanceOf(Error);
        expect(optionErrorArgs[0].message).toBe('test error');
        expect(methodErrorArgs.length).toBe(1);
        expect(methodErrorArgs[0]).toBeInstanceOf(Error);
        expect(methodErrorArgs[0].message).toBe('test error');
        expect(executionOrder).toStrictEqual(['option-error', 'method-error', 'option-finally', 'method-finally']);

        // 重置执行顺序
        executionOrder.length = 0;

        // 再次测试成功情况
        throwError = false;
        await data.execute();

        expect(optionSuccessCallCount).toBe(2);
        expect(optionErrorCallCount).toBe(1);
        expect(optionFinallyCallCount).toBe(3);
        expect(methodSuccessCallCount).toBe(2);
        expect(methodErrorCallCount).toBe(1);
        expect(methodFinallyCallCount).toBe(3);
        expect(optionSuccessArgs).toStrictEqual([{ data: 1293 }, { data: 1294 }]);
        expect(methodSuccessArgs).toStrictEqual([{ data: 1293 }, { data: 1294 }]);
        expect(executionOrder).toStrictEqual(['option-success', 'method-success', 'option-finally', 'method-finally']);
      });
    });
  });

  it('类型测试', () => {
    expectTypeOf(useRequest).parameters.toEqualTypeOf<[
      UseRequestUserExecute<unknown, any[]>,
      UseRequestOptions<unknown>?,
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
      expectTypeOf(res.reset).toEqualTypeOf<() => void>();
      expectTypeOf(res.onSuccess).toEqualTypeOf<EventHookOn<{ data: number }>>();
      expectTypeOf(res.onError).toEqualTypeOf<EventHookOn<any>>();
      expectTypeOf(res.onFinally).toEqualTypeOf<EventHookOn>();
      expectTypeOf(res.reactive).toEqualTypeOf<{
        response: { data: number } | undefined;
        data: number | undefined;
        error: any;
        isExecuted: boolean;
        isLoading: boolean;
        isFinished: boolean;
        isSuccess: boolean;
        execute: () => Promise<{ data: number }>;
        reset: () => void;
        onSuccess: EventHookOn<{ data: number }>;
        onError: EventHookOn<any>;
        onFinally: EventHookOn;
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
      expectTypeOf(res.reset).toEqualTypeOf<() => void>();
      expectTypeOf(res.onSuccess).toEqualTypeOf<EventHookOn<{ data: number; code: number }>>();
      expectTypeOf(res.onError).toEqualTypeOf<EventHookOn<any>>();
      expectTypeOf(res.onFinally).toEqualTypeOf<EventHookOn>();
      expectTypeOf(res.reactive).toEqualTypeOf<{
        response: { data: number; code: number } | undefined;
        data: number | undefined;
        error: any;
        isExecuted: boolean;
        isLoading: boolean;
        isFinished: boolean;
        isSuccess: boolean;
        execute: (a: number) => Promise<{ data: number; code: number }>;
        reset: () => void;
        onSuccess: EventHookOn<{ data: number; code: number }>;
        onError: EventHookOn<any>;
        onFinally: EventHookOn;
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
      expectTypeOf(res.reset).toEqualTypeOf<() => void>();
      expectTypeOf(res.onSuccess).toEqualTypeOf<EventHookOn<{ data: number }>>();
      expectTypeOf(res.onError).toEqualTypeOf<EventHookOn<any>>();
      expectTypeOf(res.onFinally).toEqualTypeOf<EventHookOn>();
      expectTypeOf(res.reactive).toEqualTypeOf<{
        response: { data: number } | undefined;
        data: number | undefined;
        error: any;
        isExecuted: boolean;
        isLoading: boolean;
        isFinished: boolean;
        isSuccess: boolean;
        execute: () => Promise<{ data: number }>;
        reset: () => void;
        onSuccess: EventHookOn<{ data: number }>;
        onError: EventHookOn<any>;
        onFinally: EventHookOn;
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
      expectTypeOf(res.reset).toEqualTypeOf<() => void>();
      expectTypeOf(res.onSuccess).toEqualTypeOf<EventHookOn<{ data: number; code: number }>>();
      expectTypeOf(res.onError).toEqualTypeOf<EventHookOn<any>>();
      expectTypeOf(res.onFinally).toEqualTypeOf<EventHookOn>();
      expectTypeOf(res.reactive).toEqualTypeOf<{
        response: { data: number; code: number } | undefined;
        data: number | undefined;
        error: any;
        isExecuted: boolean;
        isLoading: boolean;
        isFinished: boolean;
        isSuccess: boolean;
        execute: (a: number) => Promise<{ data: number; code: number }>;
        reset: () => void;
        onSuccess: EventHookOn<{ data: number; code: number }>;
        onError: EventHookOn<any>;
        onFinally: EventHookOn;
      }>();
    }

    interface UserInfo {
      id: number;
      name: string;
    }

    // 手动指定类型 ( 指定 response, 自动推导 data )
    {
      const res = useRequest<{ data: UserInfo }>(() => ({} as any));

      expectTypeOf(res.response).toEqualTypeOf<ShallowRef<{ data: UserInfo } | undefined>>();
      expectTypeOf(res.data).toEqualTypeOf<Ref<UserInfo | undefined>>();
      expectTypeOf(res.error).toEqualTypeOf<ShallowRef<any>>();
      expectTypeOf(res.isExecuted).toEqualTypeOf<Ref<boolean>>();
      expectTypeOf(res.isLoading).toEqualTypeOf<Ref<boolean>>();
      expectTypeOf(res.isFinished).toEqualTypeOf<Ref<boolean>>();
      expectTypeOf(res.isSuccess).toEqualTypeOf<Ref<boolean>>();
      expectTypeOf(res.execute).toEqualTypeOf<(...args: any[]) => Promise<{ data: UserInfo }>>();
      expectTypeOf(res.reset).toEqualTypeOf<() => void>();
      expectTypeOf(res.onSuccess).toEqualTypeOf<EventHookOn<{ data: UserInfo }>>();
      expectTypeOf(res.onError).toEqualTypeOf<EventHookOn<any>>();
      expectTypeOf(res.onFinally).toEqualTypeOf<EventHookOn>();
      expectTypeOf(res.reactive).toEqualTypeOf<{
        response: { data: UserInfo } | undefined;
        data: UserInfo | undefined;
        error: any;
        isExecuted: boolean;
        isLoading: boolean;
        isFinished: boolean;
        isSuccess: boolean;
        execute: (...args: any[]) => Promise<{ data: UserInfo }>;
        reset: () => void;
        onSuccess: EventHookOn<{ data: UserInfo }>;
        onError: EventHookOn<any>;
        onFinally: EventHookOn;
      }>();
    }

    // 手动指定类型 ( 忽略 response, 指定 data )
    {
      const res = useRequest<any, UserInfo>(() => ({} as any));

      expectTypeOf(res.response).toEqualTypeOf<ShallowRef<any>>();
      expectTypeOf(res.data).toEqualTypeOf<Ref<UserInfo | undefined>>();
      expectTypeOf(res.error).toEqualTypeOf<ShallowRef<any>>();
      expectTypeOf(res.isExecuted).toEqualTypeOf<Ref<boolean>>();
      expectTypeOf(res.isLoading).toEqualTypeOf<Ref<boolean>>();
      expectTypeOf(res.isFinished).toEqualTypeOf<Ref<boolean>>();
      expectTypeOf(res.isSuccess).toEqualTypeOf<Ref<boolean>>();
      expectTypeOf(res.execute).toEqualTypeOf<(...args: any[]) => Promise<any>>();
      expectTypeOf(res.reset).toEqualTypeOf<() => void>();
      expectTypeOf(res.onSuccess).toEqualTypeOf<EventHookOn<any>>();
      expectTypeOf(res.onError).toEqualTypeOf<EventHookOn<any>>();
      expectTypeOf(res.onFinally).toEqualTypeOf<EventHookOn>();
      expectTypeOf(res.reactive).toEqualTypeOf<{
        response: any;
        data: UserInfo | undefined;
        error: any;
        isExecuted: boolean;
        isLoading: boolean;
        isFinished: boolean;
        isSuccess: boolean;
        execute: (...args: any[]) => Promise<any>;
        reset: () => void;
        onSuccess: EventHookOn<any>;
        onError: EventHookOn<any>;
        onFinally: EventHookOn;
      }>();
    }
  });
});

describe('useRequestReactive', () => {
  it('方法返回对象参数类型判断', async ({ expect }) => {
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
      'response',
      'data',
      'error',
      'isExecuted',
      'isLoading',
      'isFinished',
      'isSuccess',
      'execute',
      'reset',
      'onSuccess',
      'onError',
      'onFinally',
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

      { key: 'execute', type: 'function' },
      { key: 'reset', type: 'function' },

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
    await expect(() => data.execute()).rejects.toThrow('???');

    expect(data.error).toStrictEqual(new Error('???'));
  });

  it('类型测试', () => {
    expectTypeOf(useRequestReactive).parameters.toEqualTypeOf<[
      UseRequestUserExecute<unknown, any[]>,
      UseRequestOptions<unknown>?,
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
      expectTypeOf(res.reset).toEqualTypeOf<() => void>();
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
      expectTypeOf(res.reset).toEqualTypeOf<() => void>();
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
      expectTypeOf(res.reset).toEqualTypeOf<() => void>();
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
      expectTypeOf(res.reset).toEqualTypeOf<() => void>();
      expectTypeOf(res.onSuccess).toEqualTypeOf<EventHookOn<{ data: number; code: number }>>();
      expectTypeOf(res.onError).toEqualTypeOf<EventHookOn<any>>();
      expectTypeOf(res.onFinally).toEqualTypeOf<EventHookOn>();
    }

    interface UserInfo {
      id: number;
      name: string;
    }

    // 手动指定类型 ( 指定 response, 自动推导 data )
    {
      const res = useRequestReactive<{ data: UserInfo }>(() => ({} as any));

      expectTypeOf(res.response).toEqualTypeOf<{ data: UserInfo } | undefined>();
      expectTypeOf(res.data).toEqualTypeOf<UserInfo | undefined>();
      expectTypeOf(res.error).toEqualTypeOf<any>();
      expectTypeOf(res.isExecuted).toEqualTypeOf<boolean>();
      expectTypeOf(res.isLoading).toEqualTypeOf<boolean>();
      expectTypeOf(res.isFinished).toEqualTypeOf<boolean>();
      expectTypeOf(res.isSuccess).toEqualTypeOf<boolean>();
      expectTypeOf(res.execute).toEqualTypeOf<(...args: any[]) => Promise<{ data: UserInfo }>>();
      expectTypeOf(res.reset).toEqualTypeOf<() => void>();
      expectTypeOf(res.onSuccess).toEqualTypeOf<EventHookOn<{ data: UserInfo }>>();
      expectTypeOf(res.onError).toEqualTypeOf<EventHookOn<any>>();
      expectTypeOf(res.onFinally).toEqualTypeOf<EventHookOn>();
    }

    // 手动指定类型 ( 忽略 response, 指定 data )
    {
      const res = useRequestReactive<any, UserInfo>(() => ({} as any));

      expectTypeOf(res.response).toEqualTypeOf<any>();
      expectTypeOf(res.data).toEqualTypeOf<UserInfo | undefined>();
      expectTypeOf(res.error).toEqualTypeOf<any>();
      expectTypeOf(res.isExecuted).toEqualTypeOf<boolean>();
      expectTypeOf(res.isLoading).toEqualTypeOf<boolean>();
      expectTypeOf(res.isFinished).toEqualTypeOf<boolean>();
      expectTypeOf(res.isSuccess).toEqualTypeOf<boolean>();
      expectTypeOf(res.execute).toEqualTypeOf<(...args: any[]) => Promise<any>>();
      expectTypeOf(res.reset).toEqualTypeOf<() => void>();
      expectTypeOf(res.onSuccess).toEqualTypeOf<EventHookOn<any>>();
      expectTypeOf(res.onError).toEqualTypeOf<EventHookOn<any>>();
      expectTypeOf(res.onFinally).toEqualTypeOf<EventHookOn>();
    }
  });
});
