import { NgControl } from '@angular/forms';

export abstract class FormControlProvider {
    abstract ngControl: NgControl;
}
