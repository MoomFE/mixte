<!-- Demo 卡片 -->

<template>
  <div class="relative b m-theme-border rounded p-6 my-4" :class="{ pt8: showExtra, pb0: showCode }">
    <el-config-provider :locale="elZhCN">
      <NConfigProvider :locale="zhCN" :date-locale="dateZhCN" :theme="isDark ? darkTheme : undefined" abstract>
        <slot />
      </NConfigProvider>
    </el-config-provider>

    <!-- 功能区 -->
    <div v-if="showExtra" class="h-8 mr-2" flex="~ items-center" text="xs lh-none" pos="absolute top-0 right-0">
      <el-button link @click="toggleShowCodeState()">
        <i-material-symbols-code-rounded class="size-4.5" />
      </el-button>
    </div>

    <!-- 代码区 -->
    <div v-if="showCode" class="text-sm b-t m-theme-border rounded-b m-(t6 x--6)">
      <ShikiMagicMove
        v-if="highlighter"
        class="my-0 px-3 py-2 overflow-auto"
        theme="material-theme-darker"
        :lang="codeLang"
        :highlighter="highlighter"
        :code="code.trim()"
      />
      <div v-else flex="~ justify-center" py-2>
        <i-svg-spinners-ring-resize />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import type { Highlighter } from 'shiki';
  import elZhCN from 'element-plus/es/locale/lang/zh-cn';
  import { decode } from 'js-base64';
  import { darkTheme, dateZhCN, NConfigProvider, zhCN } from 'naive-ui';
  import { getSingletonHighlighter } from 'shiki';
  import { ShikiMagicMove } from 'shiki-magic-move/vue';
  import { useData } from 'vitepress';
  import 'shiki-magic-move/dist/style.css';

  interface Props {
    code?: string;
    codeLang?: string;
  }

  const props = defineProps<Props>();

  const { isDark } = useData();

  const highlighter = shallowRef<Highlighter>();

  const code = ref('');
  const codeLang = ref('ts');

  const hasCode = computed(() => !!code.value);
  const [showCodeState, toggleShowCodeState] = useToggle();

  const showCode = computed(() => hasCode.value && showCodeState.value);
  const showExtra = computed(() => hasCode.value);

  onMounted(() => {
    wheneverImmediate(showCode, async () => {
      highlighter.value = await getSingletonHighlighter({
        langs: ['ts', 'vue'],
        themes: ['material-theme-darker'],
      });
    }, {
      once: true,
    });

    props.code && (code.value = decode(decodeURIComponent(props.code)));
    props.codeLang && (codeLang.value = props.codeLang);
  });

  provide('code', code);
  provide('codeLang', codeLang);
</script>

<style lang="sass" scoped>
  .highlighter > .shiki
    @apply scrollbar my-0 p-(x6 y3)

  :deep(.arco-link)
    @apply important:no-underline
</style>
