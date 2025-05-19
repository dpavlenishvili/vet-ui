import { ChangeDetectionStrategy, Component, inject, type OnInit, signal, ViewChild } from '@angular/core';
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
import { ActivatedRoute, Router } from '@angular/router';
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
  lastCitizenshipValue = '';
  phoneVerified = signal(false);
  personVerified = signal(false);

  @ViewChild(RegistrationIdentityCitizenComponent)
  identityCitizenComponent?: RegistrationIdentityCitizenComponent;

  @ViewChild(RegistrationIdentityForeignerComponent)
  identityForeignerComponent?: RegistrationIdentityForeignerComponent;

  @ViewChild(RegistrationPhoneComponent)
  phoneComponent?: RegistrationPhoneComponent;

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
  private activatedRoute = inject(ActivatedRoute);
  private registrationService = inject(RegisterService);

  ngOnInit(): void {
    if (!this.router.url.includes('/citizenship_selection')) {
      void this.router.navigate(['/registration/citizenship_selection']);
    }

    // Store the initial citizenship value if there is one
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
    if (event.index < this.currentStepIndex) {
      // Moving backwards is always allowed
      this.currentStepIndex = event.index;
      this.currentStepSubject.next(this.currentStepIndex);
      void this.router.navigate([`/registration/${this.steps[this.currentStepIndex].path}`]);
      return;
    }

    if (this.isStepValid(this.currentStepIndex)) {
      if (this.currentStepIndex === 1 && !this.personVerified()) {
        event.preventDefault();
        return;
      }

      if (this.currentStepIndex === 2 || this.currentStepIndex === 1  && !this.phoneVerified()) {
        event.preventDefault();
        return;
      }

      // Check if citizenship changed - handle appropriately
      if (this.currentStepIndex === 0 && this.lastCitizenshipValue && this.lastCitizenshipValue !== this.citizenship) {
        this.personVerified.set(false);
        this.phoneVerified.set(false);
        this.resetStepsFrom(1);
        this.lastCitizenshipValue = this.citizenship as string;
      }

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

      // If going back to citizenship or identity verification steps, reset validation statuses
      if (this.currentStepIndex <= 0) {
        // this.personVerified.set(false);
        // this.phoneVerified.set(false);
      } else if (this.currentStepIndex === 1) {
        // this.personVerified.set(false);
        // this.phoneVerified.set(false);
      }
    }
  }

  handleSwitchToGeorgianCitizenship(personalInfo: User) {
    // Switch the citizenship selection to Georgian
    this.formGroup.controls.chooseCitizenship.controls.citizenship.setValue(Citizenship.Georgian);
    this.lastCitizenshipValue = Citizenship.Georgian;

    // Fill in the Georgian citizenship form with the validated info
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
      // Save current citizenship selection before moving to the next step
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
      // For phone verification, check if phone is already verified
      if (!this.phoneVerified() && this.phoneComponent) {
        // If not verified and the phone number control is valid, trigger verification
        const phoneForm = this.formGroup.controls.phone;
        if (phoneForm.controls.phoneNumber.valid && !phoneForm.controls.verificationNumber.value) {
          this.phoneComponent.onNextClick();
          return;
        }
      }

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

  // Method to switch to Georgian citizenship if Georgian citizen is detected
  switchToGeorgianCitizenship(personalInfo: any) {
    this.formGroup.controls.chooseCitizenship.controls.citizenship.setValue(Citizenship.Georgian);
    this.formGroup.controls.checkIdentity.reset();

    // Fill checkIdentity form with the data from personInfo
    this.formGroup.controls.checkIdentity.controls.firstName.setValue(personalInfo.firstName ?? null);
    this.formGroup.controls.checkIdentity.controls.lastName.setValue(
      personalInfo.lastName ?? personalInfo.last_name ?? null,
    );
    this.formGroup.controls.checkIdentity.controls.personalNumber.setValue(personalInfo.pid ?? null);
    this.formGroup.controls.checkIdentity.controls.dateOfBirth.setValue(
      personalInfo.birthDate ? new Date(personalInfo.birthDate) : null,
    );
    this.formGroup.controls.checkIdentity.controls.gender.setValue(personalInfo.gender ?? null);

    this.lastCitizenshipValue = Citizenship.Georgian;

    // Reset checkIdentityForeigner form
    this.formGroup.controls.checkIdentityForeigner.reset();
  }

  // Check identity information for changes that would require re-verification
  checkIdentityChanges() {
    const currentCitizenship = this.citizenship;
    const identityForm =
      currentCitizenship === Citizenship.Georgian
        ? this.formGroup.controls.checkIdentity
        : this.formGroup.controls.checkIdentityForeigner;

    // If any key identity fields have changed, reset verification status
    if (this.personVerified()) {
      const isChanged = this.isIdentityInformationChanged(identityForm);
      if (isChanged) {
        this.personVerified.set(false);
        this.phoneVerified.set(false);
        this.resetStepsFrom(2);
      }
    }
  }

  // Helper method to check if identity information has changed
  isIdentityInformationChanged(identityForm: FormGroup): boolean {
    // Implementation depends on how you track the original verified values
    // Here, we're simply checking if the form is dirty as a basic implementation
    return identityForm.dirty;
  }

  // Helper method to check if phone information has changed
  isPhoneInformationChanged(): boolean {
    return this.formGroup.controls.phone.dirty;
  }
}
