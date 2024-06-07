/**
 * 判断字符串是否是移动电话号码的正则
 *
 * @see https://mixte.moomfe.com/mixte/validator/mobile
 * @see https://github.com/any86/any-rule
 * @example
 *
 * isMobileReg.test('16666666666'); // -> true
 * isMobileReg.test('12345678900'); // -> false
 */
export const isMobileReg = /^1[3-9]\d{9}$/;

/**
 * 判断字符串是否是移动电话号码
 *
 * @see https://mixte.moomfe.com/mixte/validator/mobile
 * @param value 需要判断的参数
 * @example
 *
 * isMobile('16666666666'); // -> true
 * isMobile('12345678900'); // -> false
 */
export function isMobile(value: string): boolean {
  return isMobileReg.test(value);
}
