<template>
  <Bubble
    :avatar="{ icon: AntDesignUserOutlined }"
    content="Hello, welcome to use Ant Design X! Just ask if you have any questions."
    header="Ant Design X"
  >
    <template #footer>
      <el-button class="rounded!" size="small" text circle>
        <i-ant-design-sync-outlined class="size-4" />
      </el-button>
      <el-button class="rounded! ml-1!" size="small" text circle>
        <i-ant-design-copy-outlined class="size-4" />
      </el-button>
    </template>
  </Bubble>
</template>

<script lang="ts" setup>
  import { Bubble } from '@mixte/snippets/ant-design-x';
  import AntDesignUserOutlined from '~icons/ant-design/user-outlined';
  import '@mixte/snippets/ant-design-x/patch-for-react-19';
</script>
