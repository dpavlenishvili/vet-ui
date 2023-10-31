import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WrapperCardComponent } from '@vet/ui/card';
import { RadioButtonComponent, RadioButtonGroupComponent } from '@vet/ui/radio-button';
import {
    AbstractControl,
    FormControl,
    FormGroup,
    FormGroupDirective,
    NgForm,
    ReactiveFormsModule,
} from '@angular/forms';
import { ErrorStateMatcher, FormErrorComponent, FormItemComponent } from '@vet/ui/form-item';

class CustomErrorStateMatcher extends ErrorStateMatcher {
    override isErrorState(control: AbstractControl | null, form: FormGroupDirective | NgForm | null): boolean {
        return !!(control && !control.value && form && form.dirty);
    }
}

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
    ],
    templateUrl: './features-registration.component.html',
    styleUrls: ['./features-registration.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {
            provide: ErrorStateMatcher,
            useClass: CustomErrorStateMatcher,
        },
    ],
})
export class FeaturesRegistrationComponent implements OnInit {
    registrationForm = new FormGroup({
        radioButtons: new FormControl(null, [() => ({ required: true })]),
    });

    ngOnInit() {
        this.registrationForm.get('radioButtons')?.valueChanges.subscribe((res) => {
            console.log(res);
        });
    }

    onSubmit() {
        this.registrationForm.markAsDirty();
        console.log(this.registrationForm.value);
    }
}
