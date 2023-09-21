import type { ExtractPropTypes, PropType } from 'vue-demi';
import { computed, defineComponent, h, ref } from 'vue-demi';
import { isNumeric } from 'mixte';
import { useElementSize } from '@vueuse/core';
import { flatVNode } from '../utils/flatVNode';

export const autoGridProps = {
  /** 子元素最小宽度 */
  itemWidth: {
    type: [Number, String] as PropType<number | `${number}`>,
  },
  /** 横纵间距 */
  gap: {
    type: [Number, String] as PropType<number | `${number}`>,
  },
  /** 横向间距 */
  gapX: {
    type: [Number, String] as PropType<number | `${number}`>,
  },
  /** 纵向间距 */
  gapY: {
    type: [Number, String] as PropType<number | `${number}`>,
  },
} as const;

export type AutoGridProps = ExtractPropTypes<typeof autoGridProps>;

export const AutoGrid = defineComponent({
  props: autoGridProps,
  setup(props, { slots }) {
    const rootRef = ref<HTMLElement>();
    const rootWidth = useElementSize(rootRef).width;

    const itemWidth = computed(() => isNumeric(props.itemWidth) ? +props.itemWidth : rootWidth.value);
    const gap = computed(() => isNumeric(props.gap) ? +props.gap : 0);
    const gapX = computed(() => isNumeric(props.gapX) ? +props.gapX : gap.value);
    const gapY = computed(() => isNumeric(props.gapY) ? +props.gapY : gap.value);

    const children = computed(() => {
      return flatVNode(slots.default?.());
    });

    const length = computed(() => {
      const gap = children.value.length > 1 ? gapX.value : 0;

      return Math.floor(
        (rootWidth.value + gap) / (itemWidth.value + gap),
      );
    });

    return () => h('div', {
      ref: rootRef,
      style: {
        display: 'grid',
        gridTemplateColumns: `repeat(${length.value}, 1fr)`,
        columnGap: `${gapX.value}px`,
        rowGap: `${gapY.value}px`,
      },
    }, children.value.map((Node) => {
      return h('div', {
        style: { overflow: 'hidden' },
      }, [Node]);
    }));
  },
});
