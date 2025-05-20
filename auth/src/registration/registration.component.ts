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
  useAlert,
  vetIcons,
} from '@vet/shared';
import { RegisterService, type User, type UserReq } from '@vet/backend';
import { Router } from '@angular/router';
import { BehaviorSubject, tap } from 'rxjs';
import { ButtonComponent } from '@progress/kendo-angular-buttons';
import { TooltipDirective } from '@progress/kendo-angular-tooltip';
import { useAuthEnvironment } from '@vet/auth';

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
  lastCitizenshipValue = '';
  phoneVerified = signal(false);
  personVerified = signal(false);

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

    if (this.citizenship) {
      this.lastCitizenshipValue = this.citizenship;
    }
  }

  createFormGroup() {
    return new FormGroup({
      chooseCitizenship: new FormGroup({
        citizenship: new FormControl<string | null>(null, Validators.required),
      }),
      checkIdentity: new FormGroup({
        lastName: new FormControl('', [Validators.required, georgianLettersValidator]),
        firstName: new FormControl(''),
        personalNumber: new FormControl('', [Validators.required, personalNumberValidator]),
        dateOfBirth: new FormControl<Date | null>(null),
        gender: new FormControl(''),
      }),
      checkIdentityForeigner: new FormGroup({
        residential: new FormControl('', Validators.required),
        lastName: new FormControl('', [Validators.required, georgianLettersValidator]),
        firstName: new FormControl('', [Validators.required, georgianLettersValidator]),
        personalNumber: new FormControl('', Validators.required),
        dateOfBirth: new FormControl<Date | null>(null, Validators.required),
        gender: new FormControl('', Validators.required),
      }),
      phone: new FormGroup({
        phoneNumber: new FormControl('', [Validators.required, mobileNumberValidator]),
        verificationNumber: new FormControl('', [
          Validators.required,
          Validators.minLength(useAuthEnvironment().phoneVerificationNumberLength),
        ]),
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
      first_name: identityGroup.get('firstName')?.value,
      last_name: identityGroup.get('lastName')?.value,
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

  handleSwitchToGeorgianCitizenship(personalInfo: User) {
    this.formGroup.controls.chooseCitizenship.controls.citizenship.setValue(Citizenship.Georgian);
    this.lastCitizenshipValue = Citizenship.Georgian;

    const georgianForm = this.formGroup.controls.checkIdentity;
    georgianForm.controls.personalNumber.setValue(personalInfo.pid || null);
    georgianForm.controls.lastName.setValue(personalInfo.lastName || null);
    georgianForm.controls.firstName.setValue(personalInfo.firstName || null);
    georgianForm.controls.dateOfBirth.setValue(personalInfo.birthDate ? new Date(personalInfo.birthDate) : null);
    georgianForm.controls.gender.setValue(personalInfo.gender || null);

    this.formGroup.controls.checkIdentityForeigner.reset();
    this.personVerified.set(true);
    this.currentStepIndex++;
    this.currentStepSubject.next(this.currentStepIndex);
    void this.router.navigate([`/registration/${this.steps[this.currentStepIndex].path}`]);
  }

  onNextClick() {
    if (this.currentStepIndex === 0 && this.isStepValid(this.currentStepIndex)) {
      this.lastCitizenshipValue = this.citizenship as string;
      this.currentStepIndex++;
      this.currentStepSubject.next(this.currentStepIndex);
      void this.router.navigate([`/registration/${this.steps[this.currentStepIndex].path}`]);
      return;
    }

    if (this.currentStepIndex === 1 && this.isStepValid(this.currentStepIndex)) {
      if (this.personVerified()) {
        this.currentStepIndex++;
        this.currentStepSubject.next(this.currentStepIndex);
        void this.router.navigate([`/registration/${this.steps[this.currentStepIndex].path}`]);
      }
      return;
    }

    if (this.currentStepIndex === 2 && this.isStepValid(this.currentStepIndex)) {
      if (this.phoneVerified()) {
        this.currentStepIndex++;
        this.currentStepSubject.next(this.currentStepIndex);
        void this.router.navigate([`/registration/${this.steps[this.currentStepIndex].path}`]);
      }
      return;
    }

    if (this.currentStepIndex === 3 && this.isStepValid(this.currentStepIndex)) {
      this.currentStepIndex++;
      this.currentStepSubject.next(this.currentStepIndex);
      void this.router.navigate([`/registration/${this.steps[this.currentStepIndex].path}`]);
      return;
    }

    if (this.currentStepIndex === this.steps.length - 1 && this.isStepValid(this.currentStepIndex)) {
      const user = this.getUserReq();
      this.registrationService
        .register(user)
        .pipe(
          tap({
            next: () => {
              void this.router.navigate(['/authorization'], {
                queryParams: {
                  referrer: 'registration',
                },
              });
            },
            error: (error) => {
              if (error.error.errors) {
                for (const item of error.error.errors) {
                  this.alert.error(item);
                }
              }
            },
          }),
        )
        .subscribe();
    }
  }

  onResetForm(citizenship: string) {
    this.formGroup.reset();
    this.formGroup.controls.chooseCitizenship.controls.citizenship.setValue(citizenship);
    this.formGroup.markAsPristine();
    this.formGroup.markAsUntouched();
    this.lastCitizenshipValue = citizenship;
    this.resetStepsFrom(1);
    this.phoneVerified.set(false);
    this.personVerified.set(false);
  }

  resetStepsFrom(index: number) {
    if (index <= 1) {
      this.formGroup.controls.checkIdentity.reset();
      this.formGroup.controls.checkIdentityForeigner.reset();
    }

    if (index <= 2) {
      this.formGroup.controls.phone.reset();
    }

    if (index <= 3) {
      this.formGroup.controls.passwords.reset();
    }

    if (index <= 4) {
      this.formGroup.controls.termsAndConditions.reset();
    }
  }

  onToggleExpansion() {
    this.isExpanded.update((value) => !value);
  }

  setPhoneVerified(verified: boolean) {
    this.phoneVerified.set(verified);
  }

  setPersonVerified(verified: boolean) {
    this.personVerified.set(verified);
  }
}
