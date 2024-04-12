import { isBoolean, random, randomBoolean, randomLetter, randomLowercaseLetter, randomNatural, randomString, randomUppercaseLetter } from 'mixte';
import { types } from '../is/testTypes';

describe('randomNatural', () => {
  it('在传入的两个自然数之间随机生成一个自然数', () => {
    const nums = new Set<number>();

    for (let i = 0; i < 10000; i++)
      nums.add(randomNatural(0, 100));

    expect(
      Array.from(nums).sort((a, b) => a - b),
    ).toStrictEqual(
      Array.from({ length: 101 }, (_, i) => i),
    );
  });

  it('类型测试', () => {
    expectTypeOf(randomNatural).parameter(0).toBeNumber();
    expectTypeOf(randomNatural).parameter(1).toBeNumber();
    expectTypeOf(randomNatural(0, 10)).toBeNumber();
  });
});

describe('random', () => {
  it('在传入的两个数字之间随机生成一个数字', () => {
    const nums = new Set<number>();

    for (let i = 0; i < 10000; i++)
      nums.add(random(0, 100));

    expect(
      Array.from(nums).sort((a, b) => a - b),
    ).toStrictEqual(
      Array.from({ length: 101 }, (_, i) => i),
    );
  });

  it('支持传入数值均为负数', () => {
    const nums = new Set<number>();

    for (let i = 0; i < 10000; i++)
      nums.add(random(-100, -1));

    expect(
      Array.from(nums).sort((a, b) => a - b),
    ).toStrictEqual(
      Array.from({ length: 100 }, (_, i) => i - 100),
    );
  });

  it('支持传入正数和负数', () => {
    const nums = new Set<number>();

    for (let i = 0; i < 10000; i++)
      nums.add(random(-50, 50));

    expect(
      Array.from(nums).sort((a, b) => a - b),
    ).toStrictEqual(
      Array.from({ length: 101 }, (_, i) => i - 50),
    );
  });

  it('支持第一个数字大于第二个数字', () => {
    const nums = new Set<number>();

    for (let i = 0; i < 10000; i++)
      nums.add(random(50, -50));

    expect(
      Array.from(nums).sort((a, b) => a - b),
    ).toStrictEqual(
      Array.from({ length: 101 }, (_, i) => i - 50),
    );
  });

  it('不传参数, 则默认在 0 和 10 之间随机生成一个数字', () => {
    const nums = new Set<number>();

    for (let i = 0; i < 1000; i++)
      nums.add(random());

    expect(
      Array.from(nums).sort((a, b) => a - b),
    ).toStrictEqual(
      Array.from({ length: 11 }, (_, i) => i),
    );
  });

  it('如果只传了一个参数, 则默认在 0 和传入数字之间随机生成一个数字', () => {
    const nums = new Set<number>();

    for (let i = 0; i < 10000; i++)
      nums.add(random(100));

    expect(
      Array.from(nums).sort((a, b) => a - b),
    ).toStrictEqual(
      Array.from({ length: 101 }, (_, i) => i),
    );
  });

  it('类型测试', () => {
    expectTypeOf(random).parameters.toEqualTypeOf<[]>();
    expectTypeOf(random(0, 10)).toBeNumber();
    expectTypeOf(random(10)).toBeNumber();
    expectTypeOf(random()).toBeNumber();
  });
});

describe('randomLowercaseLetter', () => {
  it('随机一个小写英文字母', () => {
    const letters = new Set<string>();

    for (let i = 0; i < 2600; i++)
      letters.add(randomLowercaseLetter());

    expect(
      Array.from(letters).sort(),
    ).toStrictEqual(['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']);
  });

  it('类型测试', () => {
    expectTypeOf(randomLowercaseLetter).parameter(0).toBeUndefined();
    expectTypeOf(randomLowercaseLetter()).toBeString();
  });
});

describe('randomUppercaseLetter', () => {
  it('随机一个大写英文字母', () => {
    const letters = new Set<string>();

    for (let i = 0; i < 2600; i++)
      letters.add(randomUppercaseLetter());

    expect(
      Array.from(letters).sort(),
    ).toStrictEqual(['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']);
  });

  it('类型测试', () => {
    expectTypeOf(randomUppercaseLetter).parameter(0).toBeUndefined();
    expectTypeOf(randomUppercaseLetter()).toBeString();
  });
});

describe('randomLetter', () => {
  it('默认随机一个小写或大写英文字母', () => {
    const letters = new Set<string>();

    for (let i = 0; i < 5200; i++)
      letters.add(randomLetter());

    expect(
      Array.from(letters).sort(),
    ).toStrictEqual(
      [
        'a',
        'b',
        'c',
        'd',
        'e',
        'f',
        'g',
        'h',
        'i',
        'j',
        'k',
        'l',
        'm',
        'n',
        'o',
        'p',
        'q',
        'r',
        's',
        't',
        'u',
        'v',
        'w',
        'x',
        'y',
        'z',
        'A',
        'B',
        'C',
        'D',
        'E',
        'F',
        'G',
        'H',
        'I',
        'J',
        'K',
        'L',
        'M',
        'N',
        'O',
        'P',
        'Q',
        'R',
        'S',
        'T',
        'U',
        'V',
        'W',
        'X',
        'Y',
        'Z',
      ].sort(),
    );
  });

  it('传入 true, 则随机一个大写英文字母', () => {
    const letters = new Set<string>();

    for (let i = 0; i < 2600; i++)
      letters.add(randomLetter(true));

    expect(
      Array.from(letters).sort(),
    ).toStrictEqual(['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']);
  });

  it('传入 false, 则随机一个小写英文字母', () => {
    const letters = new Set<string>();

    for (let i = 0; i < 2600; i++)
      letters.add(randomLetter(false));

    expect(
      Array.from(letters).sort(),
    ).toStrictEqual(['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']);
  });

  it('传入非布尔值, 则随机一个小写或大写英文字母', () => {
    Object.values(types).forEach((values) => {
      values.forEach((value) => {
        const letters = new Set<string>();
        const count = isBoolean(value) ? 2600 : 5200;

        for (let i = 0; i < count; i++)
          letters.add(randomLetter(value));

        if (value === true) {
          expect(
            Array.from(letters).sort(),
          ).toStrictEqual(['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']);
        }
        else if (value === false) {
          expect(
            Array.from(letters).sort(),
          ).toStrictEqual(['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']);
        }
        else {
          expect(
            Array.from(letters).sort(),
          ).toStrictEqual(
            [
              'a',
              'b',
              'c',
              'd',
              'e',
              'f',
              'g',
              'h',
              'i',
              'j',
              'k',
              'l',
              'm',
              'n',
              'o',
              'p',
              'q',
              'r',
              's',
              't',
              'u',
              'v',
              'w',
              'x',
              'y',
              'z',
              'A',
              'B',
              'C',
              'D',
              'E',
              'F',
              'G',
              'H',
              'I',
              'J',
              'K',
              'L',
              'M',
              'N',
              'O',
              'P',
              'Q',
              'R',
              'S',
              'T',
              'U',
              'V',
              'W',
              'X',
              'Y',
              'Z',
            ].sort(),
          );
        }
      });
    });
  });

  it('类型测试', () => {
    expectTypeOf(randomLetter).parameters.toEqualTypeOf<[boolean?]>();
    expectTypeOf(randomLetter()).toBeString();
  });
});

describe('randomString', () => {
  it('默认生成一个长度为 12 的随机小写字母字符串', () => {
    for (let i = 0; i < 1000; i++)
      expect(randomString().length).toStrictEqual(12);
  });

  it('首个参数可以指定生成的字符串长度', () => {
    for (let i = 0; i < 1000; i++)
      expect(randomString(i).length).toStrictEqual(i);
  });

  it('指定生成仅有小写字母的字符串, 这也是默认生成规则', () => {
    for (let i = 100; i < 1000; i++) {
      const str = randomString(i);
      const str2 = randomString(i, {
        lowercase: true,
      });

      expect(str.length).toStrictEqual(i);
      expect(str2.length).toStrictEqual(i);
      expect(/^[a-z]+$/.test(str)).toStrictEqual(true);
      expect(/^[a-z]+$/.test(str2)).toStrictEqual(true);
    }
  });

  it('指定生成仅有大写字母的字符串', () => {
    for (let i = 100; i < 1000; i++) {
      const str = randomString(i, {
        lowercase: false,
        uppercase: true,
      });

      expect(str.length).toStrictEqual(i);
      expect(/^[A-Z]+$/.test(str)).toStrictEqual(true);
    }
  });

  it('指定生成仅有数字的字符串', () => {
    for (let i = 100; i < 1000; i++) {
      const str = randomString(i, {
        lowercase: false,
        uppercase: false,
        number: true,
      });
      const str2 = randomString(i, {
        lowercase: false,
        number: true,
      });

      expect(str.length).toStrictEqual(i);
      expect(str2.length).toStrictEqual(i);
      expect(/^[0-9]+$/.test(str)).toStrictEqual(true);
      expect(/^[0-9]+$/.test(str2)).toStrictEqual(true);
    }
  });

  it('指定生成包含小写字母和大写字母的字符串', () => {
    for (let i = 100; i < 1000; i++) {
      const str = randomString(i, {
        uppercase: true,
      });
      const str2 = randomString(i, {
        lowercase: true,
        uppercase: true,
      });

      expect(str.length).toStrictEqual(i);
      expect(str2.length).toStrictEqual(i);
      expect(/^[a-zA-Z]+$/.test(str)).toStrictEqual(true);
      expect(/^[a-zA-Z]+$/.test(str2)).toStrictEqual(true);
      expect(/^[a-z]+$/.test(str)).toStrictEqual(false);
      expect(/^[a-z]+$/.test(str2)).toStrictEqual(false);
      expect(/^[A-Z]+$/.test(str)).toStrictEqual(false);
      expect(/^[A-Z]+$/.test(str2)).toStrictEqual(false);
    }
  });

  it('指定生成包含小写字母和数字的字符串', () => {
    for (let i = 100; i < 1000; i++) {
      const str = randomString(i, {
        number: true,
      });
      const str2 = randomString(i, {
        lowercase: true,
        number: true,
      });

      expect(str.length).toStrictEqual(i);
      expect(str2.length).toStrictEqual(i);
      expect(/^[a-z0-9]+$/.test(str)).toStrictEqual(true);
      expect(/^[a-z0-9]+$/.test(str2)).toStrictEqual(true);
      expect(/^[a-z]+$/.test(str)).toStrictEqual(false);
      expect(/^[a-z]+$/.test(str2)).toStrictEqual(false);
      expect(/^[0-9]+$/.test(str)).toStrictEqual(false);
      expect(/^[0-9]+$/.test(str2)).toStrictEqual(false);
    }
  });

  it('指定生成包含大写字母和数字的字符串', () => {
    for (let i = 100; i < 1000; i++) {
      const str = randomString(i, {
        lowercase: false,
        uppercase: true,
        number: true,
      });

      expect(str.length).toStrictEqual(i);
      expect(/^[A-Z0-9]+$/.test(str)).toStrictEqual(true);
      expect(/^[A-Z]+$/.test(str)).toStrictEqual(false);
      expect(/^[0-9]+$/.test(str)).toStrictEqual(false);
    }
  });

  it('指定生成包含小写字母、大写字母和数字的字符串', () => {
    for (let i = 100; i < 1000; i++) {
      const str = randomString(i, {
        uppercase: true,
        number: true,
      });
      const str2 = randomString(i, {
        lowercase: true,
        uppercase: true,
        number: true,
      });

      expect(str.length).toStrictEqual(i);
      expect(str2.length).toStrictEqual(i);
      expect(/^[a-zA-Z0-9]+$/.test(str)).toStrictEqual(true);
      expect(/^[a-zA-Z0-9]+$/.test(str2)).toStrictEqual(true);
      expect(/^[a-z]+$/.test(str)).toStrictEqual(false);
      expect(/^[a-z]+$/.test(str2)).toStrictEqual(false);
      expect(/^[A-Z]+$/.test(str)).toStrictEqual(false);
      expect(/^[A-Z]+$/.test(str2)).toStrictEqual(false);
      expect(/^[0-9]+$/.test(str)).toStrictEqual(false);
      expect(/^[0-9]+$/.test(str2)).toStrictEqual(false);
    }
  });

  it('关闭所有选项, 方法将会报错', () => {
    expect(() => {
      randomString(10, {
        lowercase: false,
        uppercase: false,
        number: false,
      });
    }).toThrow('???');
  });

  it('类型测试', () => {
    expectTypeOf(randomString).parameters.toEqualTypeOf<[number?, {
      lowercase?: boolean;
      uppercase?: boolean;
      number?: boolean;
    }?]>();
    expectTypeOf(randomString()).toBeString();
    expectTypeOf(randomString(10)).toBeString();
    expectTypeOf(randomString(10, {})).toBeString();
    expectTypeOf(randomString(10, { lowercase: true })).toBeString();
    expectTypeOf(randomString(10, { uppercase: true })).toBeString();
    expectTypeOf(randomString(10, { number: true })).toBeString();
    expectTypeOf(randomString(10, { lowercase: true, uppercase: true })).toBeString();
    expectTypeOf(randomString(10, { lowercase: true, number: true })).toBeString();
    expectTypeOf(randomString(10, { uppercase: true, number: true })).toBeString();
    expectTypeOf(randomString(10, { lowercase: true, uppercase: true, number: true })).toBeString();
  });
});

describe('randomBoolean', () => {
  it('生成一个随机的 boolean 值', () => {
    const booleans = new Set<boolean>();

    for (let i = 0; i < 200; i++)
      booleans.add(randomBoolean());

    expect(
      Array.from(booleans).sort(),
    ).toStrictEqual(
      [false, true],
    );
  });
});
