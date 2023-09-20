import type { ExtractPropTypes, PropType } from 'vue-demi';
import { h } from 'vue-demi';
import { isNumeric } from 'mixte';
import { flatVNode } from '../utils/flatVNode';

export const autoGridProps = {
  /** 子元素最小宽度 */
  itemWidth: {
    type: [Number, String] as PropType<number | `${number}`>,
  },
  /** 间隔 */
  gap: {
    type: [Number, String] as PropType<number | `${number}`>,
  },
  /** 横向间隔 */
  gapX: {
    type: [Number, String] as PropType<number | `${number}`>,
  },
  /** 纵向间隔 */
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

    const basicLength = computed(() => {
      return Math.floor(rootWidth.value / itemWidth.value);
    });
    const rootRemainWidth = computed(() => {
      return rootWidth.value - gapX.value * (basicLength.value - 1);
    });
    const length = computed(() => {
      return Math.floor(rootRemainWidth.value / itemWidth.value);
    });

    return () => h('div', {
      ref: rootRef,
      style: {
        display: 'grid',
        gridTemplateColumns: `repeat(${length.value}, 1fr)`,
        columnGap: `${gapX.value}px`,
        rowGap: `${gapY.value}px`,
      },
    }, children.value.map(Node => h(Node)));
  },
});
