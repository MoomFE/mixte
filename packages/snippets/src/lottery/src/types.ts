export interface LotteryProps {
  /** 用户列表 */
  users: User[];
  /** 是否开启闪烁效果 */
  shine?: boolean;
  /**
   * 更新选中卡片样式的方法
   * @param el 选中的卡片元素
   */
  updateSelectCard?: (el: HTMLDivElement, user: User) => void;
}

/** 用户信息 */
export interface User {
  /** 用户 ID */
  id: string;
  /** 用户名 */
  name: string;
  /** 工号 */
  jobNumber?: string;

  [key: string]: any;
}
