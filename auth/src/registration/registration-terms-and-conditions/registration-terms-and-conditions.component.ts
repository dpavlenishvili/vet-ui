import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonComponent } from '@progress/kendo-angular-buttons';
import { LabelComponent } from '@progress/kendo-angular-label';
import { ErrorComponent, KENDO_CHECKBOX } from '@progress/kendo-angular-inputs';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'vet-registration-terms-and-conditions',
  imports: [
    ButtonComponent,
    FormsModule,
    LabelComponent,
    ReactiveFormsModule,
    TranslocoPipe,
    KENDO_CHECKBOX,
    ErrorComponent,
  ],
  templateUrl: './registration-terms-and-conditions.component.html',
  styleUrl: './registration-terms-and-conditions.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class RegistrationTermsAndConditionsComponent {
  form = input<
    FormGroup<{
      accepted: FormControl<boolean | null>;
    }>
  >();
  previousClick = output();
  nextClick = output();

  personalDataItems = [
    'auth.personal_data_name',
    'auth.personal_data_id',
    'auth.personal_data_birth_date',
    'auth.personal_data_gender',
    'auth.personal_data_citizenship',
    'auth.personal_data_address',
    'auth.personal_data_photo',
    'auth.personal_data_contact',
    'auth.personal_data_education',
  ];

  processingPurposesItems = [
    'auth.processing_purpose_identification',
    'auth.processing_purpose_citizenship',
    'auth.processing_purpose_status',
    'auth.processing_purpose_admission',
  ];

  specialDataItems = [
    'auth.special_data_health',
    'auth.special_data_social',
    'auth.special_data_educational_needs',
    'auth.special_data_veteran',
    'auth.special_data_refugee',
  ];

  specialDataPurposesItems = [
    'auth.special_purpose_disability',
    'auth.special_purpose_migration',
    'auth.special_purpose_legal',
  ];

  dataSourcesItems = [
    'auth.data_source_registration',
    'auth.data_source_state_services',
    'auth.data_source_social_services',
    'auth.data_source_education_systems',
  ];

  onPreviousClick() {
    this.previousClick.emit();
  }

  onNextClick() {
    const form = this.form();

    if (!form) {
      return;
    }

    form.markAllAsTouched();

    if (form?.valid) {
      this.nextClick.emit();
    }
  }
}
