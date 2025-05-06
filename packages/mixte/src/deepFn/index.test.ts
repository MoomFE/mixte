import { deepFind, deepForEach, deepSome } from 'mixte';

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
  [
    { id: 9 },
    {
      id: 10,
      children: [
        { id: 11 },
        { id: 12, children: [{ id: 13 }] },
      ],
      items: [
        { id: 14 },
        { id: 15, items: [{ id: 16 }] },
      ],
    },
    [
      {
        id: 18,
        children: [{ id: 19 }],
        items: [{ id: 20 }],
      },
    ],
  ],
];

describe('deepFind', () => {
  it('基本功能测试', () => {
    // 查找顶层元素
    expect(deepFind(data, item => item.id === 1)).toStrictEqual({ id: 1 });
    expect(deepFind(data, item => item.id === 2)).toBe(data[1]);
    expect(deepFind(data, 'children', item => item.id === 1)).toStrictEqual({ id: 1 });
    expect(deepFind(data, 'children', item => item.id === 2)).toBe(data[1]);
    // 查找顶层元素 ( 使用不符合的子项键名, 顶层元素, 用不到子项键名就可以匹配到 )
    expect(deepFind(data, 'items', item => item.id === 1)).toStrictEqual({ id: 1 });
    expect(deepFind(data, 'items', item => item.id === 2)).toBe(data[1]);
    expect(deepFind(data, 'xxx', item => item.id === 1)).toStrictEqual({ id: 1 });
    expect(deepFind(data, 'xxx', item => item.id === 2)).toBe(data[1]);

    // 查找二级元素
    expect(deepFind(data, item => item.id === 3)).toStrictEqual({ id: 3 }); // @ts-expect-error
    expect(deepFind(data, item => item.id === 4)).toBe(data[1].children![1]);
    expect(deepFind(data, 'children', item => item.id === 3)).toStrictEqual({ id: 3 }); // @ts-expect-error
    expect(deepFind(data, 'children', item => item.id === 4)).toBe(data[1].children![1]);
    // 查找二级元素 ( 使用不符合的子项键名 )
    expect(deepFind(data, 'items', item => item.id === 3)).toBeUndefined();
    expect(deepFind(data, 'items', item => item.id === 4)).toBeUndefined();
    expect(deepFind(data, 'xxx', item => item.id === 3)).toBeUndefined();
    expect(deepFind(data, 'xxx', item => item.id === 4)).toBeUndefined();

    // 查找深层嵌套元素
    expect(deepFind(data, item => item.id === 5)).toStrictEqual({ id: 5 });
    expect(deepFind(data, 'children', item => item.id === 5)).toStrictEqual({ id: 5 });
    // 查找深层嵌套元素 ( 使用不符合的子项键名 )
    expect(deepFind(data, 'items', item => item.id === 5)).toBeUndefined();
    expect(deepFind(data, 'xxx', item => item.id === 5)).toBeUndefined();

    // 使用自定义子项键名
    expect(deepFind(data, 'items', item => item.id === 6)).toStrictEqual({ id: 6 }); // @ts-expect-error
    expect(deepFind(data, 'items', item => item.id === 7)).toBe(data[1].items![1]);
    // 使用自定义子项键名 ( 使用不符合的子项键名 )
    expect(deepFind(data, 'children', item => item.id === 6)).toBeUndefined();
    expect(deepFind(data, 'children', item => item.id === 7)).toBeUndefined();
    expect(deepFind(data, 'xxx', item => item.id === 6)).toBeUndefined();
    expect(deepFind(data, 'xxx', item => item.id === 7)).toBeUndefined();

    // 不存在的元素
    expect(deepFind(data, item => item.id === 100)).toBeUndefined();
    expect(deepFind(data, 'children', item => item.id === 100)).toBeUndefined();
    expect(deepFind(data, 'items', item => item.id === 100)).toBeUndefined();
    expect(deepFind(data, 'xxx', item => item.id === 100)).toBeUndefined();
  });

  describe('对于嵌套数组结构的支持', () => {
    it('正常传参', () => {
      // 单层嵌套
      expect(deepFind(data, item => item.id === 9, { nestedArray: true })).toStrictEqual({ id: 9 });
      expect(deepFind(data, item => item.id === 10, { nestedArray: true })).toBe((data[2] as any[])[1]);
      // 单层嵌套 ( 使用不符合的子项键名, 单层嵌套, 用不到子项键名就可以匹配到 )
      expect(deepFind(data, 'children', item => item.id === 9, { nestedArray: true })).toStrictEqual({ id: 9 });
      expect(deepFind(data, 'children', item => item.id === 10, { nestedArray: true })).toBe((data[2] as any[])[1]);
      expect(deepFind(data, 'items', item => item.id === 9, { nestedArray: true })).toStrictEqual({ id: 9 });
      expect(deepFind(data, 'items', item => item.id === 10, { nestedArray: true })).toBe((data[2] as any[])[1]);
      expect(deepFind(data, 'xxx', item => item.id === 9, { nestedArray: true })).toStrictEqual({ id: 9 });
      expect(deepFind(data, 'xxx', item => item.id === 10, { nestedArray: true })).toBe((data[2] as any[])[1]);

      // 查找单层嵌套下的深层嵌套元素
      expect(deepFind(data, item => item.id === 11, { nestedArray: true })).toStrictEqual({ id: 11 });
      expect(deepFind(data, item => item.id === 12, { nestedArray: true })).toBe((data[2] as any[])[1].children![1]);
      expect(deepFind(data, item => item.id === 13, { nestedArray: true })).toBe((data[2] as any[])[1].children![1].children![0]);
      expect(deepFind(data, 'children', item => item.id === 11, { nestedArray: true })).toStrictEqual({ id: 11 });
      expect(deepFind(data, 'children', item => item.id === 12, { nestedArray: true })).toBe((data[2] as any[])[1].children![1]);
      expect(deepFind(data, 'children', item => item.id === 13, { nestedArray: true })).toBe((data[2] as any[])[1].children![1].children![0]);
      // 查找单层嵌套下的深层嵌套元素 ( 使用不符合的子项键名 )
      expect(deepFind(data, 'items', item => item.id === 11, { nestedArray: true })).toBeUndefined();
      expect(deepFind(data, 'items', item => item.id === 12, { nestedArray: true })).toBeUndefined();
      expect(deepFind(data, 'items', item => item.id === 13, { nestedArray: true })).toBeUndefined();
      expect(deepFind(data, 'xxx', item => item.id === 11, { nestedArray: true })).toBeUndefined();
      expect(deepFind(data, 'xxx', item => item.id === 12, { nestedArray: true })).toBeUndefined();
      expect(deepFind(data, 'xxx', item => item.id === 13, { nestedArray: true })).toBeUndefined();

      // 单层嵌套使用自定义子项键名
      expect(deepFind(data, 'items', item => item.id === 14, { nestedArray: true })).toStrictEqual({ id: 14 });
      expect(deepFind(data, 'items', item => item.id === 15, { nestedArray: true })).toBe((data[2] as any[])[1].items![1]);
      expect(deepFind(data, 'items', item => item.id === 16, { nestedArray: true })).toBe((data[2] as any[])[1].items![1].items![0]);
      // 单层嵌套使用自定义子项键名 ( 使用不符合的子项键名 )
      expect(deepFind(data, 'children', item => item.id === 14, { nestedArray: true })).toBeUndefined();
      expect(deepFind(data, 'children', item => item.id === 15, { nestedArray: true })).toBeUndefined();
      expect(deepFind(data, 'children', item => item.id === 16, { nestedArray: true })).toBeUndefined();
      expect(deepFind(data, 'xxx', item => item.id === 14, { nestedArray: true })).toBeUndefined();
      expect(deepFind(data, 'xxx', item => item.id === 15, { nestedArray: true })).toBeUndefined();
      expect(deepFind(data, 'xxx', item => item.id === 16, { nestedArray: true })).toBeUndefined();

      // 多层嵌套
      expect(deepFind(data, item => item.id === 18, { nestedArray: true })).toBe((data[2] as any[])[2][0]);
      // 多层嵌套 ( 使用不符合的子项键名, 单层嵌套, 用不到子项键名就可以匹配到 )
      expect(deepFind(data, 'children', item => item.id === 18, { nestedArray: true })).toBe((data[2] as any[])[2][0]);
      expect(deepFind(data, 'items', item => item.id === 18, { nestedArray: true })).toBe((data[2] as any[])[2][0]);
      expect(deepFind(data, 'xxx', item => item.id === 18, { nestedArray: true })).toBe((data[2] as any[])[2][0]);

      // 查找多层嵌套下的深层嵌套元素
      expect(deepFind(data, item => item.id === 19, { nestedArray: true })).toBe((data[2] as any[])[2][0].children![0]);
      expect(deepFind(data, 'children', item => item.id === 19, { nestedArray: true })).toBe((data[2] as any[])[2][0].children![0]);
      // 查找多层嵌套下的深层嵌套元素 ( 使用不符合的子项键名 )
      expect(deepFind(data, 'items', item => item.id === 19, { nestedArray: true })).toBeUndefined();
      expect(deepFind(data, 'xxx', item => item.id === 19, { nestedArray: true })).toBeUndefined();

      // 多层嵌套使用自定义子项键名
      expect(deepFind(data, 'items', item => item.id === 20, { nestedArray: true })).toBe((data[2] as any[])[2][0].items![0]);
      // 多层嵌套使用自定义子项键名 ( 使用不符合的子项键名 )
      expect(deepFind(data, 'children', item => item.id === 20, { nestedArray: true })).toBeUndefined();
      expect(deepFind(data, 'xxx', item => item.id === 20, { nestedArray: true })).toBeUndefined();
    });

    it('未传参时不生效', () => {
      // 单层嵌套
      expect(deepFind(data, item => item.id === 9)).toBeUndefined();
      expect(deepFind(data, item => item.id === 10)).toBeUndefined();
      // 单层嵌套 ( 使用不符合的子项键名, 单层嵌套, 用不到子项键名就可以匹配到 )
      expect(deepFind(data, 'children', item => item.id === 9)).toBeUndefined();
      expect(deepFind(data, 'children', item => item.id === 10)).toBeUndefined();
      expect(deepFind(data, 'items', item => item.id === 9)).toBeUndefined();
      expect(deepFind(data, 'items', item => item.id === 10)).toBeUndefined();
      expect(deepFind(data, 'xxx', item => item.id === 9)).toBeUndefined();
      expect(deepFind(data, 'xxx', item => item.id === 10)).toBeUndefined();

      // 查找单层嵌套下的深层嵌套元素
      expect(deepFind(data, item => item.id === 11)).toBeUndefined();
      expect(deepFind(data, item => item.id === 12)).toBeUndefined();
      expect(deepFind(data, item => item.id === 13)).toBeUndefined();
      expect(deepFind(data, 'children', item => item.id === 11)).toBeUndefined();
      expect(deepFind(data, 'children', item => item.id === 12)).toBeUndefined();
      expect(deepFind(data, 'children', item => item.id === 13)).toBeUndefined();
      // 查找单层嵌套下的深层嵌套元素 ( 使用不符合的子项键名 )
      expect(deepFind(data, 'items', item => item.id === 11)).toBeUndefined();
      expect(deepFind(data, 'items', item => item.id === 12)).toBeUndefined();
      expect(deepFind(data, 'items', item => item.id === 13)).toBeUndefined();
      expect(deepFind(data, 'xxx', item => item.id === 11)).toBeUndefined();
      expect(deepFind(data, 'xxx', item => item.id === 12)).toBeUndefined();
      expect(deepFind(data, 'xxx', item => item.id === 13)).toBeUndefined();

      // 单层嵌套使用自定义子项键名
      expect(deepFind(data, 'items', item => item.id === 14)).toBeUndefined();
      expect(deepFind(data, 'items', item => item.id === 15)).toBeUndefined();
      expect(deepFind(data, 'items', item => item.id === 16)).toBeUndefined();
      // 单层嵌套使用自定义子项键名 ( 使用不符合的子项键名 )
      expect(deepFind(data, 'children', item => item.id === 14)).toBeUndefined();
      expect(deepFind(data, 'children', item => item.id === 15)).toBeUndefined();
      expect(deepFind(data, 'children', item => item.id === 16)).toBeUndefined();
      expect(deepFind(data, 'xxx', item => item.id === 14)).toBeUndefined();
      expect(deepFind(data, 'xxx', item => item.id === 15)).toBeUndefined();
      expect(deepFind(data, 'xxx', item => item.id === 16)).toBeUndefined();

      // 多层嵌套
      expect(deepFind(data, item => item.id === 18)).toBeUndefined();
      // 多层嵌套 ( 使用不符合的子项键名, 单层嵌套, 用不到子项键名就可以匹配到 )
      expect(deepFind(data, 'children', item => item.id === 18)).toBeUndefined();
      expect(deepFind(data, 'items', item => item.id === 18)).toBeUndefined();
      expect(deepFind(data, 'xxx', item => item.id === 18)).toBeUndefined();

      // 查找多层嵌套下的深层嵌套元素
      expect(deepFind(data, item => item.id === 19)).toBeUndefined();
      expect(deepFind(data, 'children', item => item.id === 19)).toBeUndefined();
      // 查找多层嵌套下的深层嵌套元素 ( 使用不符合的子项键名 )
      expect(deepFind(data, 'items', item => item.id === 19)).toBeUndefined();
      expect(deepFind(data, 'xxx', item => item.id === 19)).toBeUndefined();

      // 多层嵌套使用自定义子项键名
      expect(deepFind(data, 'items', item => item.id === 20)).toBeUndefined();
      // 多层嵌套使用自定义子项键名 ( 使用不符合的子项键名 )
      expect(deepFind(data, 'children', item => item.id === 20)).toBeUndefined();
      expect(deepFind(data, 'xxx', item => item.id === 20)).toBeUndefined();
    });
  });

  it('边界情况测试', () => {
    // undefined 输入返回 undefined
    expect(deepFind(undefined, () => true)).toBeUndefined();
    expect(deepFind(undefined, 'children', () => true)).toBeUndefined();

    // 元素不存在时返回 undefined
    expect(deepFind(data, item => item.id === 100)).toBeUndefined();
    expect(deepFind(data, 'children', item => item.id === 100)).toBeUndefined();

    // 空数组返回 undefined
    expect(deepFind([], () => true)).toBeUndefined();
    expect(deepFind([], 'children', () => true)).toBeUndefined();

    // 空数组子项将被忽略
    expect(deepFind([{ id: 1, children: [] }, { id: 2 }], item => item.id === 2)).toEqual({ id: 2 });
    expect(deepFind([{ id: 1, children: [] }, { id: 2 }], 'children', item => item.id === 2)).toEqual({ id: 2 });

    // 非数组子项
    expect(deepFind([{ id: 1, children: 'not an array' }, { id: 2 }], item => item.id === 2)).toEqual({ id: 2 });
    expect(deepFind([{ id: 1, children: 'not an array' }, { id: 2 }], 'children', item => item.id === 2)).toEqual({ id: 2 });

    // 非对象子项将被忽略
    expect(deepFind([{ id: 1 }, null, { id: 2 }], item => item.id === 2)).toEqual({ id: 2 });
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

  it('文档示例测试', () => {
    const data = [
      // 嵌套数据结构
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
      // 嵌套数组结构 ( 通过 `nestedArray` 选项启用 )
      [
        { id: 9 },
        [
          {
            id: 10,
            children: [{ id: 11 }],
            items: [{ id: 12 }],
          },
        ],
      ],
    ];

    // 嵌套数据结构
    expect(deepFind(data, item => item.id === 5)).toStrictEqual({ id: 5 });
    expect(deepFind(data, 'children', item => item.id === 5)).toStrictEqual({ id: 5 });
    expect(deepFind(data, 'items', item => item.id === 8)).toStrictEqual({ id: 8 });
    // 嵌套数组结构
    expect(deepFind(data, item => item.id === 9, { nestedArray: true })).toStrictEqual({ id: 9 });
    expect(deepFind(data, 'children', item => item.id === 11, { nestedArray: true })).toStrictEqual({ id: 11 });
    expect(deepFind(data, 'items', item => item.id === 12, { nestedArray: true })).toStrictEqual({ id: 12 });
  });
});

describe('deepSome', () => {
  it('基本功能测试', () => {
    // 检查顶层元素
    expect(deepSome(data, item => item.id === 1)).toBe(true);
    expect(deepSome(data, item => item.id === 2)).toBe(true);
    expect(deepSome(data, 'children', item => item.id === 1)).toBe(true);
    expect(deepSome(data, 'children', item => item.id === 2)).toBe(true);
    // 查找顶层元素 ( 使用不符合的子项键名, 顶层元素, 用不到子项键名就可以匹配到 )
    expect(deepSome(data, 'items', item => item.id === 1)).toBe(true);
    expect(deepSome(data, 'items', item => item.id === 2)).toBe(true);
    expect(deepSome(data, 'xxx', item => item.id === 1)).toBe(true);
    expect(deepSome(data, 'xxx', item => item.id === 2)).toBe(true);

    // 检查二级元素
    expect(deepSome(data, item => item.id === 3)).toBe(true);
    expect(deepSome(data, item => item.id === 4)).toBe(true);
    expect(deepSome(data, 'children', item => item.id === 3)).toBe(true);
    expect(deepSome(data, 'children', item => item.id === 4)).toBe(true);
    // 检查二级元素 ( 使用不符合的子项键名 )
    expect(deepSome(data, 'items', item => item.id === 3)).toBe(false);
    expect(deepSome(data, 'items', item => item.id === 4)).toBe(false);
    expect(deepSome(data, 'xxx', item => item.id === 3)).toBe(false);
    expect(deepSome(data, 'xxx', item => item.id === 4)).toBe(false);

    // 检查深层嵌套元素
    expect(deepSome(data, item => item.id === 5)).toBe(true);
    expect(deepSome(data, 'children', item => item.id === 5)).toBe(true);
    // 检查深层嵌套元素 ( 使用不符合的子项键名 )
    expect(deepSome(data, 'items', item => item.id === 5)).toBe(false);
    expect(deepSome(data, 'xxx', item => item.id === 5)).toBe(false);

    // 使用自定义子项键名
    expect(deepSome(data, 'items', item => item.id === 6)).toBe(true);
    expect(deepSome(data, 'items', item => item.id === 8)).toBe(true);
    // 使用自定义子项键名 ( 使用不符合的子项键名 )
    expect(deepSome(data, 'children', item => item.id === 6)).toBe(false);
    expect(deepSome(data, 'children', item => item.id === 8)).toBe(false);
    expect(deepSome(data, 'xxx', item => item.id === 6)).toBe(false);
    expect(deepSome(data, 'xxx', item => item.id === 8)).toBe(false);

    // 不存在的元素
    expect(deepSome(data, item => item.id === 100)).toBe(false);
    expect(deepSome(data, 'children', item => item.id === 100)).toBe(false);
    expect(deepSome(data, 'items', item => item.id === 100)).toBe(false);
    expect(deepSome(data, 'xxx', item => item.id === 100)).toBe(false);
  });

  describe('对于嵌套数组结构的支持', () => {
    it('正常传参', () => {
      // 单层嵌套
      expect(deepSome(data, item => item.id === 9, { nestedArray: true })).toBe(true);
      expect(deepSome(data, item => item.id === 10, { nestedArray: true })).toBe(true);
      // 单层嵌套 ( 使用不符合的子项键名, 单层嵌套, 用不到子项键名就可以匹配到 )
      expect(deepSome(data, 'children', item => item.id === 9, { nestedArray: true })).toBe(true);
      expect(deepSome(data, 'children', item => item.id === 10, { nestedArray: true })).toBe(true);
      expect(deepSome(data, 'items', item => item.id === 9, { nestedArray: true })).toBe(true);
      expect(deepSome(data, 'items', item => item.id === 10, { nestedArray: true })).toBe(true);
      expect(deepSome(data, 'xxx', item => item.id === 9, { nestedArray: true })).toBe(true);
      expect(deepSome(data, 'xxx', item => item.id === 10, { nestedArray: true })).toBe(true);

      // 检查单层嵌套下的深层嵌套元素
      expect(deepSome(data, item => item.id === 11, { nestedArray: true })).toBe(true);
      expect(deepSome(data, item => item.id === 12, { nestedArray: true })).toBe(true);
      expect(deepSome(data, item => item.id === 13, { nestedArray: true })).toBe(true);
      expect(deepSome(data, 'children', item => item.id === 11, { nestedArray: true })).toBe(true);
      expect(deepSome(data, 'children', item => item.id === 12, { nestedArray: true })).toBe(true);
      expect(deepSome(data, 'children', item => item.id === 13, { nestedArray: true })).toBe(true);
      // 检查单层嵌套下的深层嵌套元素 ( 使用不符合的子项键名 )
      expect(deepSome(data, 'items', item => item.id === 11, { nestedArray: true })).toBe(false);
      expect(deepSome(data, 'items', item => item.id === 12, { nestedArray: true })).toBe(false);
      expect(deepSome(data, 'items', item => item.id === 13, { nestedArray: true })).toBe(false);
      expect(deepSome(data, 'xxx', item => item.id === 11, { nestedArray: true })).toBe(false);
      expect(deepSome(data, 'xxx', item => item.id === 12, { nestedArray: true })).toBe(false);

      // 单层嵌套使用自定义子项键名
      expect(deepSome(data, 'items', item => item.id === 14, { nestedArray: true })).toBe(true);
      expect(deepSome(data, 'items', item => item.id === 15, { nestedArray: true })).toBe(true);
      expect(deepSome(data, 'items', item => item.id === 16, { nestedArray: true })).toBe(true);
      // 单层嵌套使用自定义子项键名 ( 使用不符合的子项键名 )
      expect(deepSome(data, 'children', item => item.id === 14, { nestedArray: true })).toBe(false);
      expect(deepSome(data, 'children', item => item.id === 15, { nestedArray: true })).toBe(false);
      expect(deepSome(data, 'children', item => item.id === 16, { nestedArray: true })).toBe(false);
      expect(deepSome(data, 'xxx', item => item.id === 14, { nestedArray: true })).toBe(false);
      expect(deepSome(data, 'xxx', item => item.id === 15, { nestedArray: true })).toBe(false);
      expect(deepSome(data, 'xxx', item => item.id === 16, { nestedArray: true })).toBe(false);

      // 多层嵌套
      expect(deepSome(data, item => item.id === 18, { nestedArray: true })).toBe(true);
      // 多层嵌套 ( 使用不符合的子项键名, 单层嵌套, 用不到子项键名就可以匹配到 )
      expect(deepSome(data, 'children', item => item.id === 18, { nestedArray: true })).toBe(true);
      expect(deepSome(data, 'items', item => item.id === 18, { nestedArray: true })).toBe(true);
      expect(deepSome(data, 'xxx', item => item.id === 18, { nestedArray: true })).toBe(true);

      // 检查多层嵌套下的深层嵌套元素
      expect(deepSome(data, item => item.id === 19, { nestedArray: true })).toBe(true);
      expect(deepSome(data, 'children', item => item.id === 19, { nestedArray: true })).toBe(true);
      // 检查多层嵌套下的深层嵌套元素 ( 使用不符合的子项键名 )
      expect(deepSome(data, 'items', item => item.id === 19, { nestedArray: true })).toBe(false);
      expect(deepSome(data, 'xxx', item => item.id === 19, { nestedArray: true })).toBe(false);

      // 多层嵌套使用自定义子项键名
      expect(deepSome(data, 'items', item => item.id === 20, { nestedArray: true })).toBe(true);
      // 多层嵌套使用自定义子项键名 ( 使用不符合的子项键名 )
      expect(deepSome(data, 'children', item => item.id === 20, { nestedArray: true })).toBe(false);
      expect(deepSome(data, 'xxx', item => item.id === 20, { nestedArray: true })).toBe(false);
    });

    it('未传参时不生效', () => {
      // 单层嵌套
      expect(deepSome(data, item => item.id === 9)).toBe(false);
      expect(deepSome(data, item => item.id === 10)).toBe(false);
      // 单层嵌套 ( 使用不符合的子项键名, 单层嵌套, 用不到子项键名就可以匹配到 )
      expect(deepSome(data, 'children', item => item.id === 9)).toBe(false);
      expect(deepSome(data, 'children', item => item.id === 10)).toBe(false);
      expect(deepSome(data, 'items', item => item.id === 9)).toBe(false);
      expect(deepSome(data, 'items', item => item.id === 10)).toBe(false);
      expect(deepSome(data, 'xxx', item => item.id === 9)).toBe(false);
      expect(deepSome(data, 'xxx', item => item.id === 10)).toBe(false);

      // 检查单层嵌套下的深层嵌套元素
      expect(deepSome(data, item => item.id === 11)).toBe(false);
      expect(deepSome(data, item => item.id === 12)).toBe(false);
      expect(deepSome(data, item => item.id === 13)).toBe(false);
      expect(deepSome(data, 'children', item => item.id === 11)).toBe(false);
      expect(deepSome(data, 'children', item => item.id === 12)).toBe(false);
      expect(deepSome(data, 'children', item => item.id === 13)).toBe(false);
      // 检查单层嵌套下的深层嵌套元素 ( 使用不符合的子项键名 )
      expect(deepSome(data, 'items', item => item.id === 11)).toBe(false);
      expect(deepSome(data, 'items', item => item.id === 12)).toBe(false);
      expect(deepSome(data, 'items', item => item.id === 13)).toBe(false);
      expect(deepSome(data, 'xxx', item => item.id === 11)).toBe(false);
      expect(deepSome(data, 'xxx', item => item.id === 12)).toBe(false);

      // 单层嵌套使用自定义子项键名
      expect(deepSome(data, 'items', item => item.id === 14)).toBe(false);
      expect(deepSome(data, 'items', item => item.id === 15)).toBe(false);
      expect(deepSome(data, 'items', item => item.id === 16)).toBe(false);
      // 单层嵌套使用自定义子项键名 ( 使用不符合的子项键名 )
      expect(deepSome(data, 'children', item => item.id === 14)).toBe(false);
      expect(deepSome(data, 'children', item => item.id === 15)).toBe(false);
      expect(deepSome(data, 'children', item => item.id === 16)).toBe(false);
      expect(deepSome(data, 'xxx', item => item.id === 14)).toBe(false);
      expect(deepSome(data, 'xxx', item => item.id === 15)).toBe(false);
      expect(deepSome(data, 'xxx', item => item.id === 16)).toBe(false);

      // 多层嵌套
      expect(deepSome(data, item => item.id === 18)).toBe(false);
      // 多层嵌套 ( 使用不符合的子项键名, 单层嵌套, 用不到子项键名就可以匹配到 )
      expect(deepSome(data, 'children', item => item.id === 18)).toBe(false);
      expect(deepSome(data, 'items', item => item.id === 18)).toBe(false);
      expect(deepSome(data, 'xxx', item => item.id === 18)).toBe(false);

      // 检查多层嵌套下的深层嵌套元素
      expect(deepSome(data, item => item.id === 19)).toBe(false);
      expect(deepSome(data, 'children', item => item.id === 19)).toBe(false);
      // 检查多层嵌套下的深层嵌套元素 ( 使用不符合的子项键名 )
      expect(deepSome(data, 'items', item => item.id === 19)).toBe(false);
      expect(deepSome(data, 'xxx', item => item.id === 19)).toBe(false);

      // 多层嵌套使用自定义子项键名
      expect(deepSome(data, 'items', item => item.id === 20)).toBe(false);
      // 多层嵌套使用自定义子项键名 ( 使用不符合的子项键名 )
      expect(deepSome(data, 'children', item => item.id === 20)).toBe(false);
      expect(deepSome(data, 'xxx', item => item.id === 20)).toBe(false);
    });
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

    // 非对象子项将被忽略
    expect(deepSome([{ id: 1 }, null, { id: 2 }], item => item.id === 2)).toBe(true);
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

  it('文档示例测试', () => {
    const data = [
      // 嵌套数据结构
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
      // 嵌套数组结构 ( 通过 `nestedArray` 选项启用 )
      [
        { id: 9 },
        [
          {
            id: 10,
            children: [{ id: 11 }],
            items: [{ id: 12 }],
          },
        ],
      ],
    ];

    expect(deepSome(data, item => item.id === 5)).toBe(true);
    expect(deepSome(data, 'children', item => item.id === 5)).toBe(true);
    expect(deepSome(data, 'items', item => item.id === 8)).toBe(true);
    expect(deepSome(data, item => item.id === 8)).toBe(false);

    expect(deepSome(data, item => item.id === 9, { nestedArray: true })).toBe(true);
    expect(deepSome(data, 'children', item => item.id === 11, { nestedArray: true })).toBe(true);
    expect(deepSome(data, 'items', item => item.id === 12, { nestedArray: true })).toBe(true);
    expect(deepSome(data, item => item.id === 12, { nestedArray: true })).toBe(false);
  });
});

describe('deepForEach', () => {
  it('基本功能测试', () => {
    // 默认遍历 'children' 键
    const ids: number[] = [];
    deepForEach(data, item => ids.push(item.id!));
    expect(ids).toEqual([1, 2, 3, 4, 5]);

    // 遍历 'children' 键
    const childrenIds: number[] = [];
    deepForEach(data, 'children', item => childrenIds.push(item.id!));
    expect(childrenIds).toEqual([1, 2, 3, 4, 5]);

    // 使用自定义子项键名 'items'
    const itemIds: number[] = [];
    deepForEach(data, 'items', item => itemIds.push(item.id!));
    expect(itemIds).toEqual([1, 2, 6, 7, 8]);
  });

  it('对于嵌套数组结构的支持', () => {
    // 默认遍历 'children' 键
    const ids: number[] = [];
    deepForEach(data, item => ids.push(item.id!), { nestedArray: true });
    expect(ids).toEqual([1, 2, 3, 4, 5, 9, 10, 11, 12, 13, 18, 19]);

    // 遍历 'children' 键
    const childrenIds: number[] = [];
    deepForEach(data, 'children', item => childrenIds.push(item.id!), { nestedArray: true });
    expect(childrenIds).toEqual([1, 2, 3, 4, 5, 9, 10, 11, 12, 13, 18, 19]);

    // 使用自定义子项键名 'items'
    const itemIds: number[] = [];
    deepForEach(data, 'items', item => itemIds.push(item.id!), { nestedArray: true });
    expect(itemIds).toEqual([1, 2, 6, 7, 8, 9, 10, 14, 15, 16, 18, 20]);
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
    deepForEach([{ id: 1, children: [] }, { id: 2 }], item => simpleIds.push(item.id!));
    expect(simpleIds).toEqual([1, 2]);

    // 非数组子项
    const nonArrayIds: number[] = [];
    deepForEach([{ id: 1, children: 'not an array' }, { id: 2 }], item => nonArrayIds.push(item.id!));
    expect(nonArrayIds).toEqual([1, 2]);

    const nonArrayKeysIds: number[] = [];
    deepForEach([{ id: 1, children: 'not an array' }, { id: 2 }], 'children', item => nonArrayKeysIds.push(item.id!));
    expect(nonArrayKeysIds).toEqual([1, 2]);

    // 非对象子项将被忽略
    const nonObjectIds: number[] = [];
    deepForEach([{ id: 1 }, null, { id: 2 }], item => nonObjectIds.push(item.id!));
    expect(nonObjectIds).toEqual([1, 2]);
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
    deepForEach(nestedData, item => traversalOrder.push(item.id!));
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
    deepForEach(circularData, item => circularIds.push(item.id!));
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
    deepForEach(complexCircularData, item => complexIds.push(item.id!));
    expect(complexIds).toEqual([1, 2, 3]);
  });

  it('文档示例测试', () => {
    const data = [
      // 嵌套数据结构
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
      // 嵌套数组结构
      [
        { id: 9 },
        [
          {
            id: 10,
            children: [{ id: 11 }],
            items: [{ id: 12 }],
          },
        ],
      ],
    ];

    // 嵌套数据结构
    const ids: number[] = [];
    const ids2: number[] = [];
    const ids3: number[] = [];

    deepForEach(data, item => ids.push(item.id!));
    deepForEach(data, 'children', item => ids2.push(item.id!));
    deepForEach(data, 'items', item => ids3.push(item.id!));

    expect(ids).toStrictEqual([1, 2, 3, 4, 5]);
    expect(ids2).toStrictEqual([1, 2, 3, 4, 5]);
    expect(ids3).toStrictEqual([1, 2, 6, 7, 8]);

    // 嵌套数组结构
    const ids4: number[] = [];
    const ids5: number[] = [];
    const ids6: number[] = [];

    deepForEach(data, item => ids4.push(item.id!), { nestedArray: true });
    deepForEach(data, 'children', item => ids5.push(item.id!), { nestedArray: true });
    deepForEach(data, 'items', item => ids6.push(item.id!), { nestedArray: true });

    expect(ids4).toStrictEqual([1, 2, 3, 4, 5, 9, 10, 11]);
    expect(ids5).toStrictEqual([1, 2, 3, 4, 5, 9, 10, 11]);
    expect(ids6).toStrictEqual([1, 2, 6, 7, 8, 9, 10, 12]);
  });
});
