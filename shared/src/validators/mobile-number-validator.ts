import { customPatternValidator } from './custom-pattern-validator';

export const mobileNumberValidator = customPatternValidator('^5\\d{8}$', {
    mobileNumber: true,
});
