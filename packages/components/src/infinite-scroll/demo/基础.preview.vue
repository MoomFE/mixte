<template>
  <MixteInfiniteScroll
    class="h-66 overflow-y-auto flex-(~ col gap-2) text-center"
    :load="load"
  >
    <template v-for="item in data" :key="item">
      <div class="px-2 py-2" style="background-color: var(--el-color-primary-light-7)">
        {{ item }}
      </div>
    </template>
  </MixteInfiniteScroll>
</template>

<script lang="ts" setup>
  import { MixteInfiniteScroll } from '@mixte/components/infinite-scroll';

  const data = ref<number[]>([]);

  async function load(pageNum: number, pageSize: number) {
    const resData = Array.from({ length: pageSize }).map((_, i) => (i + 1) + (pageNum - 1) * pageSize);

    data.value.push(
      ...resData,
    );

    return resData;
  }
</script>
