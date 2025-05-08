import { ChangeDetectionStrategy, Component, inject, type OnInit, signal } from '@angular/core';
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
  Citizenship,
  georgianLettersValidator,
  mobileNumberValidator,
  passwordMatchValidator,
  passwordPatternValidator,
  personalNumberValidator,
  vetIcons,
  useAlert,
} from '@vet/shared';
import { RegisterService, type UserReq } from '@vet/backend';
import { Router } from '@angular/router';
import { BehaviorSubject, tap } from 'rxjs';
import { ButtonComponent } from '@progress/kendo-angular-buttons';
import { TooltipDirective } from '@progress/kendo-angular-tooltip';

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
    ButtonComponent,
    TooltipDirective,
  ],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class RegistrationComponent implements OnInit {
  alert = useAlert();

  currentStepIndex = 0;
  currentStepSubject = new BehaviorSubject<number>(0);
  currentStep$ = this.currentStepSubject.asObservable();
  formGroup = this.createFormGroup();
  vetIcons = vetIcons;
  isExpanded = signal(true);
  steps = [
    {
      label: 'auth.citizenship_selection',
      title: 'auth.choose_citizenship',
      path: 'citizenship_selection',
      form: () => this.formGroup.controls.chooseCitizenship,
    },
    {
      label: 'auth.id_verification',
      title: 'auth.fill_in_personal_info',
      path: 'id_verification',
      form: () =>
        this.citizenship === this.CitizenshipType.Georgian
          ? this.formGroup.controls.checkIdentity
          : this.formGroup.controls.checkIdentityForeigner,
    },
    {
      label: 'auth.phone_verification',
      title: 'auth.enter_phone_number',
      path: 'phone_verification',
      form: () => this.formGroup.controls.phone,
    },
    {
      label: 'auth.password_creation',
      title: 'auth.enter_password',
      path: 'password_creation',
      form: () => this.formGroup.controls.passwords,
    },
    {
      label: 'auth.terms_and_conditions',
      title: 'auth.terms_and_conditions',
      path: 'terms_and_conditions',
      form: () => this.formGroup.controls.termsAndConditions,
    },
  ];
  CitizenshipType = Citizenship;

  private router = inject(Router);
  private registrationService = inject(RegisterService);

  ngOnInit(): void {
    if (!this.router.url.includes('/citizenship_selection')) {
      void this.router.navigate(['/registration/citizenship_selection']);
    }
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
        residential: new FormControl('', Validators.required),
        lastname: new FormControl('', [Validators.required, georgianLettersValidator]),
        firstname: new FormControl('', [Validators.required, georgianLettersValidator]),
        personalNumber: new FormControl('', Validators.required),
        dateOfBirth: new FormControl<Date | null>(null, Validators.required),
        gender: new FormControl('', Validators.required),
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

    const isForeigner = chooseCitizenship.get('citizenship')?.value === this.CitizenshipType.Foreigner;

    const identityGroup = isForeigner ? checkIdentityForeigner : checkIdentity;

    return {
      pid: identityGroup.get('personalNumber')?.value,
      phone: phone.get('phoneNumber')?.value,
      sms_code: phone.get('verificationNumber')?.value,
      first_name: identityGroup.get('firstname')?.value,
      last_name: identityGroup.get('lastname')?.value,
      gender: identityGroup.get('gender')?.value,
      birth_date: identityGroup.get('dateOfBirth')?.value?.toISOString().split('T')[0],
      residential: isForeigner ? identityGroup.get('residential')?.value : chooseCitizenship.get('citizenship')?.value,
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
      void this.router.navigate([`/registration/${this.steps[this.currentStepIndex].path}`]);
    } else {
      event.preventDefault();
    }
  }

  onPreviousClick() {
    if (this.currentStepIndex > 0) {
      this.currentStepIndex--;
      this.currentStepSubject.next(this.currentStepIndex);
      void this.router.navigate([`/registration/${this.steps[this.currentStepIndex].path}`]);
    }
  }

  onNextClick() {
    if (this.isStepValid(this.currentStepIndex)) {
      if (this.currentStepIndex === this.steps.length - 1) {
        const user = this.getUserReq();
        this.registrationService.register(user).pipe(
          tap({
            next: () => {
              void this.router.navigate(['/authorization'], {
                queryParams: {
                  referrer: 'registration',
                }
              });
            },
            error: (error) => {
              if (error.error.errors) {
                for (const item of error.error.errors) {
                  this.alert.error(item);
                }
              }
            }
          }),
        ).subscribe();
      } else {
        this.currentStepIndex++;
        this.currentStepSubject.next(this.currentStepIndex);
        void this.router.navigate([`/registration/${this.steps[this.currentStepIndex].path}`]);
      }
    }
  }

  onResetForm(citizenship: string) {
    this.formGroup.reset()
    this.formGroup.controls.chooseCitizenship.controls.citizenship.setValue(citizenship);
    this.formGroup.markAsPristine();
    this.formGroup.markAsUntouched();
  }

  onToggleExpansion() {
    this.isExpanded.update((value) => !value);
  }
}
