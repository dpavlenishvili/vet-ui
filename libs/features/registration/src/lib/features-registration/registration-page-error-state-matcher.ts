import { AbstractControl } from '@angular/forms';

export class RegistrationPageErrorStateMatcher {
    isErrorState(control: AbstractControl | null): boolean {
        return <boolean>(control && control.invalid && control.touched);
    }
}
