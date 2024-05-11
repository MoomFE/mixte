import { isMobile, isMobileReg } from '@mixte/validator';

describe('isMobile', () => {
  it('isMobile', () => {
    expect(isMobile('10000000000')).toBe(false);
    expect(isMobile('11111111111')).toBe(false);
    expect(isMobile('12222222222')).toBe(false);
    expect(isMobile('13333333333')).toBe(true);
    expect(isMobile('14444444444')).toBe(true);
    expect(isMobile('15555555555')).toBe(true);
    expect(isMobile('16666666666')).toBe(true);
    expect(isMobile('17777777777')).toBe(true);
    expect(isMobile('18888888888')).toBe(true);
    expect(isMobile('19999999999')).toBe(true);
    expect(isMobile('12345678900')).toBe(false);
  });

  it('isMobile: 长度测试', () => {
    expect(isMobile('166666666')).toBe(false);
    expect(isMobile('1666666666')).toBe(false);
    expect(isMobile('16666666666')).toBe(true);
    expect(isMobile('166666666666')).toBe(false);
    expect(isMobile('1666666666666')).toBe(false);
  });

  it('isMobileReg', () => {
    expect(isMobileReg.test('10000000000')).toBe(false);
    expect(isMobileReg.test('11111111111')).toBe(false);
    expect(isMobileReg.test('12222222222')).toBe(false);
    expect(isMobileReg.test('13333333333')).toBe(true);
    expect(isMobileReg.test('14444444444')).toBe(true);
    expect(isMobileReg.test('15555555555')).toBe(true);
    expect(isMobileReg.test('16666666666')).toBe(true);
    expect(isMobileReg.test('17777777777')).toBe(true);
    expect(isMobileReg.test('18888888888')).toBe(true);
    expect(isMobileReg.test('19999999999')).toBe(true);
    expect(isMobileReg.test('12345678900')).toBe(false);
  });

  it('isMobileReg: 长度测试', () => {
    expect(isMobileReg.test('166666666')).toBe(false);
    expect(isMobileReg.test('1666666666')).toBe(false);
    expect(isMobileReg.test('16666666666')).toBe(true);
    expect(isMobileReg.test('166666666666')).toBe(false);
    expect(isMobileReg.test('1666666666666')).toBe(false);
  });
});
