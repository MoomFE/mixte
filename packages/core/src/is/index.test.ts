import { isEmptyObject, isFunction, isNativePromise, isNumber, isNumeric, isNumericString, isObject, isPlainObject, isPrimitive, isPromise, isReference, isString } from './index';

/** 所有用于测试的类型 */
const types = {
  // Undefined
  undefined: [undefined],
  // Null
  null: [null],
  // String
  string: ['', 'mixte', '🌟'],
  // Number
  number: [-6.6, -6, 0, 6, 6.6, Infinity, -Infinity],
  // Numeric String
  numericString: ['-6.6', '-6', '0', '6', '6.6'],
  // Boolean
  boolean: [true, false],
  // NaN
  nan: [NaN],
  // Symbol
  symbol: [Symbol(''), Symbol('666'), Symbol('🌟')],
  // BigInt
  bigint: [-6n, -6n, 0n, 6n, 6n],
  // Function
  function: [
    () => {},
    function () {},
    async () => {},
    async function () {},
    function* () {},
    async function* () {},
  ],
  // Object
  object: [
    {},
    { mixte: 6 },
    Object.create(null),
    Object.create({ mixte: 6 }),
  ],
  // Array
  array: [
    [],
    [6],
    [6, 'mixte'],
    Array.from({ length: 6 }),
    Array.from({ length: 6 }, () => 6),
  ],
  // RegExp
  regexp: [
    /^$/,
    /^🌟$/,
    new RegExp(''), // eslint-disable-line prefer-regex-literals
    new RegExp('🌟'), // eslint-disable-line prefer-regex-literals
  ],
  // Promise
  promise: [
    new Promise(() => {}),
    Promise.resolve(),
  ],
  // Promise Like
  promiseLike: [
    { then: () => {}, catch: () => {} },
  ],
};

/**
 * 测试传入判断类型的方法
 * @param fn 判断类型的方法
 * @param checkTypes 可通过测试的类型 ( 需要测试的类型 )
 */
function testTypes(
  fn: (v: any) => boolean,
  checkTypes: (keyof typeof types)[],
) {
  const keys = Object.keys(types) as (keyof typeof types)[];

  for (const key of keys) {
    const values = types[key];

    if (checkTypes.includes(key)) {
      for (const value of values)
        if (!fn(value)) return false;
    }
    else {
      for (const value of values)
        if (fn(value)) return false;
    }
  }

  return true;
}

describe('testTypes', () => {
  test('会把所有类型内的值传入方法执行', () => {
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

  test('当传入的类型可通过测试时, 会返回 true', () => {
    expect(
      testTypes(
        (obj: unknown) => typeof obj === 'string',
        ['string', 'numericString'],
      ),
    ).toBe(true);
  });

  test('当传入的类型中有某项不可通过测试时, 会返回 false', () => {
    expect(
      testTypes(
        (obj: unknown) => obj === true,
        ['boolean'],
      ),
    ).toBe(false);
  });

  test('当传入的类型不可通过测试时, 会返回 false', () => {
    expect(
      testTypes(
        (obj: unknown) => typeof obj === 'string',
        ['array'],
      ),
    ).toBe(false);
  });

  test('当除了传入的类型外, 其他类型可通过测试时, 会返回 false', () => {
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
  test('isString', () => {
    expect(isString('666')).toBe(true);
    expect(isString(666)).toBe(false);
    expect(testTypes(isString, ['string', 'numericString'])).toBe(true);
  });

  test('isNumber', () => {
    expect(isNumber(666)).toBe(true);
    expect(isNumber('666')).toBe(false);
    expect(isNumber(NaN)).toBe(false);
    expect(testTypes(isNumber, ['number'])).toBe(true);
  });

  test('isNumericString', () => {
    expect(isNumericString('666')).toBe(true);
    expect(isNumericString(666)).toBe(false);
    expect(isNumericString(NaN)).toBe(false);
    expect(testTypes(isNumericString, ['numericString'])).toBe(true);
  });

  test('isNumeric', () => {
    expect(isNumeric(666)).toBe(true);
    expect(isNumeric('666')).toBe(true);
    expect(isNumeric(NaN)).toBe(false);
    expect(testTypes(isNumeric, ['number', 'numericString'])).toBe(true);
  });

  test('isObject', () => {
    expect(isObject({})).toBe(true);
    expect(isObject([])).toBe(true);
    expect(isObject(() => {})).toBe(false);
    expect(isObject(function () {})).toBe(false); // eslint-disable-line prefer-arrow-callback
    expect(isObject(666)).toBe(false);
    expect(testTypes(isObject, ['object', 'array', 'promise', 'promiseLike', 'regexp'])).toBe(true);
  });

  test('isPlainObject', () => {
    expect(isPlainObject({})).toBe(true);
    expect(isPlainObject(Object.create(null))).toBe(true);
    expect(isPlainObject([])).toBe(false);
    expect(testTypes(isPlainObject, ['object', 'promiseLike'])).toBe(true);
  });

  test('isFunction', () => {
    expect(isFunction(() => {})).toBe(true);
    expect(isFunction(function () {})).toBe(true); // eslint-disable-line prefer-arrow-callback
    expect(isFunction({})).toBe(false);
    expect(isFunction([])).toBe(false);
    expect(isFunction(666)).toBe(false);
    expect(testTypes(isFunction, ['function'])).toBe(true);
  });

  test('isNativePromise', () => {
    expect(isNativePromise(new Promise(() => {}))).toBe(true);
    expect(isNativePromise(Promise.resolve())).toBe(true);
    expect(isNativePromise({ then() {}, catch() {} })).toBe(false);
    expect(testTypes(isNativePromise, ['promise'])).toBe(true);
  });

  test('isPromise', () => {
    expect(isPromise(new Promise(() => {}))).toBe(true);
    expect(isPromise(Promise.resolve())).toBe(true);
    expect(isPromise({ then() {}, catch() {} })).toBe(true);
    expect(testTypes(isPromise, ['promise', 'promiseLike'])).toBe(true);
  });

  test('isReference', () => {
    expect(isReference({})).toBe(true);
    expect(isReference([])).toBe(true);
    expect(isReference(() => {})).toBe(true);
    expect(isReference(function () {})).toBe(true); // eslint-disable-line prefer-arrow-callback
    expect(isReference(undefined)).toBe(false);
    expect(isReference(null)).toBe(false);
    expect(isReference(true)).toBe(false);
    expect(isReference(false)).toBe(false);
    expect(isReference(666)).toBe(false);
    expect(isReference(NaN)).toBe(false);
    expect(isReference('666')).toBe(false);
    expect(isReference(Symbol('666'))).toBe(false);
    expect(isReference(666n)).toBe(false);
    expect(testTypes(isReference, ['object', 'array', 'function', 'promise', 'promiseLike', 'regexp'])).toBe(true);
  });

  test('isPrimitive', () => {
    expect(isPrimitive(undefined)).toBe(true);
    expect(isPrimitive(null)).toBe(true);
    expect(isPrimitive(true)).toBe(true);
    expect(isPrimitive(false)).toBe(true);
    expect(isPrimitive(666)).toBe(true);
    expect(isPrimitive(NaN)).toBe(true);
    expect(isPrimitive('666')).toBe(true);
    expect(isPrimitive(Symbol('666'))).toBe(true);
    expect(isPrimitive(666n)).toBe(true);
    expect(isPrimitive({})).toBe(false);
    expect(isPrimitive([])).toBe(false);
    expect(isPrimitive(() => {})).toBe(false);
    expect(isPrimitive(function () {})).toBe(false); // eslint-disable-line prefer-arrow-callback
    expect(testTypes(isPrimitive, ['undefined', 'null', 'boolean', 'number', 'numericString', 'nan', 'string', 'symbol', 'bigint'])).toBe(true);
  });

  test('isEmptyObject', () => {
    expect(isEmptyObject({})).toBe(true);
    expect(isEmptyObject({ mixte: 6 })).toBe(false);
  });
});
