<template>
  <Logo class="mx-auto" />

  <p class="mt-2">
    {{ t('intro.title') }}
  </p>

  <div class="mt-6">
    <input
      v-model="name"
      class="w-62.5 max-w-full border border-gray-400 rounded-md outline-none text-center bg-transparent px-3 py-1.5"
      :placeholder="t('intro.whats-your-name')"
      @keydown.enter="go"
    >
  </div>

  <div class="mt-3">
    <Button :disabled="!name" @click="go">
      {{ t('button.go') }}
    </Button>
  </div>
</template>

<script lang="ts" setup>
  const router = useRouter();
  const { t } = useI18n();

  const name = ref('');

  function go() {
    router.push({
      name: 'Hello',
      params: {
        name: encodeURIComponent(name.value),
      },
    });
  }
</script>

<route lang="yaml">
name: Index
meta:
  layout: home
</route>
