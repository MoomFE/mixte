<!-- https://vitepress.dev/zh/guide/extending-default-theme#layout-slots -->

<template>
  <DefaultTheme.Layout />
</template>

<script lang="ts" setup>
  import DefaultTheme from 'vitepress/theme';
  import { useData } from 'vitepress';
  import { toggleThemeViewTransition } from '@mixte/snippets/toggleThemeViewTransition';

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
