<template>
  <div class="relative b m-theme-border rounded p-6 my-4" :class="{ pt8: showExtra, pb0: showCode }">
    <slot />

    <!-- 功能区 -->
    <div v-if="showExtra" class="h-8 mr-2" flex="~ items-center" text="xs lh-none" pos="absolute top-0 right-0">
      <button m-btn text-lg p0 @click="toggleShowCodeState()">
        <i-material-symbols-code-rounded />
      </button>
    </div>

    <!-- 代码区 -->
    <div v-if="showCode" class="text-sm b-t m-theme-border rounded-b overflow-hidden m-(t6 x--6)">
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

  const code = ref('');
  const codeHighlight = computed(() => {
    return highlighter.value?.codeToHtml(code.value, { lang: 'ts' }) ?? '';
  });

  const hasCode = computed(() => !!code.value);
  const [showCodeState, toggleShowCodeState] = useToggle(true);

  const showCode = computed(() => hasCode.value && showCodeState.value);
  const showExtra = computed(() => hasCode.value);

  onMounted(() => {
    const unWatch = wheneverImmediate(showCode, async () => {
      nextTick(() => unWatch());

      shiki.setCDN(`https://unpkg.com/shiki@${devDependencies.shiki.replace(/^\^/g, '')}/`);
      highlighter.value = await shiki.getHighlighter({
        langs: ['ts'],
        theme: 'material-theme-darker',
      });
    });
  });

  provide('code', code);
</script>
