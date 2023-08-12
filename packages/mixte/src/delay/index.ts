/**
 * 返回一个延迟指定时间的 Promise
 * @param ms 延迟时间 ( default: 1000 )
 * @example
 *
 * await delay(1000); // 延迟 1 秒
 */
export function delay(ms = 1000) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

/**
 * 返回一个延迟指定时间的 Promise
 * @param ms 延迟时间 ( default: 1000 )
 * @example
 *
 * await wait(1000); // 延迟 1 秒
 */
export const wait = delay;
