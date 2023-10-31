import { Injectable } from '@angular/core';
import { AbstractControl, FormGroupDirective, NgForm } from '@angular/forms';

@Injectable({ providedIn: 'root' })
export class ErrorStateMatcher {
    isErrorState(control: AbstractControl | null, form: FormGroupDirective | NgForm | null): boolean {
        return !!(control && control.invalid && (control.touched || (form && form.submitted)));
    }
}
