import { MixteUseAutoImport } from '@mixte/use/register';

describe('mixteUseAutoImport', () => {
  it('方法返回一个 key 为 @mixte/use 的对象', () => {
    const result = MixteUseAutoImport();

    expect(result).toHaveProperty('@mixte/use');
    expect(Object.keys(result)).toHaveLength(1);
  });

  it('默认情况下返回所有导出的方法', async () => {
    const autoImport = MixteUseAutoImport()['@mixte/use'].sort();
    const mixteUse = Object.keys(await import('@mixte/use')).sort();

    expect(autoImport).toStrictEqual(mixteUse);
  });

  it('支持传入 `useWithVueUseCore` 选项标识是和 `@vueuse/core` 一起使用的场景, 会排除与 `@vueuse/core` 功能相同且名称相同的方法 ( 不包括 useCountdown, 因功能不同 )', async () => {
    const autoImport = MixteUseAutoImport({ useWithVueUseCore: true })['@mixte/use'].sort();
    const mixteUse = Object.keys(await import('@mixte/use')).sort();
    const vueuse = Object.keys(await import('@vueuse/core')).sort();

    expect(autoImport).not.toStrictEqual(mixteUse);

    // 排除了 `@vueuse/core` 中功能相同且名称相同的方法
    autoImport.forEach((name) => {
      if (['useCountdown'].includes(name as string)) return;

      expect(vueuse).not.toContain(name);
    });

    // 默认导出中含有与 `@vueuse/core` 名称相同的方法
    let count = 0;

    mixteUse.forEach((name) => {
      if (vueuse.includes(name)) count++;
    });

    expect(count > 0).toBe(true);
  });
});
