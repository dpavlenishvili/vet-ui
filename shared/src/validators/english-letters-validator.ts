import { customPatternValidator } from './custom-pattern-validator';

export const englishLettersValidator = customPatternValidator('^[a-zA-Z]+$', { englishLettersError: true });