import type { IsNever, Primitive, Simplify, SimplifyDeep, TupleOf, UnionToIntersection, UnknownArray } from 'type-fest';
import { get, set, toArray } from 'mixte';

/**
 * 从对象中选择指定属性
 *
 * @see https://mixte.moomfe.com/mixte/pick#pick
 * @param obj 对象
 * @param keys 要选择的属性，可以是数组或单个键
 * @example
 *
 * pick({ a: 1, b: 2, c: 3 }, ['a', 'c']); // -> { a: 1, c: 3 }
 * pick({ a: 1, b: 2, c: 3 }, 'a'); // -> { a: 1 }
 */
export function pick<T extends object, K extends keyof T>(
  obj: T,
  keys: (K | (string & {}))[] | readonly (K | (string & {}))[] | (K | (string & {})),
): Pick<T, K> {
  if (!obj) return {} as Pick<T, K>;

  const result: Record<string, any> = {};
  const keysArray = toArray(keys);

  for (const key of keysArray) {
    if (key as keyof T in obj) {
      result[key as string] = obj[key as keyof T];
    }
  }

  return result as Pick<T, K>;
}

/**
 * 从对象中排除指定属性
 *
 * @see https://mixte.moomfe.com/mixte/pick#omit
 * @param obj 对象
 * @param keys 要排除的属性，可以是数组或单个键
 * @example
 *
 * omit({ a: 1, b: 2, c: 3 }, ['a', 'c']); // -> { b: 2 }
 * omit({ a: 1, b: 2, c: 3 }, 'a'); // -> { b: 2, c: 3 }
 */
export function omit<T extends object, K extends keyof T>(
  obj: T,
  keys: (K | (string & {}))[] | readonly (K | (string & {}))[] | (K | (string & {})),
): Omit<T, K> {
  if (!obj) return {} as Omit<T, K>;

  const result = { ...obj };
  const keysArray = toArray(keys);

  for (const key of keysArray) {
    delete result[key as keyof T];
  }

  return result as Omit<T, K>;
}

/** 深层选取时不再继续递归的叶子类型 */
type NonDeepType
  = | Primitive
    | void
    | Date
    | RegExp
    | ((...args: any[]) => unknown)
    | (new (...args: any[]) => unknown)
    | Promise<unknown>;

/** 取出对象上指定键的值类型 ( 兼容数字字面量的字符串形式 ) */
type DeepObjectValue<T, K extends string | number>
  = K extends keyof T
    ? T[K]
    : `${K}` extends keyof T
      ? T[`${K}` & keyof T]
      : K extends `${infer NumberKey extends number}`
        ? NumberKey extends keyof T
          ? T[NumberKey]
          : never
        : never;

/** 构建仅含指定键的对象类型 ( 保留该键在原对象上的可选 / 只读修饰 ) */
type BuildDeepObject<Key extends string | number, Value, CopiedFrom extends object>
  = Key extends keyof CopiedFrom
    ? Pick<{ [_ in keyof CopiedFrom]: Value }, Key>
    : Key extends `${infer NumberKey extends number}`
      ? NumberKey extends keyof CopiedFrom
        ? Pick<{ [_ in keyof CopiedFrom]: Value }, NumberKey>
        : { [_ in Key]: Value }
      : { [_ in Key]: Value };

/** 深层选取对象上的单个路径 */
type PickDeepObject<T extends object, P extends string | number>
  = P extends `${infer Key}.${infer SubPath}`
    ? DeepObjectValue<T, Key> extends infer V
      ? IsNever<V> extends false
        ? BuildDeepObject<Key, InternalPickDeep<NonNullable<V>, SubPath>, T>
        : never
      : never
    : DeepObjectValue<T, P> extends infer V
      ? IsNever<V> extends false
        ? BuildDeepObject<P, V, T>
        : never
      : never;

/** 深层选取数组上的单个路径 ( 索引超出数组长度时补全元组 ) */
type PickDeepArray<T extends UnknownArray, P extends string | number>
  = P extends `${infer ArrayIndex extends number}.${infer SubPath}`
    ? number extends ArrayIndex
      ? T extends unknown[]
        ? Array<InternalPickDeep<NonNullable<T[number]>, SubPath>>
        : T extends readonly unknown[]
          ? ReadonlyArray<InternalPickDeep<NonNullable<T[number]>, SubPath>>
          : never
      : T extends unknown[]
        ? [...TupleOf<ArrayIndex>, InternalPickDeep<NonNullable<T[ArrayIndex]>, SubPath>]
        : T extends readonly unknown[]
          ? readonly [...TupleOf<ArrayIndex>, InternalPickDeep<NonNullable<T[ArrayIndex]>, SubPath>]
          : never
    : P extends `${infer ArrayIndex extends number}`
      ? number extends ArrayIndex
        ? T
        : T extends unknown[]
          ? [...TupleOf<ArrayIndex>, T[ArrayIndex]]
          : T extends readonly unknown[]
            ? readonly [...TupleOf<ArrayIndex>, T[ArrayIndex]]
            : never
      : never;

/** 深层选取的单个路径 ( 按对象 / 数组分发 ) */
type InternalPickDeep<T, P extends string | number>
  = T extends NonDeepType
    ? never
    : T extends UnknownArray
      ? PickDeepArray<T, P>
      : T extends object
        ? Simplify<PickDeepObject<T, P>>
        : never;

/**
 * 从对象中选择指定深层属性的结果类型 ( 支持任意深度的路径 )
 *
 * - 参考自 type-fest 的 PickDeep: type-fest v5 依赖 Paths 枚举校验路径, 存在最大 10 层的硬上限
 * - 本实现按传入路径逐段递归, 不受深度限制
 */
type PickDeepUnbounded<T, PathUnion extends string | number>
  = T extends NonDeepType
    ? never
    : T extends UnknownArray
      ? UnionToIntersection<{ [P in PathUnion]: InternalPickDeep<T, P> }[PathUnion]>
      : T extends object
        ? SimplifyDeep<UnionToIntersection<{ [P in PathUnion]: InternalPickDeep<T, P> }[PathUnion]>>
        : never;

/**
 * 从对象中选择指定的深层属性
 *
 * @see https://mixte.moomfe.com/mixte/pick#pickdeep
 * @param obj 对象
 * @param keys 要选择的属性路径, 可以是数组或单个路径字符串
 *
 * @example
 *
 * const obj = {
 *   a: {
 *     b: 2,
 *     c: 3
 *   },
 *   d: 4
 * };
 *
 * pickDeep(obj, ['a.b', 'd']); // -> { a: { b: 2 }, d: 4 }
 * pickDeep(obj, 'a.c'); // -> { a: { c: 3 } }
 */
export function pickDeep<
  T extends object,
  K extends string | number,
>(
  obj: T,
  keys: (K | (string & {}))[] | readonly (K | (string & {}))[] | (K | (string & {})),
): PickDeepUnbounded<T, K> {
  if (!obj) return {} as PickDeepUnbounded<T, K>;

  const result: Record<string, any> = {};
  const keysArray = toArray<string>(keys as string | string[]);

  for (const rawPath of keysArray) {
    set(result, rawPath, get(obj, rawPath));
  }

  return result as PickDeepUnbounded<T, K>;
}
