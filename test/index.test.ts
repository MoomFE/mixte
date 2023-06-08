import { describe, expect, it } from 'vitest';
import { C, a, b } from '../src/index';

describe('test', () => {
  it('should be ok', () => {
    expect(a).toBe(1);

    expect(b).toBeTypeOf('function');
    expect(b()).toBe(2);

    expect(C).toBeTypeOf('function');
    expect(new C().d).toBe(3);
  });
});
