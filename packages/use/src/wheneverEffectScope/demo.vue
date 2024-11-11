<template>
  <div text-sm grid="~ cols-[auto_1fr] items-center gap-(x2 y1)">
    source:
    <div flex="~ items-center">
      <el-button class="underline decoration-dotted" type="primary" link @click="toggleSource()">{{ source }}</el-button>
      <span c-gray>
        ←
        <i text-xs>点击切换, 当 `source` 为 true 时, `value` he `value2` 是同步的</i>
      </span>
    </div>
    value:
    <el-input v-model="value">
      <template #append>
        <el-tooltip :content="`已${isAutoPlay ? '启用' : '关闭'}值自动改变, 点击${isAutoPlay ? '关闭' : '启用'}`">
          <el-button class="important-(flex items-center py-0 px-2)" @click="isAutoPlay = !isAutoPlay">
            <i-material-symbols-time-auto-outline class="size-5" :class="{ 'c-#098E59': isAutoPlay }" />
          </el-button>
        </el-tooltip>
      </template>
    </el-input>
    value2:
    <el-input :value="value2" disabled />
  </div>
</template>

<script lang="ts" setup>
  import type { InjectCode } from '@/.vitepress/components/DemoCard/types';
  import { wheneverEffectScope } from '@mixte/use';
  import { randomNatural, randomString } from 'mixte';

  const [source, toggleSource] = useToggle();
  const value = ref('test');
  const value2 = ref('');

  wheneverEffectScope(source, (_value, _oldValue, _onCleanup) => {
    watchImmediate(value, (v) => {
      value2.value = v;
    });
  });

  const isAutoPlay = ref(true);

  wheneverEffectScopeImmediate(isAutoPlay, () => {
    useIntervalFn(() => value.value = randomString(randomNatural(6, 18)), 360, {
      immediateCallback: true,
    });
  });

  syncRef(
    inject<InjectCode>('code')!,
    computed(() => `
const source = ref(${source.value});
const value = ref('${value.value}');
const value2 = ref('${value2.value}');

// 当 \`source\` 为 truthy 时, 执行的 effect 作用域
wheneverEffectScope(source, (_value, _oldValue, _onCleanup) => {
  // 监听 \`value\`, 同步值至 \`value2\`
  watch(value, val => value2.value = val, {
    immediate: true,
  });
});
`),
    { direction: 'rtl' },
  );
</script>
