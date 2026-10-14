import { camelCase, kebabCase, lowerFirst, pascalCase, snakeCase, transformKeys, upperFirst } from 'mixte';

interface Result {
  camelCase: string;
  pascalCase: string;
  kebabCase: string;
  snakeCase: string;
  upperFirst: string;
  lowerFirst: string;
}

const tests: [string, Result][] = [
  ['', { camelCase: '', pascalCase: '', kebabCase: '', snakeCase: '', upperFirst: '', lowerFirst: '' }],

  ['test', { camelCase: 'test', pascalCase: 'Test', kebabCase: 'test', snakeCase: 'test', upperFirst: 'Test', lowerFirst: 'test' }],
  ['Test', { camelCase: 'test', pascalCase: 'Test', kebabCase: 'test', snakeCase: 'test', upperFirst: 'Test', lowerFirst: 'test' }],

  ['fooBarBaz', { camelCase: 'fooBarBaz', pascalCase: 'FooBarBaz', kebabCase: 'foo-bar-baz', snakeCase: 'foo_bar_baz', upperFirst: 'FooBarBaz', lowerFirst: 'fooBarBaz' }],
  ['FooBarBaz', { camelCase: 'fooBarBaz', pascalCase: 'FooBarBaz', kebabCase: 'foo-bar-baz', snakeCase: 'foo_bar_baz', upperFirst: 'FooBarBaz', lowerFirst: 'fooBarBaz' }],

  ['foo-bar-baz', { camelCase: 'fooBarBaz', pascalCase: 'FooBarBaz', kebabCase: 'foo-bar-baz', snakeCase: 'foo_bar_baz', upperFirst: 'Foo-bar-baz', lowerFirst: 'foo-bar-baz' }],
  ['Foo-Bar-Baz', { camelCase: 'fooBarBaz', pascalCase: 'FooBarBaz', kebabCase: 'foo-bar-baz', snakeCase: 'foo_bar_baz', upperFirst: 'Foo-Bar-Baz', lowerFirst: 'foo-Bar-Baz' }],

  ['foo_bar_baz', { camelCase: 'fooBarBaz', pascalCase: 'FooBarBaz', kebabCase: 'foo-bar-baz', snakeCase: 'foo_bar_baz', upperFirst: 'Foo_bar_baz', lowerFirst: 'foo_bar_baz' }],
  ['Foo_Bar_Baz', { camelCase: 'fooBarBaz', pascalCase: 'FooBarBaz', kebabCase: 'foo-bar-baz', snakeCase: 'foo_bar_baz', upperFirst: 'Foo_Bar_Baz', lowerFirst: 'foo_Bar_Baz' }],

  ['foo bar baz', { camelCase: 'fooBarBaz', pascalCase: 'FooBarBaz', kebabCase: 'foo-bar-baz', snakeCase: 'foo_bar_baz', upperFirst: 'Foo bar baz', lowerFirst: 'foo bar baz' }],
  ['Foo Bar Baz', { camelCase: 'fooBarBaz', pascalCase: 'FooBarBaz', kebabCase: 'foo-bar-baz', snakeCase: 'foo_bar_baz', upperFirst: 'Foo Bar Baz', lowerFirst: 'foo Bar Baz' }],

  ['FOO_BAR', { camelCase: 'fooBar', pascalCase: 'FooBar', kebabCase: 'foo-bar', snakeCase: 'foo_bar', upperFirst: 'FOO_BAR', lowerFirst: 'fOO_BAR' }],
  ['HTTPServer', { camelCase: 'httpServer', pascalCase: 'HttpServer', kebabCase: 'http-server', snakeCase: 'http_server', upperFirst: 'HTTPServer', lowerFirst: 'hTTPServer' }],
];

describe('change-case', () => {
  for (const [source, result] of tests) {
    it(`input: \`${source}\``, () => {
      expect(camelCase(source)).toBe(result.camelCase);
      expect(pascalCase(source)).toBe(result.pascalCase);
      expect(kebabCase(source)).toBe(result.kebabCase);
      expect(snakeCase(source)).toBe(result.snakeCase);
      expect(upperFirst(source)).toBe(result.upperFirst);
      expect(lowerFirst(source)).toBe(result.lowerFirst);
    });
  }

  describe('transformKeys', () => {
    it('使用默认的 camelCase 转换对象键名', () => {
      expect(transformKeys({ 'foo-bar': 1, 'baz_qux': 2 })).toStrictEqual({ fooBar: 1, bazQux: 2 });
    });

    it('使用 kebabCase 转换对象键名', () => {
      expect(transformKeys({ fooBar: 1, baz_qux: 2 }, kebabCase)).toStrictEqual({ 'foo-bar': 1, 'baz-qux': 2 });
    });

    it('使用 snakeCase 转换对象键名', () => {
      expect(transformKeys({ 'fooBar': 1, 'baz-qux': 2 }, snakeCase)).toStrictEqual({ foo_bar: 1, baz_qux: 2 });
    });

    it('使用 pascalCase 转换对象键名', () => {
      expect(transformKeys({ 'foo-bar': 1, 'baz_qux': 2 }, pascalCase)).toStrictEqual({ FooBar: 1, BazQux: 2 });
    });

    it('处理空对象', () => {
      expect(transformKeys({}, camelCase)).toStrictEqual({});
    });

    it('保留原始值', () => {
      const obj = {
        'foo-bar': { 'nested-key': 42 },
        'baz_qux': [1, 2, 3],
      };

      expect(transformKeys(obj)).toStrictEqual({
        fooBar: { 'nested-key': 42 },
        bazQux: [1, 2, 3],
      });
    });

    it('不会因为转换后的 `__proto__` 键污染原型链', () => {
      const source = JSON.parse('{"__proto__":{"polluted":true}}');

      expect(Object.keys(source)).toContain('__proto__');

      // 转换后依然是 `__proto__` 键名
      const result = transformKeys(source, snakeCase);
      expect(Object.getPrototypeOf(result)).toBe(Object.prototype);
      expect(result.polluted).toBeUndefined();

      // 使用原样输出的自定义转换函数
      const result2 = transformKeys(source, key => key);
      expect(Object.getPrototypeOf(result2)).toBe(Object.prototype);
      expect(result2.polluted).toBeUndefined();
    });
  });
});
