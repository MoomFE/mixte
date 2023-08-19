import { isFunction, isNumeric } from 'mixte';

/**
 * 对传入方法进行参数定义, 返回一个新方法
 * @param func 需要进行参数定义的方法
 * @param oArgs 参数定义
 * @example
 * const timeout = defineArgs(setTimeout, {
 *   0: 1000,
 * });
 *
 * timeout(() => { ... }); // -> 1000ms 后执行
 * timeout(() => { ... }); // -> 1000ms 后执行
 */
export function defineArgs<T>(
  func: (...args: any[]) => T,
  oArgs: Record<number, any>,
) {
  return function (...userArgs: any[]) {
    const args: any[] = [];
    const maxOArgsIndex = Math.max(...Object.keys(oArgs).filter(isNumeric).map(Number));

    let userArgsIndex = 0;
    let index = 0;

    for (; index <= maxOArgsIndex || userArgsIndex < userArgs.length; index++) {
      let value;

      if (index in oArgs) {
        value = oArgs[index];
        value = isFunction(value) ? value() : value;
      }
      else {
        value = userArgs[userArgsIndex++];
      }

      args.push(value);
    }

    return func(...args);
  };
}
