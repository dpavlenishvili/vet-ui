import { customPatternValidator } from './custom-pattern-validator';

export const passwordPatternValidator = customPatternValidator(
  '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&,.])[A-Za-z\\d@$!%*?&,.]{8,}$',
  {
    passwordPattern: true,
  }
);
