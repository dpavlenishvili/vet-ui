import { customPatternValidator } from './custom-pattern-validator';

export const personalNumberValidator = customPatternValidator('^[0-9]{11}$', {
  personalNumberError: true,
});
