import { ref } from 'vue-demi';
import { unrefElement, useDraggable, useMouse } from '@vueuse/core';
import { watchImmediate, wheneverEffectScopeImmediate } from '@mixte/use';
import type { MaybeRefOrGetter } from '@vueuse/core';

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
