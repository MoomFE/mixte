<template>
  <div ref="rootRef" class="mixte-infinite-scroll">
    <slot name="prepend" :is-loading :is-finished :error :is-empty />
    <slot />
    <slot name="append" :is-loading :is-finished :error :is-empty />
  </div>
</template>

<script
  generic="T extends any[]"
  lang="ts"
  setup
>
  import type { InfiniteScrollProps, InfiniteScrollSlots } from './types';
  import { useInfiniteScroll } from '@vueuse/core';
  import { computed, shallowRef } from 'vue';
  import { DefaultData } from './types';

  const props = defineProps<InfiniteScrollProps<T>>();

  defineSlots<InfiniteScrollSlots>();

  const data = defineModel<InfiniteScrollProps<T>['data']>('data', {
    required: false,
    default: DefaultData,
  });

  const rootRef = shallowRef<HTMLDivElement>();

  const pageNum = shallowRef(1);
  const pageSize = shallowRef(10);

  const isEmpty = computed(() => {
    if (typeof data.value === 'symbol') return;
    return !data.value?.length;
  });
  const isFinished = shallowRef(false);
  const error = shallowRef<any>();

  const { isLoading, reset } = useInfiniteScroll(
    rootRef,
    async () => {
      try {
        const data = await props.load!(pageNum.value++, pageSize.value);

        isFinished.value = (data?.length ?? 0) < pageSize.value;
      }
      catch (err) {
        error.value = err;
        throw err;
      }
    },
    {
      distance: props.distance,
      direction: props.direction,
      interval: props.interval,
      canLoadMore: () => {
        if (!props.load || isFinished.value || error.value) return false;

        return props.canLoad?.() ?? true;
      },
    },
  );

  defineExpose({
    isLoading,
    isFinished,
    error,
    reset() {
      pageNum.value = 1;
      pageSize.value = 15;
      isFinished.value = false;
      error.value = undefined;
      if (Array.isArray(data.value)) {
        data.value = ([] as unknown) as T;
      }
      reset();
    },
  });
</script>
