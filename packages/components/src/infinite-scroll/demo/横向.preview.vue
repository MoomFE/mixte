<template>
  <MixteInfiniteScroll
    class="w-full h-36 overflow-x-auto flex-(~ gap-2)"
    :load="load"
    :distance="100"
    direction="right"
  >
    <template v-for="item in data" :key="item">
      <div class="flex items-center px-2 py-2" style="background-color: var(--el-color-primary-light-7)">
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
