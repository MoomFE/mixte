import { random, randomLetter, randomLowercaseLetter, randomNatural, randomUppercaseLetter } from './index';

describe('randomNatural', () => {
  test('在传入的两个自然数之间随机生成一个自然数', () => {
    const nums = new Set<number>();

    for (let i = 0; i < 10000; i++)
      nums.add(randomNatural(0, 100));

    expect(
      Array.from(nums).sort((a, b) => a - b),
    ).toEqual(
      Array.from({ length: 101 }, (_, i) => i),
    );
  });
});

describe('random', () => {
  test('在传入的两个数字之间随机生成一个数字', () => {
    const nums = new Set<number>();

    for (let i = 0; i < 10000; i++)
      nums.add(random(0, 100));

    expect(
      Array.from(nums).sort((a, b) => a - b),
    ).toEqual(
      Array.from({ length: 101 }, (_, i) => i),
    );
  });

  test('支持传入数值均为负数', () => {
    const nums = new Set<number>();

    for (let i = 0; i < 10000; i++)
      nums.add(random(-100, -1));

    expect(
      Array.from(nums).sort((a, b) => a - b),
    ).toEqual(
      Array.from({ length: 100 }, (_, i) => i - 100),
    );
  });

  test('支持传入正数和负数', () => {
    const nums = new Set<number>();

    for (let i = 0; i < 10000; i++)
      nums.add(random(-50, 50));

    expect(
      Array.from(nums).sort((a, b) => a - b),
    ).toEqual(
      Array.from({ length: 101 }, (_, i) => i - 50),
    );
  });

  test('支持第一个参数大于第二个参数', () => {
    const nums = new Set<number>();

    for (let i = 0; i < 10000; i++)
      nums.add(random(50, -50));

    expect(
      Array.from(nums).sort((a, b) => a - b),
    ).toEqual(
      Array.from({ length: 101 }, (_, i) => i - 50),
    );
  });

  test('不传参数, 则默认在 0 和 10 之间随机生成一个数字', () => {
    const nums = new Set<number>();

    for (let i = 0; i < 1000; i++)
      nums.add(random());

    expect(
      Array.from(nums).sort((a, b) => a - b),
    ).toEqual(
      Array.from({ length: 11 }, (_, i) => i),
    );
  });

  test('如果只传了一个参数, 则默认在 0 和传入参数之间随机生成一个数字', () => {
    const nums = new Set<number>();

    for (let i = 0; i < 10000; i++)
      nums.add(random(100));

    expect(
      Array.from(nums).sort((a, b) => a - b),
    ).toEqual(
      Array.from({ length: 101 }, (_, i) => i),
    );
  });
});

describe('randomLowercaseLetter', () => {
  test('随机一个小写英文字母', () => {
    const letters = new Set<string>();

    for (let i = 0; i < 2600; i++)
      letters.add(randomLowercaseLetter());

    expect(
      Array.from(letters).sort(),
    ).toEqual(['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']);
  });
});

describe('randomUppercaseLetter', () => {
  test('随机一个大写英文字母', () => {
    const letters = new Set<string>();

    for (let i = 0; i < 2600; i++)
      letters.add(randomUppercaseLetter());

    expect(
      Array.from(letters).sort(),
    ).toEqual(['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']);
  });
});

describe('randomLetter', () => {
  test('默认随机一个小写英文字母', () => {
    const letters = new Set<string>();

    for (let i = 0; i < 2600; i++)
      letters.add(randomLetter());

    expect(
      Array.from(letters).sort(),
    ).toEqual(['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']);
  });

  test('传入 true, 则随机一个大写英文字母', () => {
    const letters = new Set<string>();

    for (let i = 0; i < 2600; i++)
      letters.add(randomLetter(true));

    expect(
      Array.from(letters).sort(),
    ).toEqual(['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']);
  });

  test('传入 false, 则随机一个小写英文字母', () => {
    const letters = new Set<string>();

    for (let i = 0; i < 2600; i++)
      letters.add(randomLetter(false));

    expect(
      Array.from(letters).sort(),
    ).toEqual(['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']);
  });
});
