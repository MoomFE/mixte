import type { EffectScope, Ref } from 'vue';
import { useDraggableDistance } from '@mixte/use';
import { effectScope, nextTick } from 'vue';

const mocks = vi.hoisted(() => {
  return {
    /** 模拟 useMouse 返回的鼠标位置 */
    mouse: {} as { x: Ref<number>; y: Ref<number> },
    /** 模拟 useDraggable 返回的拖拽状态 */
    isDragging: {} as Ref<boolean>,
  };
});

vi.mock('@vueuse/core', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@vueuse/core')>();
  const { ref } = await import('vue');

  mocks.mouse = { x: ref(0), y: ref(0) };
  mocks.isDragging = ref(false);

  return {
    ...actual,
    useMouse: () => mocks.mouse,
    useDraggable: () => ({ isDragging: mocks.isDragging }),
  };
});

describe('useDraggableDistance', () => {
  const scopes: EffectScope[] = [];

  /** 在独立的 effect 作用域内调用, 便于在测试结束后统一清理 */
  function useDraggableDistanceInScope() {
    const scope = effectScope();
    scopes.push(scope);

    return scope.run(() => useDraggableDistance(() => null))!;
  }

  beforeEach(() => {
    mocks.mouse.x.value = 0;
    mocks.mouse.y.value = 0;
    mocks.isDragging.value = false;
  });

  afterEach(() => {
    scopes.splice(0).forEach(scope => scope.stop());
  });

  it('方法返回参数类型判断', () => {
    const { x, y, isDragging } = useDraggableDistanceInScope();

    expect(x.value).toBeTypeOf('number');
    expect(y.value).toBeTypeOf('number');
    expect(isDragging.value).toBeTypeOf('boolean');
  });

  it('未拖拽时距离保持为 0', async () => {
    const { x, y } = useDraggableDistanceInScope();

    mocks.mouse.x.value = 100;
    mocks.mouse.y.value = 200;
    await nextTick();

    expect(x.value).toBe(0);
    expect(y.value).toBe(0);
  });

  it('拖拽时返回相对拖拽起点的距离', async () => {
    const { x, y } = useDraggableDistanceInScope();

    // 记录拖拽起点
    mocks.mouse.x.value = 50;
    mocks.mouse.y.value = 50;
    await nextTick();

    mocks.isDragging.value = true;
    await nextTick();

    expect(x.value).toBe(0);
    expect(y.value).toBe(0);

    mocks.mouse.x.value = 150;
    mocks.mouse.y.value = 120;
    await nextTick();

    expect(x.value).toBe(100);
    expect(y.value).toBe(70);

    // 支持拖拽起点反方向的距离
    mocks.mouse.x.value = 30;
    mocks.mouse.y.value = 10;
    await nextTick();

    expect(x.value).toBe(-20);
    expect(y.value).toBe(-40);
  });

  it('拖拽结束后距离归零', async () => {
    const { x, y } = useDraggableDistanceInScope();

    mocks.isDragging.value = true;
    await nextTick();

    mocks.mouse.x.value = 100;
    mocks.mouse.y.value = 100;
    await nextTick();

    expect(x.value).toBe(100);
    expect(y.value).toBe(100);

    mocks.isDragging.value = false;
    await nextTick();

    expect(x.value).toBe(0);
    expect(y.value).toBe(0);
  });

  it('再次拖拽时以新的位置为起点', async () => {
    const { x } = useDraggableDistanceInScope();

    mocks.isDragging.value = true;
    await nextTick();

    mocks.mouse.x.value = 100;
    await nextTick();

    expect(x.value).toBe(100);

    mocks.isDragging.value = false;
    await nextTick();

    mocks.mouse.x.value = 300;
    await nextTick();

    expect(x.value).toBe(0);

    mocks.isDragging.value = true;
    await nextTick();

    mocks.mouse.x.value = 320;
    await nextTick();

    expect(x.value).toBe(20);
  });
});
