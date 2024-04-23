import type { CamelCase, KebabCase, PascalCase, SnakeCase } from 'type-fest';
import { splitByCase } from 'scule';

const SPLITTERS = ['-', '_', ' '] as const;

/**
 * 将字符串转换为小驼峰命名
 *
 * @see https://mixte.moomfe.com/mixte/changeCase#camelCase
 * @param str 需要转换的字符串
 * @example
 *
 * camelCase('foo-bar-baz'); // -> 'fooBarBaz'
 * camelCase('Foo-Bar-Baz'); // -> 'fooBarBaz'
 * camelCase('foo_bar_baz'); // -> 'fooBarBaz'
 * camelCase('Foo_Bar_Baz'); // -> 'fooBarBaz'
 * camelCase('foo bar baz'); // -> 'fooBarBaz'
 * camelCase('Foo Bar Baz'); // -> 'fooBarBaz'
 */
export function camelCase<T extends string>(str: T): CamelCase<T> {
  return lowerFirst(pascalCase(str)) as CamelCase<T>;
}

/**
 * 将字符串转换为大驼峰命名
 *
 * @see https://mixte.moomfe.com/mixte/changeCase#pascalCase
 * @param str 需要转换的字符串
 * @example
 *
 * pascalCase('foo-bar-baz'); // -> 'FooBarBaz'
 * pascalCase('Foo-Bar-Baz'); // -> 'FooBarBaz'
 * pascalCase('foo_bar_baz'); // -> 'FooBarBaz'
 * pascalCase('Foo_Bar_Baz'); // -> 'FooBarBaz'
 * pascalCase('foo bar baz'); // -> 'FooBarBaz'
 * pascalCase('Foo Bar Baz'); // -> 'FooBarBaz'
 */
export function pascalCase<T extends string>(str: T): PascalCase<T> {
  return splitByCase(str, SPLITTERS).map(s => upperFirst(s)).join('') as PascalCase<T>;
}

/**
 * 将字符串转换为短横线命名
 *
 * @see https://mixte.moomfe.com/mixte/changeCase#kebabCase
 * @param str 需要转换的字符串
 * @example
 *
 * kebabCase('fooBarBaz'); // -> 'foo-bar-baz'
 * kebabCase('FooBarBaz'); // -> 'foo-bar-baz'
 * kebabCase('foo_bar_baz'); // -> 'foo-bar-baz'
 * kebabCase('Foo_Bar_Baz'); // -> 'foo-bar-baz'
 * kebabCase('foo bar baz'); // -> 'foo-bar-baz'
 * kebabCase('Foo Bar Baz'); // -> 'foo-bar-baz'
 */
export function kebabCase<T extends string>(str: T): KebabCase<T> {
  return splitByCase(str, SPLITTERS).map(s => s.toLowerCase()).join('-') as KebabCase<T>;
}

/**
 * 将字符串转换为下划线命名
 *
 * @see https://mixte.moomfe.com/mixte/changeCase#snakeCase
 * @param str 需要转换的字符串
 * @example
 *
 * snakeCase('fooBarBaz'); // -> 'foo_bar_baz'
 * snakeCase('FooBarBaz'); // -> 'foo_bar_baz'
 * snakeCase('foo_bar_baz'); // -> 'foo_bar_baz'
 * snakeCase('Foo_Bar_Baz'); // -> 'foo_bar_baz'
 * snakeCase('foo bar baz'); // -> 'foo_bar_baz'
 * snakeCase('Foo Bar Baz'); // -> 'foo_bar_baz'
 */
export function snakeCase<T extends string>(str: T): SnakeCase<T> {
  return splitByCase(str, SPLITTERS).map(s => s.toLowerCase()).join('_') as SnakeCase<T>;
}

/**
 * 将字符串的首字母转换为小写
 *
 * @see https://mixte.moomfe.com/mixte/changeCase#lowerFirst
 * @param str 需要转换的字符串
 * @example
 *
 * lowerFirst('FooBarBaz'); // -> 'fooBarBaz'
 * lowerFirst('fooBarBaz'); // -> 'fooBarBaz'
 * lowerFirst('foo_bar_baz'); // -> 'foo_bar_baz'
 * lowerFirst('Foo_Bar_Baz'); // -> 'foo_Bar_Baz'
 * lowerFirst('foo bar baz'); // -> 'foo bar baz'
 * lowerFirst('Foo Bar Baz'); // -> 'foo Bar Baz'
 */
export function lowerFirst<T extends string>(str: T): Uncapitalize<T> {
  return (str ? str[0].toLowerCase() + str.slice(1) : '') as Uncapitalize<T>;
}

/**
 * 将字符串的首字母转换为大写
 *
 * @see https://mixte.moomfe.com/mixte/changeCase#upperFirst
 * @param str 需要转换的字符串
 * @example
 *
 * upperFirst('fooBarBaz'); // -> 'FooBarBaz'
 * upperFirst('FooBarBaz'); // -> 'FooBarBaz'
 * upperFirst('foo_bar_baz'); // -> 'Foo_bar_baz'
 * upperFirst('Foo_Bar_Baz'); // -> 'Foo_Bar_Baz'
 * upperFirst('foo bar baz'); // -> 'Foo bar baz'
 * upperFirst('Foo Bar Baz'); // -> 'Foo Bar Baz'
 */
export function upperFirst<T extends string>(str: T): Capitalize<T> {
  return (str ? str[0].toUpperCase() + str.slice(1) : '') as Capitalize<T>;
}
