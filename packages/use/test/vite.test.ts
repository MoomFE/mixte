import { MixteUseAutoImport } from '@mixte/use/vite';

beforeAll(() => {
  vi.resetModules();
});

describe('MixteUseAutoImport', () => {
  test('方法返回一个 key 为 @mixte/use 的对象', () => {
    const result = MixteUseAutoImport();

    expect(result).toHaveProperty('@mixte/use');
    expect(Object.keys(result).length).toBe(1);
  });

  test('默认情况下返回所有导出的方法', async () => {
    const mixteUse = Object.keys(await import('@mixte/use')).sort();
    const autoImport = MixteUseAutoImport()['@mixte/use'].sort();

    expect(autoImport).toEqual(mixteUse);
  });
});
