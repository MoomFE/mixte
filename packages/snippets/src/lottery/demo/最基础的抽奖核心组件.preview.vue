<template>
  <div w-full aspect-video min-h-50vh max-h-80vh relative>
    <div size-full absolute top-0 left-0>
      <Lottery ref="lotteryRef" :users :shine />
    </div>
  </div>

  <el-divider class="mb-3!" content-position="left">传参</el-divider>

  <div>
    <el-checkbox v-model="shine" label="是否开启闪烁效果" />
  </div>

  <el-divider content-position="left">功能</el-divider>

  <div>
    <el-button @click="lotteryRef?.transformToTable()">
      转换为阵列
    </el-button>
    <el-button @click="lotteryRef?.transformToSphere()">
      转换为球型
    </el-button>
    <el-button @click="lotteryRef?.isRotating ? lotteryRef.stopRotate() : lotteryRef?.rotate()">
      {{ lotteryRef?.isRotating ? '停止' : '' }}旋转
    </el-button>
  </div>

  <div flex="~ items-center" text-sm bg="neutral-1 dark:neutral-8" mt-2 p="x4 y1">
    <div flex="~ items-center gap-3" mr-4>
      抽取
      <el-input-number v-model="num" :min="1" :max="users.length" />
      个用户
    </div>
    <el-button type="primary" @click="lotteryRef?.select(randomUsers())">开始</el-button>
    <el-button @click="lotteryRef?.reset()">重置</el-button>
  </div>
</template>

<script lang="ts" setup>
  import type { LotteryInstance, User } from '@mixte/snippets/lottery';
  import { Lottery } from '@mixte/snippets/lottery';
  import { random } from 'mixte';
  import { users } from './users';
  import '@mixte/snippets/dist/lottery/css/index.scss';

  const lotteryRef = ref<LotteryInstance>();

  const shine = ref(true);

  const num = ref(6);

  function randomUsers() {
    const usersSet = new Set<User>();

    while (usersSet.size < num.value) {
      usersSet.add(users[random(0, users.length - 1)]);
    }

    return [...usersSet];
  }
</script>
