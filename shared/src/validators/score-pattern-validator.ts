import { customPatternValidator } from './custom-pattern-validator';

export const scoreValidator = customPatternValidator(/^[0-4]$/, {
  invalidScore: true,
});
