<!-- https://vitepress.dev/zh/guide/extending-default-theme#layout-slots -->

<template>
  <DefaultTheme.Layout />
</template>

<script lang="ts" setup>
  import { toggleThemeViewTransition } from '@mixte/snippets/toggleThemeViewTransition';
  import { useData } from 'vitepress';
  import DefaultTheme from 'vitepress/theme';

  const { isDark } = useData();

  provide('toggle-appearance', ({ clientX: x, clientY: y }: MouseEvent) => {
    toggleThemeViewTransition(() => isDark.value = !isDark.value, {
      x,
      y,
      reverse: isDark,
    });
  });
</script>

<style>
.VPSwitchAppearance { width: 22px !important }
.VPSwitchAppearance .check { transform: none !important }
</style>
