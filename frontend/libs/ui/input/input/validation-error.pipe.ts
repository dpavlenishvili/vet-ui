import { Pipe, PipeTransform } from '@angular/core';
import { ValidationErrors } from '@angular/forms';
import { TranslocoService } from '@ngneat/transloco';

@Pipe({
    name: 'validationErrorPipe',
    standalone: true,
    pure: false,
})
export class ValidationErrorPipe implements PipeTransform {
    constructor(private translocoService: TranslocoService) {}

    transform(formErrors: ValidationErrors | null | undefined): string | null {
        if (!formErrors) {
            return null;
        } else {
            const keys = Object.keys(formErrors);
            const key = keys[0];

            let requiredLength = null;
            let actualLength = null;

            requiredLength = formErrors[key]?.requiredLength;
            actualLength = formErrors[key]?.actualLength;

            return this.translocoService.translate(`errors.${key}`, { requiredLength, actualLength });
        }
    }
}
