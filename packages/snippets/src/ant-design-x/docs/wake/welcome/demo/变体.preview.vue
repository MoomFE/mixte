<template>
  <Welcome
    variant="borderless"
    icon="https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*s5sNRo5LjfQAAAAAAAAAAAAADgCCAQ/fmt.webp"
    title="Hello, I'm Ant Design X"
    description="Base on Ant Design, AGI product interface solution, create a better intelligent vision~"
  >
    <template #extra>
      <el-space>
        <el-button class="rounded!" circle>
          <i-ant-design-share-alt-outlined />
        </el-button>
        <el-button class="rounded!" circle>
          <i-ant-design-ellipsis-outlined />
        </el-button>
      </el-space>
    </template>
  </Welcome>
</template>

<script lang="ts" setup>
  import { Welcome } from '@mixte/snippets/ant-design-x';
  import '@mixte/snippets/ant-design-x/patch-for-react-19';
</script>
