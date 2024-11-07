import type { MaybeRefOrGetter } from '@vueuse/core';
import { watchImmediate, wheneverEffectScopeImmediate } from '@mixte/use';
import { unrefElement, useDraggable, useMouse } from '@vueuse/core';
import { ref } from 'vue-demi';

/**
 * 获取拖拽距离
 *
 * @see https://mixte.moomfe.com/mixte/use/useDraggableDistance
 * @param target - 要拖动的目标元素
 */
export function useDraggableDistance(target: MaybeRefOrGetter<HTMLElement | SVGElement | null | undefined>) {
  const { x, y } = useMouse();
  const { isDragging } = useDraggable(() => unrefElement(target));

  const distanceX = ref(0);
  const distanceY = ref(0);

  wheneverEffectScopeImmediate(isDragging, (_, __, onCleanup) => {
    const startX = x.value;
    const startY = y.value;

    watchImmediate([x, y], ([x, y]) => {
      distanceX.value = x! - startX;
      distanceY.value = y! - startY;
    });

    onCleanup(() => {
      distanceX.value = 0;
      distanceY.value = 0;
    });
  });

  return {
    x: distanceX,
    y: distanceY,
    isDragging,
  };
}
