import type { TreeNode } from 'treemate';
import { createHeightCache } from './createHeightCache';

/** 创建假数据 */
function createNodes(count: number) {
  return Array.from({ length: count })
    .map((_, index) => ({ rawNode: { id: index } }) as unknown as TreeNode<any>);
}

/** 创建缓存 */
function createCache(nodes: TreeNode<any>[], estimated = 50, fixed: number | null = null) {
  return createHeightCache({
    getData: () => nodes,
    getEstimated: () => estimated,
    getFixed: () => fixed,
  });
}

describe('createHeightCache', () => {
  it('未更新行高度时, 使用预估高度累加', () => {
    const nodes = createNodes(3);
    const cache = createCache(nodes);

    expect(cache.getHeights()).toEqual([0, 50, 100, 150]);
  });

  it('更新行高度时, 从最小脏索引开始增量重建', () => {
    const nodes = createNodes(3);
    const cache = createCache(nodes);

    expect(cache.getHeights()).toEqual([0, 50, 100, 150]);

    expect(cache.updateHeight(0, nodes[0].rawNode, 60)).toBe(true);
    expect(cache.getHeights()).toEqual([0, 60, 110, 160]);

    expect(cache.updateHeight(1, nodes[1].rawNode, 70)).toBe(true);
    expect(cache.getHeights()).toEqual([0, 60, 130, 180]);
  });

  it('高度未变化时, updateHeight 返回 false 且不重新标记', () => {
    const nodes = createNodes(3);
    const cache = createCache(nodes);

    cache.updateHeight(0, nodes[0].rawNode, 60);
    expect(cache.updateHeight(0, nodes[0].rawNode, 60)).toBe(false);
    expect(cache.getHeights()).toEqual([0, 60, 110, 160]);
  });

  it('脏索引取最小值', () => {
    const nodes = createNodes(3);
    const cache = createCache(nodes);

    cache.updateHeight(2, nodes[2].rawNode, 80);
    expect(cache.getHeights()).toEqual([0, 50, 100, 180]);

    cache.updateHeight(0, nodes[0].rawNode, 90);
    expect(cache.getHeights()).toEqual([0, 90, 140, 220]);
  });

  it('数据变短时, 裁剪累计高度数组', () => {
    const nodes = createNodes(5);
    const cache = createCache(nodes);

    cache.updateHeight(4, nodes[4].rawNode, 100);
    expect(cache.getHeights()).toEqual([0, 50, 100, 150, 200, 300]);

    nodes.length = 2;
    expect(cache.getHeights()).toEqual([0, 50, 100]);
  });

  it('设置固定行高时, 使用固定高度计算, 忽略更新', () => {
    const nodes = createNodes(3);
    const cache = createCache(nodes, 50, 60);

    expect(cache.getHeights()).toEqual([0, 60, 120, 180]);

    // 固定行高下更新被忽略, 返回 false 且不写入缓存
    expect(cache.updateHeight(0, nodes[0].rawNode, 999)).toBe(false);
    expect(cache.getHeights()).toEqual([0, 60, 120, 180]);
  });

  it('固定行高下被忽略的更新不会污染切回预估模式后的缓存', () => {
    const nodes = createNodes(3);
    let fixed: number | null = 60;
    const cache = createHeightCache({
      getData: () => nodes,
      getEstimated: () => 50,
      getFixed: () => fixed,
    });

    // 固定行高模式下更新被忽略
    expect(cache.updateHeight(0, nodes[0].rawNode, 999)).toBe(false);

    // 切回预估模式后, 行 0 未被 999 污染, 仍使用预估高度
    fixed = null;
    expect(cache.getHeights()).toEqual([0, 50, 100, 150]);

    // 正常测量后增量更新生效
    expect(cache.updateHeight(0, nodes[0].rawNode, 70)).toBe(true);
    expect(cache.getHeights()).toEqual([0, 70, 120, 170]);
  });

  it('固定行高切换回预估后, 保留固定前已测量的高度', () => {
    const nodes = createNodes(3);
    let fixed: number | null = null;
    const cache = createHeightCache({
      getData: () => nodes,
      getEstimated: () => 50,
      getFixed: () => fixed,
    });

    // 预估模式下测量行 0
    expect(cache.updateHeight(0, nodes[0].rawNode, 70)).toBe(true);
    expect(cache.getHeights()).toEqual([0, 70, 120, 170]);

    // 切换到固定行高 → 使用固定高度计算
    fixed = 60;
    expect(cache.getHeights()).toEqual([0, 60, 120, 180]);

    // 固定模式下更新被忽略
    expect(cache.updateHeight(1, nodes[1].rawNode, 999)).toBe(false);

    // 切回预估模式 → 行 0 保留实测 70, 行 1 未被 999 污染
    fixed = null;
    expect(cache.getHeights()).toEqual([0, 70, 120, 170]);
  });

  it('预估行高变化时, 强制全量重建', () => {
    const nodes = createNodes(3);
    let estimated = 50;
    const cache = createHeightCache({
      getData: () => nodes,
      getEstimated: () => estimated,
      getFixed: () => null,
    });

    expect(cache.getHeights()).toEqual([0, 50, 100, 150]);

    estimated = 60;
    expect(cache.getHeights()).toEqual([0, 60, 120, 180]);

    // 已测量行保留实测高度, 未测量行使用新预估高度
    cache.updateHeight(1, nodes[1].rawNode, 80);
    expect(cache.getHeights()).toEqual([0, 60, 140, 200]);

    estimated = 70;
    expect(cache.getHeights()).toEqual([0, 70, 150, 220]);
  });

  it('固定行高切换为预估时, 强制全量重建', () => {
    const nodes = createNodes(3);
    let fixed: number | null = 60;
    const cache = createHeightCache({
      getData: () => nodes,
      getEstimated: () => 50,
      getFixed: () => fixed,
    });

    expect(cache.getHeights()).toEqual([0, 60, 120, 180]);

    fixed = null;
    expect(cache.getHeights()).toEqual([0, 50, 100, 150]);
  });

  it('findIndexByHeight 二分查找边界', () => {
    const nodes = createNodes(3);
    const cache = createCache(nodes);

    // heights: [0, 50, 100, 150]
    expect(cache.findIndexByHeight(0)).toBe(0);
    expect(cache.findIndexByHeight(25)).toBe(0);
    expect(cache.findIndexByHeight(49)).toBe(0);
    expect(cache.findIndexByHeight(50)).toBe(0);
    expect(cache.findIndexByHeight(51)).toBe(1);
    expect(cache.findIndexByHeight(99)).toBe(1);
    expect(cache.findIndexByHeight(100)).toBe(1);
    expect(cache.findIndexByHeight(101)).toBe(2);
    expect(cache.findIndexByHeight(149)).toBe(2);
    expect(cache.findIndexByHeight(150)).toBe(2);
  });

  it('findIndexByHeight 支持固定行高', () => {
    const nodes = createNodes(3);
    const cache = createCache(nodes, 50, 60);

    expect(cache.findIndexByHeight(0)).toBe(0);
    expect(cache.findIndexByHeight(59)).toBe(0);
    expect(cache.findIndexByHeight(60)).toBe(0);
    expect(cache.findIndexByHeight(61)).toBe(1);
    expect(cache.findIndexByHeight(120)).toBe(1);
    expect(cache.findIndexByHeight(121)).toBe(2);
    expect(cache.findIndexByHeight(1000)).toBe(2);
  });

  it('findIndexByHeight 可传入高度数组', () => {
    const nodes = createNodes(3);
    const cache = createCache(nodes);

    expect(cache.findIndexByHeight(55, [0, 100, 200, 300])).toBe(0);
    expect(cache.findIndexByHeight(101, [0, 100, 200, 300])).toBe(1);
  });

  it('findIndexByHeight 传入固定行高数组时, 在数组上二分查找', () => {
    const cache = createCache(createNodes(3), 50, 60);

    const heights = cache.getHeights();

    expect(heights).toEqual([0, 60, 120, 180]);
    expect(cache.findIndexByHeight(0, heights)).toBe(0);
    expect(cache.findIndexByHeight(59, heights)).toBe(0);
    expect(cache.findIndexByHeight(60, heights)).toBe(0);
    expect(cache.findIndexByHeight(61, heights)).toBe(1);
    expect(cache.findIndexByHeight(120, heights)).toBe(1);
    expect(cache.findIndexByHeight(121, heights)).toBe(2);
    expect(cache.findIndexByHeight(179, heights)).toBe(2);
  });

  it('数据引用变化时, 强制全量重建 ( 行结构变化 )', () => {
    let nodes = createNodes(3);
    const cache = createHeightCache({
      getData: () => nodes,
      getEstimated: () => 50,
      getFixed: () => null,
    });

    cache.updateHeight(0, nodes[0].rawNode, 60);
    cache.updateHeight(1, nodes[1].rawNode, 80);
    expect(cache.getHeights()).toEqual([0, 60, 140, 190]);

    // 模拟树形数据展开: 在 index 1 处插入两行 ( 新行未测量, 使用预估高度 )
    nodes = [nodes[0], ...createNodes(2), nodes[1], nodes[2]];

    expect(cache.getHeights()).toEqual([0, 60, 110, 160, 240, 290]);

    // 新行测量后增量重建
    cache.updateHeight(1, nodes[1].rawNode, 40);
    cache.updateHeight(2, nodes[2].rawNode, 40);
    expect(cache.getHeights()).toEqual([0, 60, 100, 140, 220, 270]);
  });

  it('空数据', () => {
    const cache = createCache([]);

    expect(cache.getHeights()).toEqual([0]);
    expect(cache.findIndexByHeight(100)).toBe(0);
  });
});
