import type { ShallowRef } from 'vue';
import type { MaybeRefOrGetter } from '@vueuse/core';
import { useFileReader } from '@mixte/use';

describe('useFileReader', () => {
  const textBlob = new Blob(['Hello, world!'], { type: 'text/plain' });
  const textBlob2 = new Blob(['Hello, mixte!'], { type: 'text/plain' });
  const arrayBufferBlob = new Blob([new ArrayBuffer(8)], { type: 'application/octet-stream' });

  const textBlobDataURL = 'data:text/plain;base64,SGVsbG8sIHdvcmxkIQ==';
  const textBlob2DataURL = 'data:text/plain;base64,SGVsbG8sIG1peHRlIQ==';

  test('只传入第一个参数时, 创建一个 DataURL 文件读取', async () => {
    const { result, error, isReading } = useFileReader(textBlob);

    expect(result.value).toBeUndefined();
    expect(error.value).toBeUndefined();
    expect(isReading.value).toBe(true);

    await until(isReading).toBe(false);

    expect(result.value).toBe(textBlobDataURL);
    expect(error.value).toBeUndefined();
    expect(isReading.value).toBe(false);
  });

  test('传入第二个参数为 DataURL 时, 创建一个 DataURL 文件读取', async () => {
    const { result, error, isReading } = useFileReader(textBlob, 'DataURL');

    expect(result.value).toBeUndefined();
    expect(error.value).toBeUndefined();
    expect(isReading.value).toBe(true);

    await until(isReading).toBe(false);

    expect(result.value).toBe(textBlobDataURL);
    expect(error.value).toBeUndefined();
    expect(isReading.value).toBe(false);
  });

  test('传入第二个参数为 Text 时, 创建一个 Text 文件读取', async () => {
    const { result, error, isReading } = useFileReader(textBlob, 'Text');

    expect(result.value).toBeUndefined();
    expect(error.value).toBeUndefined();
    expect(isReading.value).toBe(true);

    await until(isReading).toBe(false);

    expect(result.value).toBe('Hello, world!');
    expect(error.value).toBeUndefined();
    expect(isReading.value).toBe(false);
  });

  test('传入第二个参数为 ArrayBuffer 时, 创建一个 ArrayBuffer 文件读取', async () => {
    const { result, error, isReading } = useFileReader(arrayBufferBlob, 'ArrayBuffer');

    expect(result.value).toBeUndefined();
    expect(error.value).toBeUndefined();
    expect(isReading.value).toBe(true);

    await until(isReading).toBe(false);

    expect(result.value).toBeInstanceOf(ArrayBuffer);
    expect(error.value).toBeUndefined();
    expect(isReading.value).toBe(false);
  });

  test('传入第二个参数为非指定参数时, 则会创建一个 DataURL 文件读取', async () => {
    const { result, error, isReading } = useFileReader(textBlob, 'Unknown' as any);

    expect(result.value).toBeUndefined();
    expect(error.value).toBeUndefined();
    expect(isReading.value).toBe(true);

    await until(isReading).toBe(false);

    expect(result.value).toBe(textBlobDataURL);
    expect(error.value).toBeUndefined();
    expect(isReading.value).toBe(false);
  });

  test('第一个参数支持传入 MaybeRefOrGetter 类型对象', async () => {
    // Ref
    {
      const file = ref(textBlob);
      const { result, error, isReading } = useFileReader(file);

      expect(result.value).toBeUndefined();
      expect(error.value).toBeUndefined();
      expect(isReading.value).toBe(true);

      await until(isReading).toBe(false);

      expect(result.value).toBe(textBlobDataURL);
      expect(error.value).toBeUndefined();
      expect(isReading.value).toBe(false);
    }

    // Getter
    {
      const { result, error, isReading } = useFileReader(() => textBlob);

      expect(result.value).toBeUndefined();
      expect(error.value).toBeUndefined();
      expect(isReading.value).toBe(true);

      await until(isReading).toBe(false);

      expect(result.value).toBe(textBlobDataURL);
      expect(error.value).toBeUndefined();
      expect(isReading.value).toBe(false);
    }
  });

  test('第一个参数为 ref 且初始有值时, 会立即进行文件读取', async () => {
    const file = ref(textBlob);

    const { result, error, isReading } = useFileReader(file);

    expect(result.value).toBeUndefined();
    expect(error.value).toBeUndefined();
    expect(isReading.value).toBe(true);

    await until(isReading).toBe(false);

    expect(result.value).toBe(textBlobDataURL);
    expect(error.value).toBeUndefined();
    expect(isReading.value).toBe(false);
  });

  test('第一个参数为 ref 且初始无值时, 不会进行文件读取, 在写入值后, 会立即进行文件读取', async () => {
    const file = ref<Blob>();

    const { result, error, isReading } = useFileReader(file);

    expect(result.value).toBeUndefined();
    expect(error.value).toBeUndefined();
    expect(isReading.value).toBe(false);

    file.value = textBlob;

    expect(result.value).toBeUndefined();
    expect(error.value).toBeUndefined();
    expect(isReading.value).toBe(false);

    await nextTick();

    expect(result.value).toBeUndefined();
    expect(error.value).toBeUndefined();
    expect(isReading.value).toBe(true);

    await until(isReading).toBe(false);

    expect(result.value).toBe(textBlobDataURL);
    expect(error.value).toBeUndefined();
    expect(isReading.value).toBe(false);
  });

  test('当前文件读取完成后, 修改文件后, 会重新进行文件读取', async () => {
    const file = ref(textBlob);

    const { result, error, isReading } = useFileReader(file);

    expect(result.value).toBeUndefined();
    expect(error.value).toBeUndefined();
    expect(isReading.value).toBe(true);

    await until(isReading).toBe(false);

    expect(result.value).toBe(textBlobDataURL);
    expect(error.value).toBeUndefined();
    expect(isReading.value).toBe(false);

    file.value = textBlob2;

    await nextTick();

    expect(result.value).toBeUndefined();
    expect(error.value).toBeUndefined();
    expect(isReading.value).toBe(true);

    await until(isReading).toBe(false);

    expect(result.value).toBe(textBlob2DataURL);
    expect(error.value).toBeUndefined();
    expect(isReading.value).toBe(false);
  });

  test('当前文件读取中, 修改文件后, 会中断当前文件读取, 并重新进行文件读取', async () => {
    const file = ref(textBlob);

    const { result, error, isReading } = useFileReader(file);

    expect(result.value).toBeUndefined();
    expect(error.value).toBeUndefined();
    expect(isReading.value).toBe(true);

    file.value = textBlob2;

    expect(result.value).toBeUndefined();
    expect(error.value).toBeUndefined();
    expect(isReading.value).toBe(true);

    await until(isReading).toBe(false);

    expect(result.value).toBe(textBlob2DataURL);
    expect(error.value).toBeUndefined();
    expect(isReading.value).toBe(false);
  });

  test('作用域销毁时, 会中断当前文件读取', async () => {
    const _FileReader = globalThis.FileReader;

    let isAbort = false;

    globalThis.FileReader = class extends _FileReader {
      abort() {
        isAbort = true;
      }
    } as any;

    let result: Ref<string | null | undefined>;
    let error: Ref<ProgressEvent<FileReader> | null>;
    let isReading: Ref<boolean>;

    const scope = effectScope();

    scope.run(() => {
      const {
        result: _result,
        error: _error,
        isReading: _isReading,
      } = useFileReader(textBlob);

      result = _result;
      error = _error;
      isReading = _isReading;
    });

    expect(result!.value).toBeUndefined();
    expect(error!.value).toBeUndefined();
    expect(isReading!.value).toBe(true);
    expect(isAbort).toBe(true);

    scope.stop();

    expect(result!.value).toBeUndefined();
    expect(error!.value).toBeUndefined();
    expect(isReading!.value).toBe(true);
    expect(isAbort).toBe(true);

    globalThis.FileReader = _FileReader;
  });

  test('读取失败时, 返回的 error 中包含错误信息', async () => {
    const file: any = ref();
    const { result, error, isReading } = useFileReader(file);

    expect(result.value).toBeUndefined();
    expect(error.value).toBeUndefined();
    expect(isReading.value).toBe(false);

    file.value = 123;

    expect(result.value).toBeUndefined();
    expect(error.value).toBeUndefined();
    expect(isReading.value).toBe(false);

    await nextTick();

    expect(result.value).toBeUndefined();
    expect(error.value.message).toBeDefined();
    expect(isReading.value).toBe(false);
  });

  test('类型测试', () => {
    expectTypeOf(useFileReader).parameters.toEqualTypeOf<[
      MaybeRefOrGetter<Blob | null | undefined>,
      ('DataURL' | 'Text' | 'ArrayBuffer')?,
    ]>();

    // 未传入第二个参数时, 默认读取方式为 DataURL, 返回结果为字符串
    expectTypeOf(useFileReader(textBlob)).toEqualTypeOf<{
      result: Ref<string | null | undefined>
      error: ShallowRef<any>
      isReading: Ref<boolean>
    }>();

    // 传入第二个参数为 DataURL 时, 返回结果为 string
    expectTypeOf(useFileReader(textBlob, 'DataURL')).toEqualTypeOf<{
      result: Ref<string | null | undefined>
      error: ShallowRef<any>
      isReading: Ref<boolean>
    }>();

    // 传入第二个参数为 Text 时, 返回结果为 string
    expectTypeOf(useFileReader(textBlob, 'Text')).toEqualTypeOf<{
      result: Ref<string | null | undefined>
      error: ShallowRef<any>
      isReading: Ref<boolean>
    }>();

    // 传入第二个参数为 ArrayBuffer 时, 返回结果为 ArrayBuffer
    expectTypeOf(useFileReader(textBlob, 'ArrayBuffer')).toEqualTypeOf<{
      result: Ref<ArrayBuffer | null | undefined>
      error: ShallowRef<any>
      isReading: Ref<boolean>
    }>();
  });
});
