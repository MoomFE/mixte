describe('createNamedSharedComposable', () => {
  test('传入函数, 返回一个新函数, 接收 name 参数和原有函数的所有参数', () => {
    const fn = (a: number, b: number) => [a, b];
    const newFn = createNamedSharedComposable(fn);

    expect(fn).not.toBe(newFn);

    expect(fn(1, 2)).toEqual([1, 2]);
    expect(newFn('name', 1, 2)).toEqual([1, 2]);
  });
});
