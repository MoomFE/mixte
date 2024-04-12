---
outline: [1,3]
---

获取拖拽距离

### 类型

```ts
/**
 * @param target - 要拖动的目标元素
 */
function useDraggableDistance(target: MaybeRefOrGetter<HTMLElement | SVGElement | null | undefined>): {
  x: Ref<number>;
  y: Ref<number>;
  isDragging: ComputedRef<boolean>;
};
```
