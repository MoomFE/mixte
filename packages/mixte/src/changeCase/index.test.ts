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
  });
});
