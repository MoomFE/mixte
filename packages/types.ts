export interface ResponseData<T = any> {
  code: `${number}`;
  data: T;
  message: string;
}

export interface ResponseListData<T = any> {
  list: T[];
  pageSize: number;
  pageNum: number;
}

export interface User {
  id: string;
  /** 姓名 */
  name: string;
  /** 英文名 */
  nameEn: string;
  /** 头像 */
  avatar: string;
  /** 邮箱 */
  email: string;
  /** 地址 */
  address: string;
}
