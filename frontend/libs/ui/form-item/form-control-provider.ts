import { NgControl } from '@angular/forms';

export abstract class FormControlProvider {
    abstract id: string;
    abstract ngControl: NgControl | null;
}
