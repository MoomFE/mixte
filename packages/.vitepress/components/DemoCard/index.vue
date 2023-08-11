<template>
  <div class="relative b m-theme-border rounded p-6 my-4" :class="{ pt8: showExtra, pb0: hasCode && showCode }">
    <slot />

    <!-- 功能区 -->
    <div v-if="showExtra" text="xs lh-none" pos="absolute top-2 right-2">
      <button m-btn text-base p0 @click="toggleShowCode()">
        <i-material-symbols-code-rounded />
      </button>
    </div>

    <!-- 代码区 -->
    <div v-if="hasCode && showCode" class="text-sm b-t m-theme-border rounded-b overflow-hidden m-(t6 x--6)">
      <div v-if="highlighter" class="[&>.shiki]-(my-0 p-(x6 y3))" v-html="codeHighlight" />
      <div v-else flex="~ justify-center" py-2>
        <i-svg-spinners-ring-resize />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import * as shiki from 'shiki';
  import { devDependencies } from '@@/package.json';

  const highlighter = ref<shiki.Highlighter>();
  (async () => {
    shiki.setCDN(`https://unpkg.com/shiki@${devDependencies.shiki.replace(/^\^/g, '')}/`);
    highlighter.value = await shiki.getHighlighter({
      langs: ['ts'],
      theme: 'material-theme-darker',
    });
  })();

  const code = ref('');
  const codeHighlight = computed(() => {
    return highlighter.value?.codeToHtml(code.value, { lang: 'ts' }) ?? '';
  });

  const [showCode, toggleShowCode] = useToggle(true);

  const hasCode = computed(() => !!code.value);
  const showExtra = computed(() => hasCode.value);

  provide('code', code);
</script>
