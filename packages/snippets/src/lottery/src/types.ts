export interface LotteryProps {
  /** 用户列表 */
  users: User[];
  /** 是否开启闪烁效果 */
  shine?: boolean;
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
