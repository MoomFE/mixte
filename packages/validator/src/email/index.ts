/**
 * 判断字符串是否是电子邮件地址的正则
 *
 * @see https://mixte.moomfe.com/mixte/validator/email
 * @see https://emailregex.com
 * @example
 *
 * isEmailReg.test('test@example.com'); // -> true
 * isEmailReg.test('john.doe@example.co.uk'); // -> true
 * isEmailReg.test('notanemail'); // -> false
 * isEmailReg.test('user@'); // -> false
 * isEmailReg.test('user@example'); // -> false
 * isEmailReg.test('user@example.'); // -> false
 * isEmailReg.test('user@example..com'); // -> false
 */
export const isEmailReg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

/**
 * 判断字符串是否是电子邮件地址
 *
 * @see https://mixte.moomfe.com/mixte/validator/email
 * @param value 需要判断的参数
 * @example
 *
 * isEmail('test@example.com'); // -> true
 * isEmail('john.doe@example.co.uk'); // -> true
 * isEmail('notanemail'); // -> false
 * isEmail('user@'); // -> false
 * isEmail('user@example'); // -> false
 * isEmail('user@example.'); // -> false
 * isEmail('user@example..com'); // -> false
 */
export function isEmail(value: string): boolean {
  return isEmailReg.test(value);
}
