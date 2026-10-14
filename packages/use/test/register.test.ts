import * as mixteUse from '@mixte/use';
import { MixteUseAutoImport } from '@mixte/use/register';
import * as vueuse from '@vueuse/core';

describe('mixteUseAutoImport', () => {
  it('方法返回一个指向 @mixte/use 的 preset, 并带有高于默认值的 priority', () => {
    const result = MixteUseAutoImport();

    expect(result.from).toBe('@mixte/use');
    expect(result.priority).toBeGreaterThan(1);
  });

  it('默认情况下返回所有导出的方法', () => {
    const autoImport = [...MixteUseAutoImport().imports].sort();
    const mixteUseExports = Object.keys(mixteUse).sort();

    expect(autoImport).toStrictEqual(mixteUseExports);
  });

  it('支持传入 `useWithVueUseCore` 选项标识是和 `@vueuse/core` 一起使用的场景, 会排除与 `@vueuse/core` 功能相同且名称相同的方法 ( 不包括 useCountdown, 因功能不同 )', () => {
    const autoImport = [...MixteUseAutoImport({ useWithVueUseCore: true }).imports].sort();
    const mixteUseExports = Object.keys(mixteUse).sort();
    const vueuseExports = Object.keys(vueuse).sort();

    expect(autoImport).not.toStrictEqual(mixteUseExports);

    // 排除了 `@vueuse/core` 中功能相同且名称相同的方法
    autoImport.forEach((name) => {
      if (['useCountdown'].includes(name as string)) return;

      expect(vueuseExports).not.toContain(name);
    });

    // 默认导出中含有与 `@vueuse/core` 名称相同的方法
    let count = 0;

    mixteUseExports.forEach((name) => {
      if (vueuseExports.includes(name)) count++;
    });

    expect(count > 0).toBe(true);
  });
});
