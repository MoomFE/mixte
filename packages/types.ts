export interface ResponseData<T = any> {
  code: `${number}`;
  data: T;
  message: string;
}

export interface ResponseListData<T = any> {
  list: (T & Record<string, any>)[];
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
  /** 年龄 */
  age: number;
  /** 性别 */
  gender: '男' | '女' | '未知';
  /** 性别值 */
  genderValue: 1 | 2 | -1;
  /** 邮箱 */
  email: string;
  /** 地址 */
  address: string;
  /** 状态 */
  status: '启用' | '禁用';
  /** 状态值 */
  statusValue: 1 | -1;
}
