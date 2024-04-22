import { AfterViewInit, ChangeDetectorRef, DestroyRef, Directive, inject } from '@angular/core';
import { WizardStep } from './wizard-step.class';
import { FormGroupDirective, FormGroupName, NgForm } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { startWith } from 'rxjs';

@Directive({
    selector: '[vUiWizardStepControlContent]',
    standalone: true,
})
export class WizardStepControlContentDirective implements AfterViewInit {
    wizardStep = inject(WizardStep);
    _formGroup = inject(FormGroupDirective, { optional: true });
    _formGroupName = inject(FormGroupName, { optional: true });
    _ngForm = inject(NgForm, { optional: true });

    private destroyRef = inject(DestroyRef);
    private _cdr = inject(ChangeDetectorRef);

    ngAfterViewInit() {
        // Here we can listen to the form changes and update the wizard step valid state
        this._formGroupName?.statusChanges?.pipe(startWith(null), takeUntilDestroyed(this.destroyRef)).subscribe(() => {
            this.wizardStep.isValid.set(!!this._formGroupName?.valid);

            this._cdr.detectChanges();
        });

        !this._formGroupName &&
            this._formGroup?.statusChanges?.pipe(startWith(null), takeUntilDestroyed(this.destroyRef)).subscribe(() => {
                this.wizardStep.isValid.set(!!this._formGroup?.valid);

                this._cdr.detectChanges();
            });

        this._ngForm?.statusChanges?.pipe(startWith(null), takeUntilDestroyed(this.destroyRef)).subscribe(() => {
            this.wizardStep.isValid.set(!!this._formGroup?.valid);

            this._cdr.detectChanges();
        });
    }
}
