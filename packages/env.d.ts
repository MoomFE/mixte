export {};

declare global {
  /** 当前是否在测试构建后的代码 */
  const __TEST_BUILD__: boolean;
}
