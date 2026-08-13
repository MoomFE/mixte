import type { MeasureSource } from './useVirtual';
import { enableAutoUnmount, mount } from '@vue/test-utils';
import { useSharedStore } from './useShared';
import { useTreeData, useTreeDataStore } from './useTreeData';
import { useVirtualStore } from './useVirtual';

/**
 * 测试夹具: 提供完整的注入状态并渲染一行
 * - measureSource 为注入的测量源
 * - columnIndex 为传入的列索引 ( 默认 0 )
 * - fixedRowHeight 为传入的固定行高 ( 默认不设置 )
 */
function createHarness(options: {
  measureSource: MeasureSource;
  columnIndex?: number;
  fixedRowHeight?: number;
}) {
  const { measureSource, columnIndex = 0, fixedRowHeight } = options;

  /** 行高查询 ( 由 setup 捕获 ) */
  let findIndexByHeight: (height: number) => number = () => 0;

  /** 组件 props ( 可修改以验证响应式行为 ) */
  const props = reactive({
    data: [{ id: 0 }, { id: 1 }, { id: 2 }],
    columns: [{ field: 'name' }],
    virtual: true,
    fixedRowHeight,
  });

  const Harness = defineComponent({
    setup() {
      useSharedStore(props as any, {} as any, { expandedRowKeys: ref<string[]>([]) });
      useTreeDataStore();

      const { useRowMeasure, findIndexByHeight: find } = useVirtualStore({ measureSource });
      findIndexByHeight = find;
      const { displayedData } = useTreeData()!;

      const node = computed(() => displayedData.value[0]);
      const { rowRef } = useRowMeasure(node, () => 0, columnIndex);

      return () => node.value ? h('div', { ref: rowRef, class: 'row' }) : null;
    },
  });

  mount(Harness);

  return {
    props,
    findIndexByHeight,
  };
}

describe('useVirtual 测量注册', () => {
  enableAutoUnmount(afterEach);

  it('虚拟列表首列且未设置固定行高时, 调用注入的测量源并将高度回写', async () => {
    const fakeHeight = ref(60);
    const measureSource = vi.fn<MeasureSource>(() => fakeHeight);

    const { findIndexByHeight } = createHarness({ measureSource });

    await nextTick();

    // 测量源被调用
    expect(measureSource).toHaveBeenCalled();

    // 初始: 未测量, 使用预估高度 50 → [0, 50, 100, 150]
    expect(findIndexByHeight(55)).toBe(1);

    // 修改假测量高度 → 触发回写
    fakeHeight.value = 100;
    await nextTick();

    // 实测 100 → [0, 100, 150, 200]
    expect(findIndexByHeight(55)).toBe(0);
    expect(findIndexByHeight(120)).toBe(1);
  });

  it('暴露的 findIndexByHeight 在响应式上下文中随行高回写失效重算', async () => {
    const fakeHeight = ref(60);
    const measureSource = vi.fn<MeasureSource>(() => fakeHeight);

    const { findIndexByHeight } = createHarness({ measureSource });

    await nextTick();

    // 触发一次回写
    fakeHeight.value = 100;
    await nextTick();

    // 在响应式上下文中读取
    const indexAt55 = computed(() => findIndexByHeight(55));
    expect(indexAt55.value).toBe(0);

    // 再次修改高度 → 响应式失效重算
    fakeHeight.value = 200;
    await nextTick();
    expect(indexAt55.value).toBe(0);

    fakeHeight.value = 40;
    await nextTick();
    expect(indexAt55.value).toBe(1);
  });

  it('非首列时不调用测量源', async () => {
    const measureSource = vi.fn<MeasureSource>(() => ref(60));

    createHarness({ measureSource, columnIndex: 1 });

    await nextTick();

    expect(measureSource).not.toHaveBeenCalled();
  });

  it('设置固定行高时不调用测量源', async () => {
    const measureSource = vi.fn<MeasureSource>(() => ref(60));

    createHarness({ measureSource, fixedRowHeight: 60 });

    await nextTick();

    expect(measureSource).not.toHaveBeenCalled();
  });

  it('运行时切换 virtual 时, 测量随条件启停', async () => {
    const measureSource = vi.fn<MeasureSource>(() => ref(60));

    const { props } = createHarness({ measureSource });

    await nextTick();

    // 初始开启虚拟 → 已调用测量源
    expect(measureSource).toHaveBeenCalledTimes(1);

    // 关闭虚拟 → 停止测量 ( 销毁作用域, 不重新调用 )
    props.virtual = false;
    await nextTick();
    expect(measureSource).toHaveBeenCalledTimes(1);

    // 重新开启虚拟 → 重新测量 ( 重建作用域 )
    props.virtual = true;
    await nextTick();
    expect(measureSource).toHaveBeenCalledTimes(2);
  });

  it('运行时切换 fixedRowHeight 时, 定位随固定高度更新', async () => {
    const measureSource = vi.fn<MeasureSource>(() => ref(60));

    const { props, findIndexByHeight } = createHarness({ measureSource });

    await nextTick();

    // 未设置固定行高 → 使用预估高度 50 → [0, 50, 100, 150]
    expect(findIndexByHeight(55)).toBe(1);

    // 设置固定行高 60 → 固定高度计算 → [0, 60, 120, 180]
    props.fixedRowHeight = 60;
    await nextTick();
    expect(findIndexByHeight(55)).toBe(0);
    expect(findIndexByHeight(61)).toBe(1);

    // 取消固定行高 → 回到预估高度
    props.fixedRowHeight = undefined;
    await nextTick();
    expect(findIndexByHeight(55)).toBe(1);
  });

  it('数据变化时, 缓存基于新数据重建', async () => {
    const measureSource = vi.fn<MeasureSource>(() => ref(60));

    const { props, findIndexByHeight } = createHarness({ measureSource });

    await nextTick();

    // 3 行预估 50 → [0, 50, 100, 150]
    expect(findIndexByHeight(55)).toBe(1);

    // 增加为 5 行 → [0, 50, 100, 150, 200, 250]
    props.data = [{ id: 0 }, { id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }];
    await nextTick();
    expect(findIndexByHeight(220)).toBe(4);
  });
});
