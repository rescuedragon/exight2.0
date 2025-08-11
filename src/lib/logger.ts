export const log = (...args: unknown[]): void => {
  if (import.meta && import.meta.env && import.meta.env.DEV) {
    // eslint-disable-next-line no-console
    console.log(...args);
  }
};

export const warn = (...args: unknown[]): void => {
  if (import.meta && import.meta.env && import.meta.env.DEV) {
    // eslint-disable-next-line no-console
    console.warn(...args);
  }
};

export const error = (...args: unknown[]): void => {
  if (import.meta && import.meta.env && import.meta.env.DEV) {
    // eslint-disable-next-line no-console
    console.error(...args);
  }
};


