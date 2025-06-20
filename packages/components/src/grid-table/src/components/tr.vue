<template>
  <div ref="trRef" class="mixte-gt-tr" :data-index="index">
    <template v-for="column in tableProps.columns" :key="column.field">
      <component :is="h(Td, { node, column, index }, $slots)" />
    </template>
  </div>
</template>

<script lang="ts" setup>
  import type { GridTableFieldsSlots } from '@mixte/components/grid-table/types';
  import type { TreeNode } from 'treemate';
  import { wheneverEffectScopeImmediate } from '@mixte/use';
  import { useElementSize } from '@vueuse/core';
  import { h, onMounted, ref, watch } from 'vue';
  import { useShared } from '../composables/useShared';
  import { useVirtual } from '../composables/useVirtual';
  import Td from './td.vue';

  interface Props {
    node: TreeNode<any>;
    index: number;
  }

  const props = defineProps<Props>();

  defineSlots<GridTableFieldsSlots<any>>();

  const trRef = ref<HTMLDivElement>();

  const { props: tableProps } = useShared()!;

  onMounted(() => {
    const { updateRowHeight } = useVirtual()!;

    wheneverEffectScopeImmediate(() => tableProps.virtual, () => {
      const height = useElementSize(trRef).height;

      watch(height, (height) => {
        updateRowHeight(props.index, props.node.rawNode, height);
      });
    });
  });
</script>
