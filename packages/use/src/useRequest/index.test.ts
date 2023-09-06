import { useRequest } from '@mixte/use';
import { delay } from 'mixte';

describe('useRequest', () => {
  test('方法返回对象参数类型判断', () => {
    const data = useRequest(() => delay(100));

    expect(Object.keys(data).sort()).toEqual([
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
      successEventCountAndArgs = [++successEventCountAndArgs[0], ...args];
    });
    data.onError((...args: any[]) => {
      errorEventCountAndArgs = [++errorEventCountAndArgs[0], ...args];
    });
    data.onFinally((...args: any[]) => {
      finallyEventCountAndArgs = [++finallyEventCountAndArgs[0], ...args];
    });

    expect(data.response).toBeUndefined();
    expect(data.data).toBeUndefined();
    expect(data.error).toBeUndefined();
    expect(data.isExecuted).toBe(false);
    expect(data.isLoading).toBe(false);
    expect(data.isFinished).toBe(false);
    expect(data.isSuccess).toBe(false);
    expect(successEventCountAndArgs).toEqual([0]);
    expect(errorEventCountAndArgs).toEqual([0]);
    expect(finallyEventCountAndArgs).toEqual([0]);

    // 进行请求成功情况的测试

    const result = data.execute();

    expect(data.response).toBeUndefined();
    expect(data.data).toBeUndefined();
    expect(data.error).toBeUndefined();
    expect(data.isExecuted).toBe(true);
    expect(data.isLoading).toBe(true);
    expect(data.isFinished).toBe(false);
    expect(data.isSuccess).toBe(false);
    expect(successEventCountAndArgs).toEqual([0]);
    expect(errorEventCountAndArgs).toEqual([0]);
    expect(finallyEventCountAndArgs).toEqual([0]);

    await result;

    expect(data.response).toEqual({ data: 1293 });
    expect(data.data).toBe(1293);
    expect(data.error).toBeUndefined();
    expect(data.isExecuted).toBe(true);
    expect(data.isLoading).toBe(false);
    expect(data.isFinished).toBe(true);
    expect(data.isSuccess).toBe(true);
    expect(successEventCountAndArgs).toEqual([1, { data: 1293 }]);
    expect(errorEventCountAndArgs).toEqual([0]);
    expect(finallyEventCountAndArgs).toEqual([1, null]);

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
    expect(successEventCountAndArgs).toEqual([1, { data: 1293 }]);
    expect(errorEventCountAndArgs).toEqual([0]);
    expect(finallyEventCountAndArgs).toEqual([1, null]);

    try {
      await result2;
    }
    catch (error: any) {
      expect(error).toEqual(new Error('???'));
    }

    expect(data.response).toBeUndefined();
    expect(data.data).toBeUndefined();
    expect(data.error).toEqual(new Error('???'));
    expect(data.isExecuted).toBe(true);
    expect(data.isLoading).toBe(false);
    expect(data.isFinished).toBe(true);
    expect(data.isSuccess).toBe(false);
    expect(successEventCountAndArgs).toEqual([1, { data: 1293 }]);
    expect(errorEventCountAndArgs).toEqual([1, new Error('???')]);
    expect(finallyEventCountAndArgs).toEqual([2, null]);
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
      successEventCountAndArgs = [++successEventCountAndArgs[0], ...args];
    });
    data.onError((...args: any[]) => {
      errorEventCountAndArgs = [++errorEventCountAndArgs[0], ...args];
    });
    data.onFinally((...args: any[]) => {
      finallyEventCountAndArgs = [++finallyEventCountAndArgs[0], ...args];
    });

    expect(data.response).toBeUndefined();
    expect(data.data).toBeUndefined();
    expect(data.error).toBeUndefined();
    expect(data.isExecuted).toBe(false);
    expect(data.isLoading).toBe(false);
    expect(data.isFinished).toBe(false);
    expect(data.isSuccess).toBe(false);
    expect(successEventCountAndArgs).toEqual([0]);
    expect(errorEventCountAndArgs).toEqual([0]);
    expect(finallyEventCountAndArgs).toEqual([0]);

    // 进行请求失败情况的测试

    const result = data.execute();

    expect(data.response).toBeUndefined();
    expect(data.data).toBeUndefined();
    expect(data.error).toBeUndefined();
    expect(data.isExecuted).toBe(true);
    expect(data.isLoading).toBe(true);
    expect(data.isFinished).toBe(false);
    expect(data.isSuccess).toBe(false);
    expect(successEventCountAndArgs).toEqual([0]);
    expect(errorEventCountAndArgs).toEqual([0]);
    expect(finallyEventCountAndArgs).toEqual([0]);

    try {
      await result;
    }
    catch (error: any) {
      expect(error).toEqual(new Error('???'));
    }

    expect(data.response).toBeUndefined();
    expect(data.data).toBeUndefined();
    expect(data.error).toEqual(new Error('???'));
    expect(data.isExecuted).toBe(true);
    expect(data.isLoading).toBe(false);
    expect(data.isFinished).toBe(true);
    expect(data.isSuccess).toBe(false);
    expect(successEventCountAndArgs).toEqual([0]);
    expect(errorEventCountAndArgs).toEqual([1, new Error('???')]);
    expect(finallyEventCountAndArgs).toEqual([1, null]);

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
    expect(successEventCountAndArgs).toEqual([0]);
    expect(errorEventCountAndArgs).toEqual([1, new Error('???')]);
    expect(finallyEventCountAndArgs).toEqual([1, null]);

    await result2;

    expect(data.response).toEqual({ data: 1293 });
    expect(data.data).toBe(1293);
    expect(data.error).toBeUndefined();
    expect(data.isExecuted).toBe(true);
    expect(data.isLoading).toBe(false);
    expect(data.isFinished).toBe(true);
    expect(data.isSuccess).toBe(true);
    expect(successEventCountAndArgs).toEqual([1, { data: 1293 }]);
    expect(errorEventCountAndArgs).toEqual([1, new Error('???')]);
    expect(finallyEventCountAndArgs).toEqual([2, null]);
  });

  test('支持传入 immediate 选项立即发起请求', async () => {
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

    expect(data.response).toEqual({ data: 1 });
    expect(data.data).toBe(1);
    expect(data.error).toBeUndefined();
    expect(data.isExecuted).toBe(true);
    expect(data.isLoading).toBe(false);
    expect(data.isFinished).toBe(true);
    expect(data.isSuccess).toBe(true);
  });

  test('支持传入 initialData 选项定义初始数据, 每次发起请求时会重置 data 为传入的 initialData', async () => {
    const data = useRequest(async () => {
      await delay(100);
      return {
        data: 1,
      };
    }, {
      initialData: 666,
    });

    expect(data.response).toBeUndefined();
    expect(data.data).toBe(666);
    expect(data.error).toBeUndefined();
    expect(data.isExecuted).toBe(false);
    expect(data.isLoading).toBe(false);
    expect(data.isFinished).toBe(false);
    expect(data.isSuccess).toBe(false);

    const result = data.execute();

    expect(data.response).toBeUndefined();
    expect(data.data).toBe(666);
    expect(data.error).toBeUndefined();
    expect(data.isExecuted).toBe(true);
    expect(data.isLoading).toBe(true);
    expect(data.isFinished).toBe(false);
    expect(data.isSuccess).toBe(false);

    await result;

    expect(data.response).toEqual({ data: 1 });
    expect(data.data).toBe(1);
    expect(data.error).toBeUndefined();
    expect(data.isExecuted).toBe(true);
    expect(data.isLoading).toBe(false);
    expect(data.isFinished).toBe(true);
    expect(data.isSuccess).toBe(true);

    data.execute();

    expect(data.response).toBeUndefined();
    expect(data.data).toBe(666);
    expect(data.error).toBeUndefined();
    expect(data.isExecuted).toBe(true);
    expect(data.isLoading).toBe(true);
    expect(data.isFinished).toBe(false);
    expect(data.isSuccess).toBe(false);
  });
});
