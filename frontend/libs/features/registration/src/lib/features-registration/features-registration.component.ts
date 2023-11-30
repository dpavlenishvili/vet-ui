import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WrapperCardComponent } from '@vet/ui/card';
import { ButtonComponent } from '@vet/ui/button';
import { RadioButtonComponent, RadioButtonGroupComponent } from '@vet/ui/radio-button';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormErrorComponent, FormItemComponent, FormLabelDirective } from '@vet/ui/form-item';
import { InputComponent } from '@vet/ui/input';
import { TranslocoModule } from '@ngneat/transloco';
import { ValidationErrorPipe } from '@vet/ui/input';
import { CheckboxComponent, CheckboxGroupComponent } from '@vet/ui/checkbox';
import { DatepickerComponent } from '@vet/ui/datepicker';

@Component({
    selector: 'lib-features-registration',
    standalone: true,
    imports: [
        CommonModule,
        WrapperCardComponent,
        RadioButtonComponent,
        RadioButtonGroupComponent,
        ReactiveFormsModule,
        FormItemComponent,
        FormErrorComponent,
        InputComponent,
        TranslocoModule,
        ValidationErrorPipe,
        FormLabelDirective,
        ButtonComponent,
        CheckboxComponent,
        CheckboxGroupComponent,
        DatepickerComponent,
    ],
    templateUrl: './features-registration.component.html',
    styleUrls: ['./features-registration.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeaturesRegistrationComponent implements OnInit {
    registrationForm = new FormGroup({
        radioButtons: new FormControl(null, [Validators.required]),
        username: new FormControl(null, [Validators.required, Validators.minLength(5)]),
    });

    checkboxForm = new FormGroup({
        checkbox: new FormControl(),
    });

    multipleCheckboxesForm = new FormGroup({
        checkboxes: new FormControl([2]),
    });
    dt = new Date();

    ngOnInit() {
        this.registrationForm.get('radioButtons')?.valueChanges.subscribe((res) => {
            console.log(res);
        });

        this.checkboxForm.get('checkbox')?.valueChanges.subscribe((res) => {
            console.log(res);
        });
    }

    onSubmit() {
        console.log(this.registrationForm.value);
        console.log(this.checkboxForm.value);
        console.log(this.multipleCheckboxesForm.value);
        this.registrationForm.markAllAsTouched();
    }
}
