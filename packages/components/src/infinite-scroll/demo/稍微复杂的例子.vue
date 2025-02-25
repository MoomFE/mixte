<template>
  <div>
    <el-checkbox v-model="isMockNoData">模拟无数据</el-checkbox>
    <el-checkbox v-model="isMockNextNoData">下次请求不返回数据</el-checkbox>
  </div>

  <hr>

  <div flex="~ col gap-2">
    <MixteInfiniteScroll
      ref="infiniteScrollRef"
      v-model:data="data"
      class="h-66 overflow-y-auto flex-(~ col gap-2) text-center"
      :load="load"
      :distance="100"
    >
      <template v-for="item in data" :key="item">
        <div class="px-2 py-2" style="background-color: var(--el-color-primary-light-7)">
          {{ item.name }}
        </div>
      </template>

      <template #append="{ isEmpty, isLoading, isFinished }">
        <div v-if="isLoading" flex justify-center c-neutral-4>
          <i-svg-spinners-ring-resize />
        </div>
        <div v-else-if="isEmpty === true" size-full flex="~ justify-center items-center">
          <el-empty :image-size="80" />
        </div>
        <div v-else-if="isFinished" flex justify-center text-sm c-neutral-4>
          没有更多数据了
        </div>
      </template>
    </MixteInfiniteScroll>

    <el-button type="primary" @click="infiniteScrollRef?.reset()">重置</el-button>
  </div>
</template>

<script lang="ts" setup>
  import type { InjectCode, InjectCodeLang } from '@/.vitepress/components/DemoCard/types';
  import { MixteInfiniteScroll, type MixteInfiniteScrollInstance } from '@mixte/components/infinite-scroll';
  import axios from 'axios';

  const infiniteScrollRef = ref<MixteInfiniteScrollInstance>();

  const data = ref<{ name: string }[]>([]);

  const isMockNoData = ref(false);
  const isMockNextNoData = ref(false);

  async function load(pageNum: number, pageSize: number) {
    const res = await axios.post<
      ResponseData<
        ResponseListData<{ name: string }>
      >
    >('https://apifoxmock.com/m1/4781098-4434938-default/list/items', {
      pageNum,
      pageSize,
      ...((isMockNoData.value || isMockNextNoData.value) ? { mockNoData: true } : {}),
    });
    const resData = res.data.data.list ?? [];

    data.value.push(
      ...resData,
    );

    return resData;
  }

  watch(isMockNoData, () => {
    infiniteScrollRef.value?.reset();
  });

  watch(isMockNextNoData, (value) => {
    if (!value && !data.value.length)
      infiniteScrollRef.value?.reset();
  });

  interface ResponseData<T = any> {
    code: `${number}`;
    data: T;
    message: string;
  }

  interface ResponseListData<T = any> {
    list: T[];
    pageSize: number;
    pageNum: number;
  }

  inject<InjectCodeLang>('codeLang')!.value = 'vue';
  syncRef(
    inject<InjectCode>('code')!,
    computed(() => `
<template>
  <div flex="~ col gap-2">
    <MixteInfiniteScroll
      ref="infiniteScrollRef"
      v-model:data="data"
      class="h-66 overflow-y-auto flex-(~ col gap-2) text-center"
      :load="load"
      :distance="100"
    >
      <template v-for="item in data" :key="item">
        <div class="px-2 py-2" style="background-color: var(--el-color-primary-light-7)">
          {{ item.name }}
        </div>
      </template>

      <template #append="{ isEmpty, isLoading, isFinished }">
        <!-- 数据加载中 -->  
        <div v-if="isLoading" flex justify-center c-neutral-4>
          <i-svg-spinners-ring-resize />
        </div>
        <!-- 数据为空 -->
        <div v-else-if="isEmpty === true" size-full flex="~ justify-center items-center">
          <el-empty :image-size="80" />
        </div>
        <!-- 没有更多数据了 -->
        <div v-else-if="isFinished" flex justify-center text-sm c-neutral-4>
          没有更多数据了
        </div>
      </template>
    </MixteInfiniteScroll>

    <el-button
      type="primary"
      @click="infiniteScrollRef?.reset()"
    >
      重置  
    </el-button>
  </div>
</template>

<script lang="ts" setup>
  import type { InjectCode, InjectCodeLang } from '@/.vitepress/components/DemoCard/types';
  import { MixteInfiniteScroll, type MixteInfiniteScrollInstance } from '@mixte/components/infinite-scroll';
  import axios from 'axios';

  const infiniteScrollRef = ref<MixteInfiniteScrollInstance>();

  const data = ref<{ name: string }[]>([]);

  async function load(pageNum: number, pageSize: number) {
    const res = await axios.post<
      ResponseData<ResponseListData<{ name: string }>>
    >('https://apifoxmock.com/m1/4781098-4434938-default/list/items', {
      pageNum,
      pageSize,
    });
    const resData = res.data.data.list ?? [];

    data.value.push(
      ...resData,
    );

    return resData;
  }
<\/script>
    `),
    { direction: 'rtl' },
  );
</script>
