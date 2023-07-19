/** 所有用于测试的类型 */
export const types = {
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
export function testTypes(
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
