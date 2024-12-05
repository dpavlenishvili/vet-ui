import { customPatternValidator } from './custom-pattern-validator';

export const georgianLettersValidator = customPatternValidator('^[\u10A0-\u10FF]+$', { georgianLettersError: true });
