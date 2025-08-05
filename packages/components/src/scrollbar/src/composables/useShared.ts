import type { ScrollbarProps } from '@mixte/components/scrollbar/types';
import { createInjectionState } from '@vueuse/core';
import { OverlayScrollbars } from 'overlayscrollbars';
import { onMounted, onUnmounted, ref, shallowRef } from 'vue';

export const [
  useSharedStore,
  useShared,
] = createInjectionState((
  props: ScrollbarProps,
) => {
  const rootRef = ref<HTMLDivElement>();
  const contentRef = ref<HTMLDivElement>();

  const scrollbarInstance = shallowRef<OverlayScrollbars>();

  onMounted(() => {
    scrollbarInstance.value = OverlayScrollbars({
      target: rootRef.value!,
      elements: {
        viewport: contentRef.value!,
        content: contentRef.value!,
      },
    }, props.options ?? {});
  });

  onUnmounted(() => {
    scrollbarInstance.value?.destroy();
    scrollbarInstance.value = undefined;
  });

  return {
    props,

    rootRef,
    contentRef,
  };
});
