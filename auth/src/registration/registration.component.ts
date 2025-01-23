import { ChangeDetectionStrategy, Component, inject, type OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { KENDO_LAYOUT } from '@progress/kendo-angular-layout';
import { StepperActivateEvent } from '@progress/kendo-angular-layout/stepper/events/activate-event';
import { RegistrationCitizenshipComponent } from './registration-citizenship/registration-citizenship.component';
import { RegistrationIdentityCitizenComponent } from './registration-identity-citizen/registration-identity-citizen.component';
import { RegistrationPhoneComponent } from './registration-phone/registration-phone.component';
import { TranslocoPipe } from '@jsverse/transloco';
import { RegistrationIdentityForeignerComponent } from './registration-identity-foreigner/registration-identity-foreigner.component';
import { RegistrationPasswordCreateComponent } from './registration-password-create/registration-password-create.component';
import { RegistrationTermsAndConditionsComponent } from './registration-terms-and-conditions/registration-terms-and-conditions.component';
import {
  georgianLettersValidator,
  mobileNumberValidator,
  passwordMatchValidator,
  passwordPatternValidator,
  personalNumberValidator,
} from '@vet/shared';
import { RegisterService, type UserReq } from '@vet/backend';
import { Router } from '@angular/router';
import { BehaviorSubject, tap } from 'rxjs';

enum CitizenshipType {
  Georgian = 'GEO',
  Foreigner = 'Foreigner',
}

@Component({
  selector: 'vet-registration',
  imports: [
    KENDO_LAYOUT,
    ReactiveFormsModule,
    RegistrationCitizenshipComponent,
    RegistrationIdentityCitizenComponent,
    RegistrationIdentityForeignerComponent,
    RegistrationPhoneComponent,
    TranslocoPipe,
    RegistrationPasswordCreateComponent,
    RegistrationTermsAndConditionsComponent,
  ],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class RegistrationComponent implements OnInit {
  currentStepIndex = 0;
  currentStepSubject = new BehaviorSubject<number>(0);
  currentStep$ = this.currentStepSubject.asObservable();
  formGroup = this.createFormGroup();
  steps = [
    {
      label: 'auth.citizenship_selection',
      title: 'auth.choose_citizenship',
      form: () => this.formGroup.controls.chooseCitizenship,
    },
    {
      label: 'auth.id_verification',
      title: 'auth.fill_in_personal_info',
      form: () =>
        this.citizenship === this.CitizenshipType.Georgian
          ? this.formGroup.controls.checkIdentity
          : this.formGroup.controls.checkIdentityForeigner,
    },
    {
      label: 'auth.phone_verification',
      title: 'auth.enter_phone_number',
      form: () => this.formGroup.controls.phone,
    },
    {
      label: 'auth.password_creation',
      title: 'auth.enter_password',
      form: () => this.formGroup.controls.passwords,
    },
    {
      label: 'auth.terms_and_conditions',
      title: 'auth.terms_and_conditions',
      form: () => this.formGroup.controls.termsAndConditions,
    },
  ];
  CitizenshipType = CitizenshipType;

  private router = inject(Router);
  private registrationService = inject(RegisterService);

  ngOnInit(): void {
    this.clearPhoneVerificationInputs();
    this.handleCitizenshipChange();
  }

  createFormGroup() {
    return new FormGroup({
      chooseCitizenship: new FormGroup({
        citizenship: new FormControl<string | null>(null, Validators.required),
      }),
      checkIdentity: new FormGroup({
        lastname: new FormControl('', [Validators.required, georgianLettersValidator]),
        firstname: new FormControl(''),
        personalNumber: new FormControl('', [Validators.required, personalNumberValidator]),
        dateOfBirth: new FormControl<Date | null>(null),
        gender: new FormControl(''),
      }),
      checkIdentityForeigner: new FormGroup({
        citizenship: new FormControl('', Validators.required),
        lastname: new FormControl('', [Validators.required, georgianLettersValidator]),
        firstname: new FormControl(''),
        personalNumber: new FormControl('', [Validators.required, personalNumberValidator]),
        dateOfBirth: new FormControl<Date | null>(null),
        gender: new FormControl(''),
      }),
      phone: new FormGroup({
        phoneNumber: new FormControl('', [Validators.required, mobileNumberValidator]),
        verificationNumber: new FormControl('', Validators.required),
      }),
      passwords: new FormGroup(
        {
          password: new FormControl('', [Validators.required, passwordPatternValidator]),
          confirmPassword: new FormControl('', [Validators.required, passwordPatternValidator]),
        },
        { validators: passwordMatchValidator },
      ),
      termsAndConditions: new FormGroup({
        accepted: new FormControl(false, Validators.requiredTrue),
      }),
    });
  }

  getUserReq(): UserReq {
    const chooseCitizenship = this.formGroup.get('chooseCitizenship') as FormGroup;
    const checkIdentity = this.formGroup.get('checkIdentity') as FormGroup;
    const checkIdentityForeigner = this.formGroup.get('checkIdentityForeigner') as FormGroup;
    const phone = this.formGroup.get('phone') as FormGroup;
    const passwords = this.formGroup.get('passwords') as FormGroup;

    const isForeigner = chooseCitizenship.get('citizenship')?.value === 'Foreigner';

    const identityGroup = isForeigner ? checkIdentityForeigner : checkIdentity;

    return {
      pid: identityGroup.get('personalNumber')?.value,
      phone: phone.get('phoneNumber')?.value,
      sms_code: phone.get('verificationNumber')?.value,
      first_name: identityGroup.get('firstname')?.value,
      last_name: identityGroup.get('lastname')?.value,
      gender: identityGroup.get('gender')?.value,
      birth_date: identityGroup.get('dateOfBirth')?.value?.toISOString().split('T')[0],
      residential: chooseCitizenship.get('citizenship')?.value,
      password: passwords.get('password')?.value,
      password_confirmation: passwords.get('confirmPassword')?.value,
    };
  }

  get citizenship() {
    return this.formGroup.controls.chooseCitizenship.controls.citizenship.value;
  }

  isStepValid(stepIndex: number): boolean {
    const step = this.steps[stepIndex];

    return step && !!step.form()?.valid;
  }

  onStepChange(event: StepperActivateEvent) {
    if (this.isStepValid(this.currentStepIndex) || event.index < this.currentStepIndex) {
      this.currentStepIndex = event.index;
      this.currentStepSubject.next(this.currentStepIndex);
    } else {
      event.preventDefault();
    }
  }

  onPreviousClick() {
    if (this.currentStepIndex > 0) {
      this.currentStepIndex--;
      this.currentStepSubject.next(this.currentStepIndex);
    }
  }

  onNextClick() {
    if (this.isStepValid(this.currentStepIndex)) {
      if (this.currentStepIndex === this.steps.length - 1) {
        const user = this.getUserReq();
        this.registrationService.register(user).subscribe({
          next: () => {
            this.router.navigate(['/authorization']);
          },
        });
      } else {
        this.currentStepIndex++;
        this.currentStepSubject.next(this.currentStepIndex);
      }
    }
  }

  clearPhoneVerificationInputs() {
    this.currentStep$
      .pipe(
        tap(() => {
          if (this.currentStepIndex <= 2) {
            const phoneGroup = this.formGroup.get('phone') as FormGroup;
            phoneGroup.get('phoneNumber')?.reset();
            phoneGroup.get('verificationNumber')?.reset();
          }
        }),
      )
      .subscribe();
  }

  handleCitizenshipChange() {
    const citizenshipControl = this.formGroup.controls.chooseCitizenship.get('citizenship');

    citizenshipControl?.valueChanges
      .pipe(
        tap(() => {
          this.formGroup.controls.passwords.reset();
        }),
      )
      .subscribe();
  }
}
