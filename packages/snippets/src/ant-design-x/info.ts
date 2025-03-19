import { defineDocInfo } from '@/.vitepress/types/info';

export default defineDocInfo({
  title: 'Ant Design X',
  sidebarTitle: 'Ant Design X',
  childrenGroupInfo: {
    wake: {
      sidebarTitle: '唤醒',
    },
    express: {
      sidebarTitle: '表达',
    },
    tools: {
      sidebarTitle: '工具',
    },
  },
  childrenInfo: {
    'sender': {
      name: '输入框',
      title: 'Sender',
      sidebarTitle: 'Sender',
    },
    'welcome': {
      name: '欢迎',
      title: 'Welcome',
      sidebarTitle: 'Welcome',
    },
    'x-provider': {
      name: '全局化配置',
      title: 'XProvider',
      sidebarTitle: 'XProvider',
    },
  },
});
