<template>
  <div grid="~ cols-[auto_auto_1fr] items-center gap-2" text-sm mb5>
    <span>子元素最小宽度 <small>( px )</small>:</span>
    <el-input-number v-model="itemWidth" class="w-30! grid-col-span-2" controls-position="right" />

    <template v-if="splitGap">
      <span>横向间距 <small>( px )</small>:</span>
      <el-input-number v-model="gapX" class="w-30!" controls-position="right" />
      <el-checkbox v-model="splitGap" label="拆分" />
      <span>纵向间距 <small>( px )</small>:</span>
      <el-input-number v-model="gapY" class="w-30!" controls-position="right" />
    </template>
    <template v-else>
      <span>横纵间距 <small>( px )</small>:</span>
      <el-input-number v-model="gap" class="w-30!" controls-position="right" />
      <el-checkbox v-model="splitGap" label="拆分" />
    </template>
  </div>

  <MixteAutoGrid :item-width="itemWidth" :gap="gap" :gap-x="gapX" :gap-y="gapY">
    <div
      v-for="i in count" :key="i"
      h-8 rounded-sm text-sm flex="~ justify-center items-center"
      :style="{ backgroundColor: randomColors[i - 1] }"
    >
      item-{{ i }}
    </div>
  </MixteAutoGrid>
</template>

<script lang="ts" setup>
  import { MixteAutoGrid } from '@mixte/components';
  import { isNumeric, isPlainObject, random } from 'mixte';
  import { omit } from 'lodash-es';
  import { colors as colorsMap } from '@/.vitepress/shared/unocss.theme';
  import type { InjectCode, InjectCodeLang } from '@/.vitepress/components/DemoCard/types';

  const colors = ([] as string[]).concat(
    ...Object.values(omit(colorsMap, ['dark']))
      .filter(c => isPlainObject(c))
      .map((c) => {
        return Object.entries(c).filter(([k]) => +k < 5).map(([, v]) => v);
      }),
  );

  const itemWidth = ref(100);

  const splitGap = ref(false);
  const gap = ref<number | undefined>(10);
  const gapX = ref<number | undefined>();
  const gapY = ref<number | undefined>();

  const count = ref(24);
  const randomColors = computed(() => {
    return Array.from({ length: count.value }, () => colors[random(0, colors.length - 1)]);
  });

  watch(splitGap, (split) => {
    if (split) {
      gapX.value = gapY.value = gap.value;
      gap.value = undefined;
    }
    else {
      gap.value = (isNumeric(gapX.value) || isNumeric(gapY.value)) ? Math.max(gapX.value ?? 0, gapY.value ?? 0) : undefined;
      gapX.value = gapY.value = undefined;
    }
  });

  inject<InjectCodeLang>('codeLang')!.value = 'vue';
  syncRef(
    inject<InjectCode>('code')!,
    computed(() => `
<template>
  <MixteAutoGrid item-width="${itemWidth.value}"${
      isNumeric(gap.value) ? ` gap="${gap.value}"` : ''
    }${
      isNumeric(gapX.value) ? ` gap-x="${gapX.value}"` : ''
    }${
      isNumeric(gapY.value) ? ` gap-y="${gapY.value}"` : ''
    }>
    <div v-for="i in ${count.value}" :key="i">
      item-{{ i }}
    </div>
  </MixteAutoGrid>
</template>
    `),
    { direction: 'rtl' },
  );
</script>
