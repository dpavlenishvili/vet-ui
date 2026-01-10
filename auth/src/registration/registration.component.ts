import { ChangeDetectionStrategy, Component, computed, effect, inject, signal } from '@angular/core';
import {
  AbstractControl,
  AsyncValidatorFn,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { RegistrationCitizenshipComponent } from './registration-citizenship/registration-citizenship.component';
import { RegistrationIdentityCitizenComponent } from './registration-identity-citizen/registration-identity-citizen.component';
import { RegistrationContactComponent } from './registration-contact/registration-contact.component';
import { RegistrationIdentityForeignerComponent } from './registration-identity-foreigner/registration-identity-foreigner.component';
import { RegistrationTermsAndConditionsComponent } from './registration-terms-and-conditions/registration-terms-and-conditions.component';
import {
  Citizenship,
  StepDefinition,
  useControlValue,
} from '@vet/shared/utils';
import { useAlert, useConfirm } from '@vet/shared/dialogs';
import {
  englishLettersValidator,
  georgianLettersValidator,
  mobileNumberValidator,
  personalNumberValidator,
} from '@vet/shared/validators';
import { ResponsiveStepperComponent } from '@vet/shared';
import { EmailService, RegisterService, SmsService, type User, type UserReq } from '@vet/backend';
import { Router } from '@angular/router';
import { catchError, map, Observable, of, switchMap, tap, timer } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthenticationService, useAuthEnvironment } from '@vet/auth';
import { fromPromise } from 'rxjs/internal/observable/innerFrom';

interface ForeignerUserReq extends UserReq {
  first_name_en: string;
  last_name_en: string;
}

@Component({
  selector: 'vet-registration',
  imports: [
    ReactiveFormsModule,
    ResponsiveStepperComponent,
    RegistrationCitizenshipComponent,
    RegistrationIdentityCitizenComponent,
    RegistrationIdentityForeignerComponent,
    RegistrationContactComponent,
    RegistrationTermsAndConditionsComponent,
  ],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class RegistrationComponent {
  alert = useAlert();
  confirm = useConfirm();

  currentStepKey = signal('chooseCitizenship');
  formGroup = this.createFormGroup();
  citizenship = useControlValue(this.formGroup, (form) => form.controls.chooseCitizenship.controls.citizenship);
  personVerified = useControlValue(this.formGroup, (form) => form.controls.isPersonVerified);
  phoneVerificationNumberLength = useAuthEnvironment().phoneVerificationNumberLength;

  steps = computed(
    () =>
      [
        {
          key: 'chooseCitizenship',
          label: 'auth.citizenship_selection',
          title: 'auth.choose_citizenship',
          path: 'citizenship_selection',
        },
        {
          key: 'checkIdentity',
          label: 'auth.id_verification',
          title: 'auth.fill_in_personal_info',
          path: 'id_verification',
          condition: (formGroup: FormGroup) => {
            const citizenship = formGroup.get('chooseCitizenship.citizenship')?.value;
            return citizenship === this.CitizenshipType.Georgian;
          },
          nextActions: [
            {
              label: 'auth.check',
              action: () => this.performPersonVerification(),
              condition: (formGroup) => !formGroup.get('isPersonVerified')?.value,
            },
            {
              label: 'shared.next',
            },
          ],
        },
        {
          key: 'checkIdentityForeigner',
          label: 'auth.id_verification',
          title: 'auth.fill_in_personal_info',
          path: 'id_verification',
          condition: (formGroup: FormGroup) => {
            const citizenship = formGroup.get('chooseCitizenship.citizenship')?.value;
            return citizenship === this.CitizenshipType.Foreigner;
          },
          nextActions: [
            {
              label: 'auth.next',
              action: () => this.performPersonVerification(),
            },
          ],
        },
        {
          key: 'contact',
          label: 'auth.contact_information',
          title: 'auth.enter_contact_information',
          path: 'contact_info',
        },
        {
          key: 'termsAndConditions',
          label: 'auth.terms_and_conditions',
          title: 'auth.terms_and_conditions',
          path: 'terms_and_conditions',
        },
      ] as StepDefinition[],
  );

  CitizenshipType = Citizenship;

  private router = inject(Router);
  private registrationService = inject(RegisterService);
  private smsService = inject(SmsService);
  private emailService = inject(EmailService);
  private authenticationService = inject(AuthenticationService);

  constructor() {
    effect(() => {
      const stepKey = this.currentStepKey();
      const step = this.steps().find((s) => s.key === stepKey);

      if (step && step.path) {
        const currentUrl = this.router.url;
        const expectedPath = `/auth/registration/${step.path}`;

        if (!currentUrl.includes(step.path)) {
          void this.router.navigate([expectedPath], { replaceUrl: true });
        }
      }
    });
  }

  createFormGroup() {
    return new FormGroup({
      isPersonVerified: new FormControl(false),
      chooseCitizenship: new FormGroup({
        citizenship: new FormControl<string | null>(Citizenship.Georgian, Validators.required),
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
        firstName: new FormControl('', [Validators.required, georgianLettersValidator]),
        lastName: new FormControl('', [Validators.required, georgianLettersValidator]),
        firstNameEn: new FormControl('', [Validators.required, englishLettersValidator]),
        lastNameEn: new FormControl('', [Validators.required, englishLettersValidator]),
        personalNumber: new FormControl('', Validators.required),
        dateOfBirth: new FormControl<Date | null>(null, Validators.required),
        gender: new FormControl('', Validators.required),
      }),
      contact: new FormGroup({
        isPhoneVerified: new FormControl(false, Validators.requiredTrue),
        phoneNumber: new FormControl('', [Validators.required, mobileNumberValidator]),
        phoneVerificationNumber: new FormControl(
          '',
          [Validators.required, Validators.minLength(this.phoneVerificationNumberLength)],
          [this.phoneVerificationValidator()],
        ),
        email: new FormControl('', [Validators.required, Validators.email], [this.emailUniquenessValidator()]),
      }),
      termsAndConditions: new FormGroup({
        accepted: new FormControl(false, Validators.requiredTrue),
      }),
    });
  }

  getUserReq(): UserReq | ForeignerUserReq {
    const isForeigner =
      this.formGroup.controls.chooseCitizenship.controls.citizenship.value === this.CitizenshipType.Foreigner;
    const contact = this.formGroup.controls.contact;

    if (isForeigner) {
      const foreignerForm = this.formGroup.controls.checkIdentityForeigner;
      const foreignerReq: ForeignerUserReq = {
        pid: foreignerForm.controls.personalNumber.value ?? '',
        phone: contact.controls.phoneNumber.value ?? '',
        sms_code: contact.controls.phoneVerificationNumber.value ?? '',
        email: contact.controls.email.value ?? '',
        first_name: foreignerForm.controls.firstName.value ?? '',
        last_name: foreignerForm.controls.lastName.value ?? '',
        first_name_en: foreignerForm.controls.firstNameEn.value ?? '',
        last_name_en: foreignerForm.controls.lastNameEn.value ?? '',
        gender: foreignerForm.controls.gender.value ?? '',
        birth_date: foreignerForm.controls.dateOfBirth.value
          ? foreignerForm.controls.dateOfBirth.value.toISOString().split('T')[0]
          : '',
        residential: foreignerForm.controls.residential.value ?? '',
      };
      return foreignerReq;
    }

    const georgianForm = this.formGroup.controls.checkIdentity;
    const userReq: UserReq = {
      pid: georgianForm.controls.personalNumber.value ?? '',
      phone: contact.controls.phoneNumber.value ?? '',
      sms_code: contact.controls.phoneVerificationNumber.value ?? '',
      email: contact.controls.email.value ?? '',
      first_name: georgianForm.controls.firstName.value ?? '',
      last_name: georgianForm.controls.lastName.value ?? '',
      gender: georgianForm.controls.gender.value ?? '',
      birth_date: georgianForm.controls.dateOfBirth.value
        ? georgianForm.controls.dateOfBirth.value.toISOString().split('T')[0]
        : '',
      residential: this.formGroup.controls.chooseCitizenship.controls.citizenship.value ?? '',
    };

    return userReq;
  }

  handleSwitchToGeorgianCitizenship(personalInfo: User) {
    // Set citizenship first - this will trigger condition re-evaluation
    this.formGroup.controls.chooseCitizenship.controls.citizenship.setValue(Citizenship.Georgian);

    const georgianForm = this.formGroup.controls.checkIdentity;
    const foreignerForm = this.formGroup.controls.checkIdentityForeigner;
    const foreignerFormData = foreignerForm.value;
    const birthDate = personalInfo.birthDate || foreignerFormData.dateOfBirth;
    georgianForm.controls.personalNumber.setValue(personalInfo.pid || foreignerFormData.personalNumber || null);
    georgianForm.controls.lastName.setValue(personalInfo.lastName || foreignerFormData.lastName || null);
    georgianForm.controls.firstName.setValue(personalInfo.firstName || foreignerFormData.firstName || null);
    georgianForm.controls.dateOfBirth.setValue(birthDate ? new Date(birthDate) : null);
    georgianForm.controls.gender.setValue(personalInfo.gender || foreignerFormData.gender || null);

    this.formGroup.controls.checkIdentityForeigner.reset();
    this.setPersonVerified(true);

    // Use setTimeout to ensure step conditions are evaluated before setting step key
    // This allows the stepper's condition evaluation to complete first
    setTimeout(() => {
      this.currentStepKey.set('contact');
      void this.router.navigate(['/auth/registration/contact_info']);
    }, 0);
  }

  onSubmitForm(): void {
    const user = this.getUserReq();
    this.registrationService
      .register(user)
      .pipe(
        tap({
          next: () => {
            this.confirm.success({
              content: 'auth.registration_success_verify_email',
              showYesNoButtons: false,
              singleTypeDialogActionText: 'shared.acknowledge',
              onConfirm: () => {
                this.authenticationService.initiateLogin();
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

  onResetForm(citizenship?: string) {
    this.formGroup.reset();
    if (citizenship) {
      this.formGroup.controls.chooseCitizenship.controls.citizenship.setValue(citizenship);
    } else {
      this.currentStepKey.set('chooseCitizenship');
    }
    this.formGroup.markAsPristine();
    this.formGroup.markAsUntouched();
    this.resetStepsFrom('checkIdentity');
    this.setPersonVerified(false);
    this.formGroup.controls.contact.controls.isPhoneVerified.setValue(false);
  }

  resetStepsFrom(stepKey: string) {
    const stepIndex = this.steps().findIndex((s) => s.key === stepKey);

    if (stepIndex <= 1) {
      this.formGroup.controls.checkIdentity.reset();
      this.formGroup.controls.checkIdentityForeigner.reset();
    }

    if (stepIndex <= 2) {
      this.formGroup.controls.contact.reset();
    }

    if (stepIndex <= 3) {
      this.formGroup.controls.termsAndConditions.reset();
    }
  }

  setPersonVerified(verified: boolean) {
    this.formGroup.controls.isPersonVerified.setValue(verified);

    const identityForm = this.getCurrentIdentityForm();
    if (!verified && identityForm.valid) {
      identityForm.setErrors({ personNotVerified: true });
    } else if (verified && identityForm.hasError('personNotVerified')) {
      this.removeFormError(identityForm, 'personNotVerified');
    }
  }

  getCurrentIdentityForm() {
    return this.citizenship() === this.CitizenshipType.Georgian
      ? this.formGroup.controls.checkIdentity
      : this.formGroup.controls.checkIdentityForeigner;
  }

  removeFormError(form: FormGroup, errorKey: string) {
    const errors = { ...form.errors };
    delete errors[errorKey];

    if (Object.keys(errors).length === 0) {
      form.setErrors(null);
    } else {
      form.setErrors(errors);
    }
  }

  performPersonVerification(): Observable<boolean> {
    const isGeorgian = this.citizenship() === this.CitizenshipType.Georgian;
    const identityForm = isGeorgian
      ? this.formGroup.controls.checkIdentity
      : this.formGroup.controls.checkIdentityForeigner;

    identityForm.markAllAsTouched();

    if (identityForm.invalid) {
      return of(false);
    }

    const formValue = identityForm.value;
    const verificationPayload = isGeorgian
      ? {
          pid: formValue.personalNumber as string,
          last_name: formValue.lastName as string,
          residential: 'GEO',
        }
      : {
          pid: formValue.personalNumber as string,
          last_name: formValue.lastName as string,
          residential: (formValue as { residential?: string }).residential as string,
        };

    return this.registrationService.validatePerson(verificationPayload, {}).pipe(
      switchMap((personalInfo: User) => {
        if (!isGeorgian && personalInfo.firstName) {
          return fromPromise(
            new Promise<boolean>((resolve) => {
              this.confirm.show({
                content: 'auth.citizenship_auto_update_confirm_content',
                confirmButtonText: 'shared.agree',
                onConfirm: () => {
                  this.handleSwitchToGeorgianCitizenship(personalInfo);
                  resolve(true);
                },
                onDismiss: () => {
                  void this.router.navigate(['/']);
                  resolve(false);
                },
              });
            }),
          );
        } else {
          if (isGeorgian) {
            identityForm.controls.firstName.setValue(personalInfo.firstName ?? null, { emitEvent: false });
            identityForm.controls.dateOfBirth.setValue(
              personalInfo.birthDate ? new Date(personalInfo.birthDate) : null,
              { emitEvent: false },
            );
            identityForm.controls.gender.setValue(personalInfo.gender ?? null, { emitEvent: false });
          }

          this.setPersonVerified(true);

          return of(true);
        }
      }),
      catchError((error) => {
        this.setPersonVerified(false);

        const errorMessage = error?.error?.error?.message || 'auth.person_validation_failed';
        this.alert.show({
          variant: 'warning',
          text: errorMessage,
        });

        return of(false);
      }),
    );
  }

  phoneVerificationValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      if (this.formGroup.controls.contact.controls.isPhoneVerified.value) {
        return of(null);
      }

      const verificationCode = (control.value as string) || '';
      const requiredLength = this.phoneVerificationNumberLength;

      if (verificationCode.length !== requiredLength) {
        return of(null);
      }

      const contactForm = control.parent;
      if (!contactForm) {
        return of(null);
      }

      const phoneControl = contactForm.get('phoneNumber');
      if (!phoneControl?.valid || !phoneControl?.value) {
        return of(null);
      }

      const phoneNumber = phoneControl.value as string;

      return this.smsService.validateSms({ phone: phoneNumber, sms_code: verificationCode }).pipe(
        map(() => ({ phoneVerificationInvalid: false })),
        catchError((error: HttpErrorResponse) => {
          const errorMessage =
            error?.error?.error?.message || error?.error?.message || error?.message || 'errors.server_error_0';

          return of({ phoneVerificationInvalid: errorMessage } as ValidationErrors);
        }),
      );
    };
  }

  emailUniquenessValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      const email = (control.value as string) || '';

      if (!email || control.hasError('email') || control.hasError('required')) {
        return of(null);
      }

      return timer(500).pipe(
        switchMap(() => this.emailService.checkEmailUnic({ email })),
        map((response) => {
          if (response.status === true) {
            return null;
          } else {
            return { emailTaken: true } as ValidationErrors;
          }
        }),
        catchError((error) => {
          if (error.error?.error?.message) {
            const message = error.error.error.message;
            return of({ emailTaken: message } as ValidationErrors);
          }

          return of(null);
        }),
      );
    };
  }
}
