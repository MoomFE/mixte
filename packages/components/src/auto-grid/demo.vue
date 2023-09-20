<template>
  <AutoGrid item-width="100" gap="10">
    <template v-for="i in count" :key="i">
      <div
        h-8 rounded-sm flex="~ justify-center items-center"
        text-sm
        :style="{ backgroundColor: randomColors[i - 1] }"
      >
        item-{{ i }}
      </div>
    </template>
  </AutoGrid>
</template>

<script lang="ts" setup>
  import { AutoGrid } from '@mixte/components';
  import { isPlainObject, random } from 'mixte';
  import { omit } from 'lodash-es';
  import { colors as colorsMap } from '@/.vitepress/shared/unocss.theme';

  const colors = ([] as string[]).concat(
    ...Object.values(omit(colorsMap, ['dark']))
      .filter(c => isPlainObject(c))
      .map((c) => {
        return Object.entries(c).filter(([k]) => +k < 5).map(([, v]) => v);
      }),
  );

  const count = ref(36);
  const randomColors = computed(() => {
    return Array.from({ length: count.value }, () => colors[random(0, colors.length - 1)]);
  });
</script>
