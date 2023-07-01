<template>
  <div class="footer flex justify-center text-2xl text-center mt-6">
    <!-- 回到首页 -->
    <button :title="t('button.home')" @click="router.push({ name: 'Index' })">
      <i-vaadin-home-o />
    </button>

    <!-- 切换深色模式 -->
    <button :title="t('button.toogle-dark-mode')" @click="theme.toggleDark()">
      <i-ph-moon v-if="theme.dark" />
      <i-ic-outline-wb-sunny v-else />
    </button>

    <!-- 切换多语言 -->
    <button :title="t('button.change-languages')" @click="toggleLocales">
      <i-mdi-translate />
    </button>

    <!-- 跳转到 Github -->
    <button>
      <a class="c-inherit!" href="https://github.com/MoomFE-Starter-Template/Base" target="_blank" rel="noopener noreferrer">
        <i-mdi-github />
      </a>
    </button>
  </div>
</template>

<script lang="ts" setup>
  const router = useRouter();
  const theme = useThemeStore();
  const { t, locale, availableLocales: locales } = useI18n();

  function toggleLocales() {
    locale.value = locales[(locales.indexOf(locale.value) + 1) % locales.length];
  }
</script>

<style lang="scss">
  .footer > * {
    @apply opacity-60 hover:text-primary hover:opacity-100 transition-(all duration-300) mx-2;
  }
</style>
