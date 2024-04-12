<!-- Demo 卡片 -->

<template>
  <div class="relative b m-theme-border rounded p-6 my-4" :class="{ pt8: showExtra, pb0: showCode }">
    <NConfigProvider :locale="zhCN" :date-locale="dateZhCN" abstract>
      <slot />
    </NConfigProvider>

    <!-- 功能区 -->
    <div v-if="showExtra" class="h-8 mr-2" flex="~ items-center" text="xs lh-none" pos="absolute top-0 right-0">
      <button m-btn text-lg p0 @click="toggleShowCodeState()">
        <i-material-symbols-code-rounded />
      </button>
    </div>

    <!-- 代码区 -->
    <div v-if="showCode" class="text-sm b-t m-theme-border rounded-b overflow-hidden m-(t6 x--6)">
      <div v-if="highlighter" v-html="codeHighlight" class="highlighter" />
      <div v-else flex="~ justify-center" py-2>
        <i-svg-spinners-ring-resize />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { NConfigProvider, dateZhCN, zhCN } from 'naive-ui';
  import * as shiki from 'shiki';
  import { decode } from 'js-base64';

  interface Props {
    code?: string;
    codeLang?: string;
  }

  const props = defineProps<Props>();

  const highlighter = shallowRef<shiki.Highlighter>();

  const code = ref('');
  const codeLang = ref('ts');

  const codeHighlight = computed(() => {
    return highlighter.value?.codeToHtml(code.value.trim(), {
      lang: codeLang.value,
      theme: 'material-theme-darker',
    }) ?? '';
  });

  const hasCode = computed(() => !!code.value);
  const [showCodeState, toggleShowCodeState] = useToggle(import.meta.env.DEV);

  const showCode = computed(() => hasCode.value && showCodeState.value);
  const showExtra = computed(() => hasCode.value);

  onMounted(() => {
    const unWatch = wheneverImmediate(showCode as any, async () => {
      nextTick(() => unWatch());

      highlighter.value = await shiki.getHighlighter({
        langs: ['ts', 'vue'],
        themes: ['material-theme-darker'],
      });
    });

    props.code && (code.value = decode(decodeURIComponent(props.code)));
    props.codeLang && (codeLang.value = props.codeLang);
  });

  provide('code', code);
  provide('codeLang', codeLang);
</script>

<style lang="sass">
  .highlighter > .shiki
    @apply scrollbar my-0 p-(x6 y3)
</style>
