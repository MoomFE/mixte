<template>
  <div class="text-5xl">
    <i-iconoir-people-rounded class="inline-block" />
  </div>

  <p class="mt-1">
    {{ t('intro.hi', { name }) }}
  </p>

  <p class="text-sm opacity-50">
    <em>
      {{ t('intro.dynamic-route') }}
    </em>
  </p>

  <div class="mt-6">
    <Button @click="router.back()">
      {{ t('button.back') }}
    </Button>
  </div>
</template>

<script lang="ts" setup>
  interface Props {
    name: string
  }

  const props = defineProps<Props>();

  const router = useRouter();
  const { t } = useI18n();

  const name = computed(() => {
    return decodeURIComponent(props.name);
  });

  useHead({
    title: computed(() => t('intro.hi', { name: name.value })),
  });
</script>

<route lang="yaml">
name: Hello
meta:
  layout: home
</route>
