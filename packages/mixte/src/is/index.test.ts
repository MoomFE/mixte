import { isBoolean, isESModule, isEmptyObject, isFunction, isNativePromise, isNumber, isNumeric, isNumericString, isObject, isPlainObject, isPrimitive, isPromise, isReference, isString } from 'mixte';
import { testTypes, types } from './testTypes';

describe('testTypes', () => {
  it('会把所有类型内的值传入方法执行', () => {
    let count = 0;

    function getApplesCount() {
      count++;
      return false;
    }

    testTypes(getApplesCount, []);

    expect(count).toBe(
      ([] as any[]).concat(...Object.values(types)).length,
    );
  });

  it('当传入的类型可通过测试时, 会返回 true', () => {
    expect(
      testTypes(
        (obj: unknown) => typeof obj === 'string',
        ['string', 'numericString'],
      ),
    ).toBe(true);
  });

  it('当传入的类型中有某项不可通过测试时, 会返回 false', () => {
    expect(
      testTypes(
        (obj: unknown) => obj === true,
        ['boolean'],
      ),
    ).toBe(false);
  });

  it('当传入的类型不可通过测试时, 会返回 false', () => {
    expect(
      testTypes(
        (obj: unknown) => typeof obj === 'string',
        ['array'],
      ),
    ).toBe(false);
  });

  it('当除了传入的类型外, 其他类型可通过测试时, 会返回 false', () => {
    expect(
      testTypes(
        (obj: unknown) => typeof obj === 'string',
        ['string'],
      ),
    ).toBe(false);

    expect(
      testTypes(
        (obj: unknown) => typeof obj === 'string',
        ['numericString'],
      ),
    ).toBe(false);
  });
});

describe('is', () => {
  it('isString', () => {
    expect(isString('666')).toBe(true);
    expect(isString(666)).toBe(false);
    expect(testTypes(isString, ['string', 'numericString'])).toBe(true);
  });

  it('isBoolean', () => {
    expect(isBoolean(true)).toBe(true);
    expect(isBoolean(false)).toBe(true);
    expect(isBoolean(666)).toBe(false);
    expect(testTypes(isBoolean, ['boolean'])).toBe(true);
  });

  it('isNumber', () => {
    expect(isNumber(666)).toBe(true);
    expect(isNumber('666')).toBe(false);
    expect(isNumber(Number.NaN)).toBe(false);
    expect(testTypes(isNumber, ['number'])).toBe(true);
  });

  it('isNumericString', () => {
    expect(isNumericString('666')).toBe(true);
    expect(isNumericString(666)).toBe(false);
    expect(isNumericString(Number.NaN)).toBe(false);
    expect(testTypes(isNumericString, ['numericString'])).toBe(true);
  });

  it('isNumeric', () => {
    expect(isNumeric(666)).toBe(true);
    expect(isNumeric('666')).toBe(true);
    expect(isNumeric(Number.NaN)).toBe(false);
    expect(testTypes(isNumeric, ['number', 'numericString'])).toBe(true);
  });

  it('isObject', () => {
    expect(isObject({})).toBe(true);
    expect(isObject([])).toBe(true);
    expect(isObject(() => {})).toBe(false);
    expect(isObject(function () {})).toBe(false); // eslint-disable-line prefer-arrow-callback
    expect(isObject(666)).toBe(false);
    expect(testTypes(isObject, ['object', 'array', 'promise', 'promiseLike', 'regexp'])).toBe(true);
  });

  it('isPlainObject', () => {
    expect(isPlainObject({})).toBe(true);
    expect(isPlainObject(Object.create(null))).toBe(true);
    expect(isPlainObject([])).toBe(false);
    expect(testTypes(isPlainObject, ['object', 'promiseLike'])).toBe(true);
  });

  it('isFunction', () => {
    expect(isFunction(() => {})).toBe(true);
    expect(isFunction(function () {})).toBe(true); // eslint-disable-line prefer-arrow-callback
    expect(isFunction({})).toBe(false);
    expect(isFunction([])).toBe(false);
    expect(isFunction(666)).toBe(false);
    expect(testTypes(isFunction, ['function'])).toBe(true);
  });

  it('isNativePromise', () => {
    expect(isNativePromise(new Promise(() => {}))).toBe(true);
    expect(isNativePromise(Promise.resolve())).toBe(true);
    expect(isNativePromise({ then() {}, catch() {} })).toBe(false);
    expect(testTypes(isNativePromise, ['promise'])).toBe(true);
  });

  it('isPromise', () => {
    expect(isPromise(new Promise(() => {}))).toBe(true);
    expect(isPromise(Promise.resolve())).toBe(true);
    expect(isPromise({ then() {}, catch() {} })).toBe(true);
    expect(testTypes(isPromise, ['promise', 'promiseLike'])).toBe(true);
  });

  it('isReference', () => {
    expect(isReference({})).toBe(true);
    expect(isReference([])).toBe(true);
    expect(isReference(() => {})).toBe(true);
    expect(isReference(function () {})).toBe(true); // eslint-disable-line prefer-arrow-callback
    expect(isReference(undefined)).toBe(false);
    expect(isReference(null)).toBe(false);
    expect(isReference(true)).toBe(false);
    expect(isReference(false)).toBe(false);
    expect(isReference(666)).toBe(false);
    expect(isReference(Number.NaN)).toBe(false);
    expect(isReference('666')).toBe(false);
    expect(isReference(Symbol('666'))).toBe(false);
    expect(isReference(666n)).toBe(false);
    expect(testTypes(isReference, ['object', 'array', 'function', 'promise', 'promiseLike', 'regexp'])).toBe(true);
  });

  it('isPrimitive', () => {
    expect(isPrimitive(undefined)).toBe(true);
    expect(isPrimitive(null)).toBe(true);
    expect(isPrimitive(true)).toBe(true);
    expect(isPrimitive(false)).toBe(true);
    expect(isPrimitive(666)).toBe(true);
    expect(isPrimitive(Number.NaN)).toBe(true);
    expect(isPrimitive('666')).toBe(true);
    expect(isPrimitive(Symbol('666'))).toBe(true);
    expect(isPrimitive(666n)).toBe(true);
    expect(isPrimitive({})).toBe(false);
    expect(isPrimitive([])).toBe(false);
    expect(isPrimitive(() => {})).toBe(false);
    expect(isPrimitive(function () {})).toBe(false); // eslint-disable-line prefer-arrow-callback
    expect(testTypes(isPrimitive, ['undefined', 'null', 'boolean', 'number', 'numericString', 'nan', 'string', 'symbol', 'bigint'])).toBe(true);
  });

  it('isEmptyObject', () => {
    expect(isEmptyObject({})).toBe(true);
    expect(isEmptyObject({ mixte: 6 })).toBe(false);
  });

  it('isESModule', async () => {
    expect(isESModule({ __esModule: true })).toBe(true);
    expect(isESModule({ [Symbol.toStringTag]: 'Module' })).toBe(true);
    expect(isESModule(import.meta.glob('./index.ts', { eager: true })['./index.ts'])).toBe(true);
    expect(isESModule({})).toBe(false);
  });
});
