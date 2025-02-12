<template>
  <div>
    <Render />
  </div>
</template>

<script lang="ts" setup>
  import { createRoot } from 'react-dom/client';
  import { applyPureReactInVue, setVeauryOptions } from 'veaury';
  import { Aaa } from './components-react/index';

  setVeauryOptions({
    react: { createRoot },
  });

  const Render = applyPureReactInVue(Aaa);
</script>
