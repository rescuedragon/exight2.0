import { describe, it, expect } from 'vitest';
import { cn } from './utils';

describe('cn utility', () => {
  it('merges class names and removes duplicates', () => {
    const result = cn('px-2 py-1', 'px-2', { hidden: false, block: true });
    expect(result).toContain('py-1');
    expect(result).toContain('block');
    expect(result).not.toMatch(/px-2\s+px-2/);
  });
});
