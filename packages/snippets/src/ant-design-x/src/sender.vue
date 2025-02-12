<template>
  <Sender />
</template>

<script lang="ts" setup>
  import { Sender as XSender } from '@ant-design/x';
  import { applyPureReactInVue } from 'veaury';

  const Sender = applyPureReactInVue(XSender);
</script>
