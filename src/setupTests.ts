import { expect } from 'vitest';
import * as matchers from '@testing-library/jest-dom/matchers';

// Attach jest-dom matchers to Vitest's expect
expect.extend(matchers as unknown as Record<string, unknown>);
