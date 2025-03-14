import { deepFind } from 'mixte';

describe('deepFind', () => {
  // 基本测试数据
  const data = [
    { id: 1 },
    {
      id: 2,
      children: [
        { id: 3 },
        { id: 4, children: [{ id: 5 }] },
      ],
      items: [
        { id: 6 },
        { id: 7, items: [{ id: 8 }] },
      ],
    },
  ];

  it('基本功能测试', () => {
    // 查找顶层元素
    expect(deepFind(data, item => item.id === 1)).toStrictEqual({ id: 1 });
    expect(deepFind(data, item => item.id === 2)).toBe(data[1]);
    expect(deepFind(data, 'children', item => item.id === 1)).toStrictEqual({ id: 1 });
    expect(deepFind(data, 'children', item => item.id === 2)).toBe(data[1]);

    // 查找二级元素
    expect(deepFind(data, item => item.id === 3)).toStrictEqual({ id: 3 });
    expect(deepFind(data, item => item.id === 4)).toBe(data[1].children![1]);
    expect(deepFind(data, 'children', item => item.id === 3)).toStrictEqual({ id: 3 });
    expect(deepFind(data, 'children', item => item.id === 4)).toBe(data[1].children![1]);

    // 查找深层嵌套元素
    expect(deepFind(data, item => item.id === 5)).toStrictEqual({ id: 5 });
    expect(deepFind(data, 'children', item => item.id === 5)).toStrictEqual({ id: 5 });

    // 使用自定义子项键名
    expect(deepFind(data, 'items', item => item.id === 6)).toStrictEqual({ id: 6 });
    expect(deepFind(data, 'items', item => item.id === 7)).toBe(data[1].items![1]);
  });

  it('边界情况测试', () => {
    // undefined 输入返回 undefined
    expect(deepFind(undefined, () => true)).toBeUndefined();
    expect(deepFind(undefined, 'children', () => true)).toBeUndefined();

    // 元素不存在时返回 undefined
    expect(deepFind(data, item => item.id === 10)).toBeUndefined();
    expect(deepFind(data, 'children', item => item.id === 10)).toBeUndefined();

    // 空数组返回 undefined
    expect(deepFind([], () => true)).toBeUndefined();
    expect(deepFind([], 'children', () => true)).toBeUndefined();

    // 空数组子项将被忽略
    expect(deepFind([{ id: 1, children: [] }, { id: 2 }], item => item.id === 2)).toEqual({ id: 2 });
    expect(deepFind([{ id: 1, children: [] }, { id: 2 }], 'children', item => item.id === 2)).toEqual({ id: 2 });

    // 非数组子项
    expect(deepFind([{ id: 1, children: 'not an array' }, { id: 2 }], item => item.id === 2)).toEqual({ id: 2 });
    expect(deepFind([{ id: 1, children: 'not an array' }, { id: 2 }], 'children', item => item.id === 2)).toEqual({ id: 2 });
  });

  it('默认查找匹配元素的顺序', () => {
    const dataWithDuplicates = [
      { id: 1, children: [{ id: 2 }] },
      { id: 2, children: [{ id: 3 }] },
    ];

    expect(deepFind(dataWithDuplicates, item => item.id === 2)).toEqual({ id: 2 });
    expect(deepFind(dataWithDuplicates, 'children', item => item.id === 2)).toEqual({ id: 2 });
  });

  it('防御循环引用', () => {
    // 创建包含循环引用的数据结构
    const node1 = { id: 1, children: [] };
    const node2 = { id: 2, children: [] };
    const node3 = { id: 3, children: [] };

    // @ts-expect-error 创建循环引用: node1 -> node2 -> node3 -> node1
    node1.children = [node2]; // @ts-expect-error
    node2.children = [node3]; // @ts-expect-error
    node3.children = [node1];

    const circularData = [node1];

    // 测试能否正常找到节点而不陷入无限递归
    expect(deepFind(circularData, item => item.id === 2)).toBe(node2);
    expect(deepFind(circularData, item => item.id === 3)).toBe(node3);

    // 测试找不到的情况
    expect(deepFind(circularData, item => item.id === 4)).toBeUndefined();

    // 测试复杂循环引用
    const complexNode1 = { id: 1, children: [] };
    const complexNode2 = { id: 2, children: [] };

    // @ts-expect-error
    complexNode1.children = [complexNode2, complexNode1]; // @ts-expect-error 自引用
    complexNode2.children = [complexNode1, { id: 3 }];

    const complexCircularData = [complexNode1];

    expect(deepFind(complexCircularData, item => item.id === 3)).toEqual({ id: 3 });
  });
});
