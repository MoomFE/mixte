import { deepUnref } from '@mixte/use';
import { computed, ref, unref } from 'vue-demi';
import { isPlainObject } from 'mixte';
import { types } from '../../../mixte/src/is/testTypes';

describe('deepUnref', () => {
  test('最基础的作用和 unref 相同', () => {
    const a = ref(1);
    const b = computed(() => a.value + 1);

    expect(unref(a)).toBe(1);
    expect(deepUnref(a)).toBe(1);

    expect(unref(b)).toBe(2);
    expect(deepUnref(b)).toBe(2);

    a.value++;

    expect(unref(a)).toBe(2);
    expect(deepUnref(a)).toBe(2);

    expect(unref(b)).toBe(3);
    expect(deepUnref(b)).toBe(3);
  });

  test('如果传入的是普通对象或数组, 那么会返回对象的副本', () => {
    const a = { a: 1 };
    const b = [1, 2, 3];

    expect(deepUnref(a)).toStrictEqual(a);
    expect(deepUnref(b)).toStrictEqual(b);
    expect(deepUnref(a)).not.toBe(a);
    expect(deepUnref(b)).not.toBe(b);
  });

  test('如果传入的不是普通对象和数组, 那么直接返回传入值的 `unref` 结果', () => {
    Object.values(types).forEach((values) => {
      values.forEach((value) => {
        if (isPlainObject(value) || Array.isArray(value)) {
          const refValue = ref(value);
          const computedValue = computed(() => value);

          expect(deepUnref(value)).toStrictEqual(value);
          expect(deepUnref(refValue)).toStrictEqual(value);
          expect(deepUnref(computedValue)).toStrictEqual(value);

          expect(deepUnref(value)).not.toBe(value);
          expect(deepUnref(refValue)).not.toBe(value);
          expect(deepUnref(computedValue)).not.toBe(value);
        }
        else {
          const refValue = ref(value);
          const computedValue = computed(() => value);

          expect(deepUnref(value)).toBe(value);
          expect(deepUnref(refValue)).toBe(value);
          expect(deepUnref(computedValue)).toBe(value);
        }
      });
    });
  });

  test('会深度解包普通对象内的 ref 和 computed 对象, 包括解包普通对象本身', () => {
    const a = {
      b: ref(1),
      c: computed(() => 2),
      d: {
        e: ref({ f: 3 }),
        f: computed(() => ({ g: 4 })),
        h: [
          ref(5),
          computed(() => 6),
          [
            ref([7]),
            computed(() => [8]),
          ],
        ],
      },
    };
    const refA = ref({
      b: ref(1),
      c: computed(() => 2),
      d: {
        e: ref({ f: 3 }),
        f: computed(() => ({ g: 4 })),
        h: [
          ref(5),
          computed(() => 6),
          [
            ref([7]),
            computed(() => [8]),
          ],
        ],
      },
    });
    const computedA = computed(() => ({
      b: ref(1),
      c: computed(() => 2),
      d: {
        e: ref({ f: 3 }),
        f: computed(() => ({ g: 4 })),
        h: [
          ref(5),
          computed(() => 6),
          [
            ref([7]),
            computed(() => [8]),
          ],
        ],
      },
    }));

    const deepUnrefA = deepUnref(a);
    const deepUnrefRefA = deepUnref(refA);
    const deepUnrefComputedA = deepUnref(computedA);

    const result = {
      b: 1,
      c: 2,
      d: {
        e: { f: 3 },
        f: { g: 4 },
        h: [5, 6, [[7], [8]]],
      },
    };

    expect(deepUnrefA).toStrictEqual(result);
    expect(deepUnrefRefA).toStrictEqual(result);
    expect(deepUnrefComputedA).toStrictEqual(result);
  });

  test('会深度解包数组内的 ref 和 computed 对象, 包括解包数组本身', () => {
    const a = [
      ref(1),
      computed(() => 2),
      [
        ref([3]),
        computed(() => [4]),
        [
          ref({ a: 5 }),
          computed(() => ({ b: 6 })),
        ],
      ],
    ];
    const refA = ref([
      ref(1),
      computed(() => 2),
      [
        ref([3]),
        computed(() => [4]),
        [
          ref({ a: 5 }),
          computed(() => ({ b: 6 })),
        ],
      ],
    ]);
    const computedA = computed(() => [
      ref(1),
      computed(() => 2),
      [
        ref([3]),
        computed(() => [4]),
        [
          ref({ a: 5 }),
          computed(() => ({ b: 6 })),
        ],
      ],
    ]);

    const deepUnrefA = deepUnref(a);
    const deepUnrefRefA = deepUnref(refA);
    const deepUnrefComputedA = deepUnref(computedA);

    const result = [
      1,
      2,
      [
        [3],
        [4],
        [{ a: 5 }, { b: 6 }],
      ],
    ];

    expect(deepUnrefA).toStrictEqual(result);
    expect(deepUnrefRefA).toStrictEqual(result);
    expect(deepUnrefComputedA).toStrictEqual(result);
  });
});
