import { useDraggableDistance } from '@mixte/use';

describe('useDraggableDistance', () => {
  it('方法返回参数类型判断', () => {
    const { x, y, isDragging } = useDraggableDistance(() => null);

    expect(x.value).toBeTypeOf('number');
    expect(y.value).toBeTypeOf('number');
    expect(isDragging.value).toBeTypeOf('boolean');
  });
});
