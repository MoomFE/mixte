<template>
  <div
    ref="rootRef"
    class="mixte-auto-grid"
    :style="{
      display: 'grid',
      gridTemplateColumns: `repeat(${length}, 1fr)`,
    }"
  >
    <template v-for="(item, index) in children" :key="index">
      <div>
        <component :is="item" />
      </div>
    </template>
  </div>
</template>

<script lang="ts" setup>
  import { isNumber, isObject, isString } from 'mixte';
  import type { VNode, VNodeChild } from 'vue';
  import { Comment, Fragment, createTextVNode } from 'vue';

  interface Props {
    width?: number
  }

  const props = withDefaults(defineProps<Props>(), {
    width: 120,
  });

  const slots = useSlots();

  const rootRef = ref<HTMLElement>();

  const rootWidth = useElementSize(rootRef).width;

  const length = computed(() => Math.floor(rootWidth.value / props.width));

  function flatVNode(vNodes: VNodeChild[], nodes: VNode[] = []) {
    vNodes.forEach((vNode) => {
      if (vNode == null) return;
      if (!isObject(vNode)) {
        if (isString(vNode) || isNumber(vNode))
          nodes.push(createTextVNode(`${vNode}`));
        return;
      }
      if (Array.isArray(vNode))
        return flatVNode(vNode, nodes);
      if (vNode.type === Fragment) {
        if (Array.isArray(vNode.children))
          return flatVNode(vNode.children, nodes);
      }
      if (vNode.type !== Comment)
        nodes.push(vNode);
    });
    return nodes;
  }

  const children = computed(() => flatVNode(slots.default?.() ?? []));
</script>
