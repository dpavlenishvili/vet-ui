import { customPatternValidator } from './custom-pattern-validator';

export const numericValidator = customPatternValidator('^[0-9]+$', { numericError: true });
