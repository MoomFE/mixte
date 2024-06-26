import { isBoolean } from 'mixte';

/**
 * 在传入的两个自然数之间随机生成一个自然数
 *
 * @see https://mixte.moomfe.com/mixte/random#randomNatural
 * @param from 最小的自然数
 * @param to 最大的自然数
 * @example
 *
 * randomNatural(0, 10); // -> 0 ~ 10
 */
export function randomNatural(from: number, to: number) {
  return Math.floor(
    Math.random() * (to - from + 1) + from,
  );
}

/**
 * 在传入的两个数字之间随机生成一个数字
 *
 * @see https://mixte.moomfe.com/mixte/random#random
 * @param from 第一个数字
 * @param to 第二个数字
 * @example
 *
 * random(0, 10); // -> 0 ~ 10
 * random(10, 0); // -> 0 ~ 10
 * random(-10, 10); // -> -10 ~ 10
 */
export function random(from: number, to: number): number;
/**
 * 在 0 和传入数字之间随机生成一个数字
 *  - 当前传入了一个参数
 *  - 传入两个参数时, 在传入的两个数字之间随机生成一个数字
 *
 * @see https://mixte.moomfe.com/mixte/random#random
 * @param to 传入的数字
 * @example
 *
 * random(10); // -> 0 ~ 10
 * random(-10); // -> -10 ~ 0
 */
export function random(to: number): number;
/**
 * 在 0 和 10 之间随机生成一个数字
 *  - 当前未传参数
 *  - 传入一个参数时, 在 0 和传入数字之间随机生成一个数字
 *  - 传入两个参数时, 在传入的两个数字之间随机生成一个数字
 *
 * @see https://mixte.moomfe.com/mixte/random#random
 * @example
 *
 * random(); // -> 0 ~ 10
 */
export function random(): number;
export function random(...args: number[]) {
  let [from = 0, to = 10] = args;

  if (args.length === 1)
    [from, to] = [0, from];

  if (from > to)
    [from, to] = [to, from];

  if (from >= 0)
    return randomNatural(from, to);

  const result = randomNatural(0, to + Math.abs(from));

  if (result > to)
    return to - result;

  return result;
}

/**
 * 随机一个小写英文字母
 *
 * @see https://mixte.moomfe.com/mixte/random#randomLowercaseLetter
 * @example
 *
 * randomLowercaseLetter(); // -> a ~ z
 */
export function randomLowercaseLetter() {
  return String.fromCharCode(randomNatural(97, 122));
}

/**
 * 随机一个大写英文字母
 *
 * @see https://mixte.moomfe.com/mixte/random#randomUppercaseLetter
 * @example
 *
 * randomUppercaseLetter(); // -> A ~ Z
 */
export function randomUppercaseLetter() {
  return String.fromCharCode(randomNatural(65, 90));
}

/**
 * 随机一个英文字母
 *
 * @see https://mixte.moomfe.com/mixte/random#randomLetter
 * @param uppercase 是否大写
 * @example
 *
 * randomLetter(); // -> a ~ z, A ~ Z
 * randomLetter(true); // -> A ~ Z
 * randomLetter(false); // -> a ~ z
 */
export function randomLetter(uppercase?: boolean) {
  if (isBoolean(uppercase)) {
    return uppercase
      ? randomUppercaseLetter()
      : randomLowercaseLetter();
  }

  return randomBoolean()
    ? randomLowercaseLetter()
    : randomUppercaseLetter();
}

/** 生成字符串的选项 */
interface RandomStringOptions {
  /** 是否包含小写字母 ( default: true ) */
  lowercase?: boolean;
  /** 是否包含大写字母 ( default: false ) */
  uppercase?: boolean;
  /** 是否包含数字 ( default: false ) */
  number?: boolean;
}

/**
 * 生成一个随机的字符串
 *
 * @see https://mixte.moomfe.com/mixte/random#randomString
 * @param length 字符串的长度 ( default: 12 )
 * @param options 生成字符串的选项
 * @example
 *
 * randomString(); // -> 默认生成 12 位的仅有小写字母的字符串
 * randomString(18, { uppercase: true }) // -> 生成 18 位的包含小写字母和大写字母的字符串
 * randomString(18, { uppercase: true, number: true }) // -> 生成 18 位的包含小写字母、大写字母和数字的字符串
 * randomString(18, { uppercase: true, number: true, lowercase: false }) // -> 生成 18 位的包含大写字母和数字的字符串
 */
export function randomString(length = 12, options: RandomStringOptions = {}) {
  const { lowercase = true, uppercase = false, number = false } = options;
  const types = [];
  let typesLength: number;

  if (lowercase) types.push('l');
  if (uppercase) types.push('u');
  if (number) types.push('n');

  if (!(typesLength = types.length)) throw new Error('???');

  let result = '';

  while (length-- > 0) {
    const typeIndex = typesLength > 1 ? randomNatural(0, typesLength - 1) : 0;
    const type = types[typeIndex];

    if (type === 'l') result += randomLowercaseLetter();
    else if (type === 'u') result += randomUppercaseLetter();
    else if (type === 'n') result += randomNatural(0, 9);
  }

  return result;
}

/**
 * 生成一个随机的 boolean 值
 *
 * @see https://mixte.moomfe.com/mixte/random#randomBoolean
 * @example
 *
 * randomBoolean(); // -> true or false
 */
export function randomBoolean() {
  return Math.random() < 0.5;
}
