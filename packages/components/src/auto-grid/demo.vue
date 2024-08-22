<template>
  <div ref="rootRef" grid="~ cols-[auto_auto_1fr] items-center gap-2" text-sm mb5>
    <span>子元素最小宽度 <small>( px )</small>:</span>
    <el-slider v-model="itemWidth" class="grid-col-span-2" :max="Math.max(100, rootWidth)" />

    <template v-if="splitGap">
      <span>横向间距 <small>( px )</small>:</span>
      <el-input-number v-model="gapX" class="w-30!" controls-position="right" :min="0" />
      <el-checkbox v-model="splitGap" label="拆分" />
      <span>纵向间距 <small>( px )</small>:</span>
      <el-input-number v-model="gapY" class="w-30!" controls-position="right" :min="0" />
    </template>
    <template v-else>
      <span>横纵间距 <small>( px )</small>:</span>
      <el-input-number v-model="gap" class="w-30!" controls-position="right" :min="0" />
      <el-checkbox v-model="splitGap" label="拆分" />
    </template>

    <span>折叠:</span>
    <el-checkbox v-model="collapsed" class="grid-col-span-2" />
    <template v-if="collapsed">
      <span>显示的行数:</span>
      <el-input-number v-model="collapsedRows" class="w-30! grid-col-span-2" placeholder="1" controls-position="right" :min="1" />
      <span>溢出后缀插槽:</span>
      <el-checkbox v-model="overflowSuffix" />
    </template>
  </div>

  <n-split v-model:size="splitSize" :max="`${rootWidth - 44}px`" min="100px" pane1-class="pr-2" pane2-class="flex pl-1">
    <template #1>
      <MixteAutoGrid :item-width="itemWidth" :gap="gap" :gap-x="gapX" :gap-y="gapY" :collapsed="collapsed" :collapsed-rows="collapsedRows">
        <div
          v-for="i in count" :key="i"
          h-8 text="sm black" flex="~ justify-center items-center"
          :style="{ backgroundColor: randomColors[i - 1] }"
        >
          item-{{ i }}
        </div>

        <template v-if="overflowSuffix" #overflowSuffix>
          <div size-full flex="~ justify-center items-center" text="sm white" bg-black>
            溢出后缀插槽
          </div>
        </template>
      </MixteAutoGrid>
    </template>
    <template #2>
      <i-material-symbols-arrow-left-alt class="size-5 flex-none" />
      拖动一下看看
    </template>
  </n-split>
</template>

<script lang="ts" setup>
  import { MixteAutoGrid } from '@mixte/components/auto-grid';
  import { isNumeric, isPlainObject, random } from 'mixte';
  import { omit } from 'lodash-es';
  import { colors as colorsMap } from '@/.vitepress/shared/unocss.theme';
  import type { InjectCode, InjectCodeLang } from '@/.vitepress/components/DemoCard/types';

  const rootRef = ref<HTMLDivElement>();
  const rootWidth = useElementSize(rootRef).width;

  const splitSize = ref<number | `${number}px`>(1);

  onMounted(() => watchImmediate(rootWidth, () => {
    splitSize.value = `${rootWidth.value - 44}px`;
  }));

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

  const collapsed = ref(false);
  const collapsedRows = ref<number | undefined>();
  const overflowSuffix = ref(false);

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
    }${
      collapsed.value ? ' collapsed' : ''
    }${
      isNumeric(collapsedRows.value) ? ` collapsed-rows="${collapsedRows.value}"` : ''
    }>
    <div v-for="i in ${count.value}" :key="i">
      item-{{ i }}
    </div>${
      overflowSuffix.value
        ? `\n
    <template #overflowSuffix>
      溢出后缀插槽
    </template>`
        : ''
    }
  </MixteAutoGrid>
</template>

<script lang="ts" setup>
  import { MixteAutoGrid } from '@mixte/components/auto-grid';
<\/script>
    `),
    { direction: 'rtl' },
  );
</script>
