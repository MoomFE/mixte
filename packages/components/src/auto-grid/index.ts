import type { PropType } from 'vue-demi';
import { h } from 'vue-demi';
import { isNumeric } from 'mixte';
import { flatVNode } from '../utils/flatVNode';

export const autoGridProps = {
  /** 子元素最小宽度 */
  itemWidth: {
    type: [Number, String] as PropType<number | `${number}`>,
  },
} as const;

export const AutoGrid = defineComponent({
  props: autoGridProps,
  setup(props, { slots }) {
    const rootRef = ref<HTMLElement>();
    const rootWidth = useElementSize(rootRef).width;

    const colLength = computed(() => {
      return isNumeric(props.itemWidth) ? Math.floor(rootWidth.value / +props.itemWidth) : 1;
    });

    const children = computed(() => {
      return flatVNode(slots.default?.());
    });

    return () => h('div', {
      ref: rootRef,
      style: {
        display: 'grid',
        gridTemplateColumns: `repeat(${colLength.value}, 1fr)`,
      },
    }, children.value.map(Node => h(Node)));
  },
});
