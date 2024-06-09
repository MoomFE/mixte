import type { PropType } from 'vue';
import { computed, defineComponent, h, ref } from 'vue';
import { isNumeric } from 'mixte';
import { useElementSize } from '@vueuse/core';
import { flatVNode } from '../../utils/flatVNode';

export const autoGridProps = {
  /**
   * 组件宽度 (单位: px)
   *  - 正常情况无需使用, 会自动获取组件宽度
   */
  width: {
    type: [Number, String] as PropType<number | `${number}`>,
  },
  /** 子元素最小宽度 (单位: px) */
  itemWidth: {
    type: [Number, String] as PropType<number | `${number}`>,
  },
  /** 横纵间距 (单位: px) */
  gap: {
    type: [Number, String] as PropType<number | `${number}`>,
  },
  /** 横向间距 (单位: px) */
  gapX: {
    type: [Number, String] as PropType<number | `${number}`>,
  },
  /** 纵向间距 (单位: px) */
  gapY: {
    type: [Number, String] as PropType<number | `${number}`>,
  },
  /** 是否折叠 */
  collapsed: {
    type: Boolean,
  },
  /** 显示行数 */
  collapsedRows: {
    type: [Number, String] as PropType<number | `${number}`>,
  },
} as const;

export default defineComponent({
  props: autoGridProps,
  setup(props, { slots }) {
    const rootRef = ref<HTMLElement>();
    const rootWidth = useElementSize(rootRef).width;

    const isCustomWidth = computed(() => isNumeric(props.width));
    const width = computed(() => isCustomWidth.value ? +props.width! : rootWidth.value);

    const itemWidth = computed(() => isNumeric(props.itemWidth) ? +props.itemWidth : width.value);
    const gap = computed(() => isNumeric(props.gap) ? +props.gap : 0);
    const gapX = computed(() => isNumeric(props.gapX) ? +props.gapX : gap.value);
    const gapY = computed(() => isNumeric(props.gapY) ? +props.gapY : gap.value);

    const collapsedRows = computed(() => isNumeric(props.collapsedRows) ? Math.max(1, +props.collapsedRows) : 1);

    /** 所有子元素 */
    const children = computed(() => {
      return flatVNode(slots.default?.());
    });

    /** 每行渲染的子元素数量 */
    const length = computed(() => {
      return Math.floor((width.value + gapX.value) / (itemWidth.value + gapX.value)) || 1;
    });

    return () => {
      let renderChildren = children.value;

      if (props.collapsed) {
        const rowsChildrenLength = collapsedRows.value * length.value;

        renderChildren = renderChildren.slice(0, rowsChildrenLength);

        if (children.value.length > rowsChildrenLength && !!slots.overflowSuffix)
          renderChildren.splice(-1, 1, slots.overflowSuffix!() as any);
      }

      return h(
        'div',
        {
          ref: rootRef,
          style: {
            width: isCustomWidth.value ? `${props.width}px` : '100%',
            display: 'grid',
            gridTemplateColumns: `repeat(${length.value}, 1fr)`,
            columnGap: `${gapX.value}px`,
            rowGap: `${gapY.value}px`,
          },
        },
        renderChildren.map((Node) => {
          return h('div', {
            style: { overflow: 'hidden' },
          }, [Node]);
        }),
      );
    };
  },
});
