import { columnIsFixedLeft, columnIsFixedRight, defineTableColumns, isSameKeySet } from './utils';

describe('grid-table/utils', () => {
  it('defineTableColumns 原样返回列配置', () => {
    const columns = [
      { field: 'name', title: '姓名' },
    ];

    expect(defineTableColumns(columns)).toBe(columns);
  });

  it('columnIsFixedLeft / columnIsFixedRight 判断列的固定方向', () => {
    expect(columnIsFixedLeft({ field: 'a', fixed: true })).toBe(true);
    expect(columnIsFixedLeft({ field: 'a', fixed: 'left' })).toBe(true);
    expect(columnIsFixedLeft({ field: 'a', fixed: 'right' })).toBe(false);
    expect(columnIsFixedLeft({ field: 'a' })).toBe(false);

    expect(columnIsFixedRight({ field: 'a', fixed: 'right' })).toBe(true);
    expect(columnIsFixedRight({ field: 'a', fixed: true })).toBe(false);
    expect(columnIsFixedRight({ field: 'a', fixed: 'left' })).toBe(false);
    expect(columnIsFixedRight({ field: 'a' })).toBe(false);
  });

  it('isSameKeySet 无序比较两个 keys 集合', () => {
    // 数量不一致
    expect(isSameKeySet(new Set(['1']), new Set(['1', '2']))).toBe(false);

    // 数量一致, 但内容不一致
    expect(isSameKeySet(new Set(['1', '2']), new Set(['1', '3']))).toBe(false);

    // 数量一致且内容一致, 与顺序无关
    expect(isSameKeySet(new Set(['1', '2']), new Set(['2', '1']))).toBe(true);

    // 空集合
    expect(isSameKeySet(new Set(), new Set())).toBe(true);
  });
});
