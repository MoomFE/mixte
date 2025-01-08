<template>
  <div size-full min-h-50vmin relative>
    <div size-full absolute top-0 left-0>
      <Lottery ref="lotteryRef" :users="users" />
    </div>
  </div>

  <div>
    <el-button :loading="lotteryRef?.isTable && lotteryRef.isTransforming" @click="lotteryRef?.transformToTable()">转换为阵列</el-button>
    <el-button :loading="lotteryRef?.isSphere && lotteryRef.isTransforming" @click="lotteryRef?.transformToSphere()">转换为球型</el-button>
    <el-button @click="lotteryRef?.isRotating ? lotteryRef.stopRotate() : lotteryRef?.rotate()">{{ lotteryRef?.isRotating ? '停止' : '' }}旋转</el-button>
  </div>
  <div flex="~ items-center" text-sm bg="neutral-1" mt-2 p="x4 y1">
    <div flex="~ items-center gap-3" mr-4>
      抽取
      <el-input-number v-model="num" :min="1" />
      个用户
    </div>
    <el-button type="primary" @click="lotteryRef?.selectCard(randomUsers())">开始</el-button>
    <el-button @click="lotteryRef?.resetCard()">重置</el-button>
  </div>
</template>

<script lang="ts" setup>
  import type { LotteryInstance, User } from '@mixte/snippets/lottery';
  import { Lottery } from '@mixte/snippets/lottery';
  import { random } from 'mixte';
  import { users } from './demo/users';
  import '@mixte/snippets/dist/lottery/css/index.scss';

  const lotteryRef = ref<LotteryInstance>();

  const num = ref(6);

  function randomUsers() {
    const usersSet = new Set<User>();

    while (usersSet.size < num.value) {
      usersSet.add(users[random(0, users.length - 1)]);
    }

    return [...usersSet];
  }
</script>
