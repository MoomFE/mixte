<template>
  <Sender
    :allow-speech="{
      recording,
      onRecordingChange,
    }"
    @submit="() => {
      ElMessage.success('Send message successfully!');
    }"
  />
</template>

<script lang="ts" setup>
  import { Sender } from '@mixte/snippets/ant-design-x';
  import { ElMessage } from 'element-plus';
  import '@mixte/snippets/ant-design-x/patch-for-react-19';

  const recording = ref(false);

  function onRecordingChange(nextRecording: boolean) {
    ElMessage.info(`Mock Customize Recording: ${nextRecording}`);
    recording.value = nextRecording;
  }
</script>
