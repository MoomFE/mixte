/**
 * 移动数组内的某个元素到指定的下标位置
 *
 * @see https://mixte.moomfe.com/mixte/move#move
 * @param array 数组
 * @param from 要移动的元素的下标
 * @param to 要移动到的位置的下标
 */
export function move<T>(array: T[], from: number, to: number) {
  array.splice(
    to,
    0,
    array.splice(from, 1)[0],
  );
  return array;
}

/**
 * 移动数组内一个范围内的元素到指定的下标位置
 *
 * @see https://mixte.moomfe.com/mixte/move#moveRange
 * @param array 数组
 * @param start 要移动的元素的起始下标
 * @param moveCount 要移动的元素的个数
 * @param to 要移动到的位置的下标
 */
export function moveRange<T>(array: T[], start: number, moveCount: number, to: number) {
  array.splice(
    to,
    0,
    ...array.splice(start, moveCount),
  );
  return array;
}
