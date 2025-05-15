import { ChangeDetectionStrategy, Component, effect, inject, input, OnInit, output, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TranslocoPipe } from '@jsverse/transloco';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import { KENDO_DATEINPUTS } from '@progress/kendo-angular-dateinputs';
import { KENDO_DROPDOWNS } from '@progress/kendo-angular-dropdowns';
import { InputsModule, RadioButtonModule } from '@progress/kendo-angular-inputs';
import { LabelModule } from '@progress/kendo-angular-label';
import {
  Citizenship,
  countries,
  genders,
  useAlertApiErrorHandler,
  useApiErrorConditionalContextFactory,
  useToastApiErrorHandler
} from '@vet/shared';
import { finalize, tap } from 'rxjs';
import { RegisterService, User } from '@vet/backend';
import { Router } from '@angular/router';

@Component({
  selector: 'vet-registration-identity-foreigner',
  imports: [
    ReactiveFormsModule,
    InputsModule,
    RadioButtonModule,
    ButtonModule,
    LabelModule,
    TranslocoPipe,
    KENDO_DATEINPUTS,
    KENDO_DROPDOWNS,
  ],
  templateUrl: './registration-identity-foreigner.component.html',
  styleUrl: './registration-identity-foreigner.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class RegistrationIdentityForeignerComponent implements OnInit {
  createApiErrorHandlerContext = useApiErrorConditionalContextFactory({
    when: ({ code }) => code === 1009,
    then: useAlertApiErrorHandler(),
    else: useToastApiErrorHandler(),
  });
  isPersonVerified = signal(false);
  generalForm = input<FormGroup>();
  identityForm = input<
    FormGroup<{
      residential: FormControl<string | null>;
      lastname: FormControl<string | null>;
      personalNumber: FormControl<string | null>;
      firstname: FormControl<string | null>;
      dateOfBirth: FormControl<Date | null>;
      gender: FormControl<string | null>;
    }>
  >();
  countries = countries;
  genders = genders;
  previousClick = output();
  nextClick = output();
  registerService = inject(RegisterService);
  router = inject(Router);

  ngOnInit(): void {
    console.log(this.generalForm()?.controls?.['phone']);
    this.isPersonVerified.set(!!this.generalForm()?.controls?.['phone']?.value.phoneNumber);
    this.identityForm()?.valueChanges.pipe().subscribe(value => {
      if (this.generalForm()?.controls?.['phone']?.value.phoneNumber) {
       console.log(value);
        this.isPersonVerified.set(false);
        this.generalForm()?.controls?.['phone'].reset();
      }
    })
  }

  onPreviousClick() {
    this.previousClick.emit();
  }

  onCheckClick() {
    this.identityForm()?.markAllAsTouched();

    const form = this.identityForm()?.value;

    if (this.identityForm()?.invalid) {
      this.identityForm()?.markAllAsTouched();
      return;
    }

    this.registerService
      .validatePerson(
        { pid: form?.personalNumber as string, last_name: form?.lastname as string },
        {
          context: this.createApiErrorHandlerContext(),
        },
      )
      .pipe(
        tap({
          next: (personalInfo: User) => {
            this.isPersonVerified.set(true);
            this.identityForm()?.controls.firstname.setValue(personalInfo.firstName ?? null);
            this.identityForm()?.controls.dateOfBirth.setValue(
              personalInfo.birthDate ? new Date(personalInfo.birthDate) : null,
            );
            this.identityForm()?.controls.firstname.setValue(personalInfo.firstName ?? null);
            this.identityForm()?.controls.gender.setValue(personalInfo.gender ?? null);
            this.identityForm()?.controls.residential.setValue('GEO');
            this.generalForm()?.get('chooseCitizenship')?.patchValue({
              citizenship: Citizenship.Georgian,
            });
          },
          error: () => {
            if (this.identityForm()?.valid) {
              this.onNextClick();
            }
          },
        }),
      )
      .subscribe();
  }

  onNextClick() {
    if (this.identityForm()?.valid) {
      this.nextClick.emit();
    }
  }
}
