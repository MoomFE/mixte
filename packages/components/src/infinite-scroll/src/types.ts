import type { Awaitable } from '@vueuse/core';

export const DefaultData = Symbol('data');

export interface InfiniteScrollProps<T extends any[]> {
  /**
   * 双向绑定的数据源, 当传入后, 将会影响以下行为
   * 1. 将在执行 reset 时自动清空
   * 2. 前置内容/后置内容插槽将会接收到 isEmpty 属性
   */
  data?: T;

  /**
   * 加载数据方法
   * @param pageNum 当前页码
   * @param pageSize 每页条数
   */
  load?: (pageNum: number, pageSize: number) => Awaitable<undefined | T>;

  /**
   * 触发加载的距离阈值
   * @default 0
   */
  distance?: number;

  /**
   * 监听滚动的方向
   * @default 'bottom'
   */
  direction?: 'top' | 'bottom' | 'left' | 'right';

  /**
   * 加载更多之间的间隔时间 ( 以避免过多的调用 ). 单位：毫秒
   *
   * @default 100
   */
  interval?: number;

  /**
   * 一个函数, 用于判断是否可以加载更多内容.
   * 如果允许加载更多内容, 则应返回 true, 否则返回 false
   */
  canLoad?: () => boolean;
}

interface SlotProps {
  /**
   * 是否正在加载数据
   */
  isLoading: boolean;
  /**
   * 是否数据源为空 ( 仅在组件传入 data 时有值 )
   */
  isEmpty: boolean | undefined;
  /**
   * 是否已经加载完所有数据
   */
  isFinished: boolean;
  /**
   * 加载失败时的错误信息
   */
  error: any;
}

export interface InfiniteScrollSlots {
  /** 前置内容 */
  prepend?: (props: SlotProps) => any;
  /** 后置内容 */
  append?: (props: SlotProps) => any;
  /** 默认插槽 */
  default?: () => any;
}
