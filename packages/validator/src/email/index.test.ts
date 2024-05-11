import { isEmail, isEmailReg } from '@mixte/validator';

describe('isEmail', () => {
  it('isEmail', () => {
    expect(isEmail('test@example.com')).toBe(true);
    expect(isEmail('john.doe@example.co.uk')).toBe(true);
    expect(isEmail('notanemail')).toBe(false);
    expect(isEmail('user@')).toBe(false);
    expect(isEmail('user@example')).toBe(false);
    expect(isEmail('user@example.')).toBe(false);
    expect(isEmail('user@example..com')).toBe(false);
  });

  it('isEmailReg', () => {
    expect(isEmailReg.test('test@example.com')).toBe(true);
    expect(isEmailReg.test('john.doe@example.co.uk')).toBe(true);
    expect(isEmailReg.test('notanemail')).toBe(false);
    expect(isEmailReg.test('user@')).toBe(false);
    expect(isEmailReg.test('user@example')).toBe(false);
    expect(isEmailReg.test('user@example.')).toBe(false);
    expect(isEmailReg.test('user@example..com')).toBe(false);
  });
});
