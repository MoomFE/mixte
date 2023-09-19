<template>
  <AutoGrid item-width="100" gap-2>
    <template v-for="i in count" :key="i">
      <div
        h-8 rounded-sm flex="~ justify-center items-center"
        text-sm
        :style="{ backgroundColor: randomColors[i] }"
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

  const count = 30;
  const randomColors = Array.from({ length: count }, () => colors[random(0, colors.length - 1)]);
</script>
