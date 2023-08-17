<template>
  <div text-sm grid="~ cols-[auto_1fr] items-center gap-(x2 y1)">
    source:
    <div flex="~ items-center">
      <button m-btn="~ link" pl0 @click="toggleSource()">{{ source }}</button>
      <span c-gray>
        ←
        <i text-xs>点击切换, 当 `source` 为 true 时, `value` he `value2` 是同步的</i>
      </span>
    </div>
    value:
    <el-input v-model="value" />
    value2:
    <el-input :value="value2" disabled />
  </div>
</template>

<script lang="ts" setup>
  import { wheneverEffectScope } from '@mixte/use';
  import type { InjectCode } from '@/.vitepress/components/DemoCard/types';

  const [source, toggleSource] = useToggle();
  const value = ref('test');
  const value2 = ref('');

  wheneverEffectScope(source, (_value, _oldValue, _onCleanup) => {
    watchImmediate(value, (v) => {
      value2.value = v;
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
