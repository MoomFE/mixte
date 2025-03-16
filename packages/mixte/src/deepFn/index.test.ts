import { deepFind, deepForEach, deepSome } from 'mixte';

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

  it('查找匹配元素的顺序 - 深度优先', () => {
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

describe('deepSome', () => {
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
    // 检查顶层元素
    expect(deepSome(data, item => item.id === 1)).toBe(true);
    expect(deepSome(data, item => item.id === 2)).toBe(true);
    expect(deepSome(data, 'children', item => item.id === 1)).toBe(true);
    expect(deepSome(data, 'children', item => item.id === 2)).toBe(true);

    // 检查二级元素
    expect(deepSome(data, item => item.id === 3)).toBe(true);
    expect(deepSome(data, item => item.id === 4)).toBe(true);
    expect(deepSome(data, 'children', item => item.id === 3)).toBe(true);
    expect(deepSome(data, 'children', item => item.id === 4)).toBe(true);

    // 检查深层嵌套元素
    expect(deepSome(data, item => item.id === 5)).toBe(true);
    expect(deepSome(data, 'children', item => item.id === 5)).toBe(true);

    // 使用自定义子项键名
    expect(deepSome(data, 'items', item => item.id === 6)).toBe(true);
    expect(deepSome(data, 'items', item => item.id === 8)).toBe(true);

    // 不存在的元素
    expect(deepSome(data, item => item.id === 10)).toBe(false);
    expect(deepSome(data, 'children', item => item.id === 10)).toBe(false);
    expect(deepSome(data, 'items', item => item.id === 10)).toBe(false);
  });

  it('边界情况测试', () => {
    // undefined 输入返回 false
    expect(deepSome(undefined, () => true)).toBe(false);
    expect(deepSome(undefined, 'children', () => true)).toBe(false);

    // 空数组返回 false
    expect(deepSome([], () => true)).toBe(false);
    expect(deepSome([], 'children', () => true)).toBe(false);

    // 空数组子项将被忽略
    expect(deepSome([{ id: 1, children: [] }, { id: 2 }], item => item.id === 2)).toBe(true);
    expect(deepSome([{ id: 1, children: [] }, { id: 2 }], item => item.id === 3)).toBe(false);

    // 非数组子项
    expect(deepSome([{ id: 1, children: 'not an array' }, { id: 2 }], item => item.id === 2)).toBe(true);
    expect(deepSome([{ id: 1, children: 'not an array' }, { id: 2 }], 'children', item => item.id === 2)).toBe(true);
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

    // 测试能否正常检测节点而不陷入无限递归
    expect(deepSome(circularData, item => item.id === 2)).toBe(true);
    expect(deepSome(circularData, item => item.id === 3)).toBe(true);
    expect(deepSome(circularData, item => item.id === 4)).toBe(false);

    // 测试复杂循环引用
    const complexNode1 = { id: 1, children: [] };
    const complexNode2 = { id: 2, children: [] };

    // @ts-expect-error
    complexNode1.children = [complexNode2, complexNode1]; // @ts-expect-error 自引用
    complexNode2.children = [complexNode1, { id: 3 }];

    const complexCircularData = [complexNode1];

    expect(deepSome(complexCircularData, item => item.id === 3)).toBe(true);
    expect(deepSome(complexCircularData, item => item.id === 4)).toBe(false);
  });
});

describe('deepForEach', () => {
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
    // 默认遍历 'children' 键
    const ids: number[] = [];
    deepForEach(data, item => ids.push(item.id));
    expect(ids).toEqual([1, 2, 3, 4, 5]);

    // 遍历 'children' 键
    const childrenIds: number[] = [];
    deepForEach(data, 'children', item => childrenIds.push(item.id));
    expect(childrenIds).toEqual([1, 2, 3, 4, 5]);

    // 使用自定义子项键名 'items'
    const itemIds: number[] = [];
    deepForEach(data, 'items', item => itemIds.push(item.id));
    expect(itemIds).toEqual([1, 2, 6, 7, 8]);
  });

  it('边界情况测试', () => {
    // undefined 输入
    const emptyIds: number[] = [];
    deepForEach(undefined, item => emptyIds.push((item as any).id));
    expect(emptyIds).toEqual([]);

    // 空数组输入
    const emptyArrayIds: number[] = [];
    deepForEach([], item => emptyArrayIds.push((item as any).id));
    expect(emptyArrayIds).toEqual([]);

    // 空数组子项将被忽略
    const simpleIds: number[] = [];
    deepForEach([{ id: 1, children: [] }, { id: 2 }], item => simpleIds.push(item.id));
    expect(simpleIds).toEqual([1, 2]);

    // 非数组子项
    const nonArrayIds: number[] = [];
    deepForEach([{ id: 1, children: 'not an array' }, { id: 2 }], item => nonArrayIds.push(item.id));
    expect(nonArrayIds).toEqual([1, 2]);

    const nonArrayKeysIds: number[] = [];
    deepForEach([{ id: 1, children: 'not an array' }, { id: 2 }], 'children', item => nonArrayKeysIds.push(item.id));
    expect(nonArrayKeysIds).toEqual([1, 2]);
  });

  it('遍历顺序 - 深度优先', () => {
    const nestedData = [
      { id: 1, children: [
        { id: 2, children: [{ id: 3 }] },
        { id: 4 },
      ] },
      { id: 5 },
    ];

    const traversalOrder: number[] = [];
    deepForEach(nestedData, item => traversalOrder.push(item.id));
    expect(traversalOrder).toEqual([1, 2, 3, 4, 5]);
  });

  it('防御循环引用', () => {
    // 创建包含循环引用的数据结构
    const node1 = { id: 1, children: [] };
    const node2 = { id: 2, children: [] };
    const node3 = { id: 3, children: [] };

    // @ts-expect-error 创建循环引用: node1 -> node2 -> node3 -> node1
    node1.children = [node2];
    // @ts-expect-error
    node2.children = [node3];
    // @ts-expect-error
    node3.children = [node1];

    const circularData = [node1];

    // 测试能否正常遍历而不陷入无限递归
    const circularIds: number[] = [];
    deepForEach(circularData, item => circularIds.push(item.id));
    expect(circularIds).toEqual([1, 2, 3]);

    // 测试复杂循环引用
    const complexNode1 = { id: 1, children: [] };
    const complexNode2 = { id: 2, children: [] };
    const complexNode3 = { id: 3 };

    // @ts-expect-error
    complexNode1.children = [complexNode2, complexNode1]; // 自引用
    // @ts-expect-error
    complexNode2.children = [complexNode1, complexNode3];

    const complexCircularData = [complexNode1];

    const complexIds: number[] = [];
    deepForEach(complexCircularData, item => complexIds.push(item.id));
    expect(complexIds).toEqual([1, 2, 3]);
  });
});
