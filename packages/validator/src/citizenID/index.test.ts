import { isCitizenID, isCitizenIDReg } from '@mixte/validator';

describe('isCitizenID', () => {
  it('isCitizenID', () => {
    expect(isCitizenID('360602199901239999')).toBe(true);
    expect(isCitizenID('36060219990123999x')).toBe(true);
    expect(isCitizenID('36060219990123999X')).toBe(true);
    expect(isCitizenID('360609999999999999')).toBe(false);
    expect(isCitizenID('36060999999999999x')).toBe(false);
    expect(isCitizenID('36060999999999999X')).toBe(false);
  });

  it('isCitizenID: 年份测试', () => {
    expect(isCitizenID('360602179901239999')).toBe(false);
    expect(isCitizenID('360602189901239999')).toBe(true);
    expect(isCitizenID('360602199901239999')).toBe(true);
    expect(isCitizenID('360602209901239999')).toBe(true);
    expect(isCitizenID('360602219901239999')).toBe(false);
  });

  it('isCitizenIDReg', () => {
    expect(isCitizenIDReg.test('360602199901239999')).toBe(true);
    expect(isCitizenIDReg.test('36060219990123999x')).toBe(true);
    expect(isCitizenIDReg.test('36060219990123999X')).toBe(true);
    expect(isCitizenIDReg.test('360609999999999999')).toBe(false);
    expect(isCitizenIDReg.test('36060999999999999x')).toBe(false);
    expect(isCitizenIDReg.test('36060999999999999X')).toBe(false);
  });

  it('isCitizenIDReg: 年份测试', () => {
    expect(isCitizenIDReg.test('360602179901239999')).toBe(false);
    expect(isCitizenIDReg.test('360602189901239999')).toBe(true);
    expect(isCitizenIDReg.test('360602199901239999')).toBe(true);
    expect(isCitizenIDReg.test('360602209901239999')).toBe(true);
    expect(isCitizenIDReg.test('360602219901239999')).toBe(false);
  });
});
