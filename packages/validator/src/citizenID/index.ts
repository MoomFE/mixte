/**
 * 判断字符串是否是 18 位身份证号码的正则
 *
 * @see https://mixte.moomfe.com/mixte/validator/isCitizenID#isCitizenIDReg
 * @see https://github.com/any86/any-rule
 * @example
 *
 * isCitizenIDReg.test('360602199901239999'); // -> true
 * isCitizenIDReg.test('36060219990123999x'); // -> true
 * isCitizenIDReg.test('36060219990123999X'); // -> true
 * isCitizenIDReg.test('360609999999999999'); // -> false
 */
export const isCitizenIDReg = /^[1-9]\d{5}(?:18|19|20)\d{2}(?:0[1-9]|10|11|12)(?:0[1-9]|[1-2]\d|30|31)\d{3}[\dXx]$/;

/**
 * 判断字符串是否是 18 位身份证号码
 *
 * @see https://mixte.moomfe.com/mixte/validator/isCitizenID#isCitizenID
 * @param value 需要判断的参数
 * @example
 *
 * isCitizenID('360602199901239999'); // -> true
 * isCitizenID('36060219990123999x'); // -> true
 * isCitizenID('36060219990123999X'); // -> true
 * isCitizenID('360609999999999999'); // -> false
 */
export function isCitizenID(value: string): boolean {
  return isCitizenIDReg.test(value);
}
