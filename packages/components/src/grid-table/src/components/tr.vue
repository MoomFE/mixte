<template>
  <div ref="trRef" class="mixte-gt-tr" :data-index="index">
    <template v-for="column in tableProps.columns" :key="column.field">
      <component :is="h(Td, { column, record, index }, $slots)" />
    </template>
  </div>
</template>

<script lang="ts" setup>
  import { watchImmediate, wheneverEffectScopeImmediate } from '@mixte/use';
  import { useElementSize } from '@vueuse/core';
  import { h, onMounted, ref } from 'vue';
  import { useShared } from '../composables/useShared';
  import { useVirtual } from '../composables/useVirtual';
  import Td from './td.vue';

  interface Props {
    record: Record<string, any>;
    index: number;
  }

  const props = defineProps<Props>();

  const trRef = ref<HTMLDivElement>();

  const { props: tableProps } = useShared()!;

  onMounted(() => {
    wheneverEffectScopeImmediate(() => tableProps.virtual, () => {
      const { updateRowHeight } = useVirtual()!;
      const height = useElementSize(trRef).height;

      watchImmediate(height, () => {
        updateRowHeight(props.index, trRef.value?.clientHeight ?? 0);
      });
    });
  });
</script>
