import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslocoPipe } from '@jsverse/transloco';
import { VetCheckboxComponent } from '@vet/shared';

@Component({
  selector: 'vet-registration-terms-and-conditions',
  imports: [FormsModule, ReactiveFormsModule, TranslocoPipe, VetCheckboxComponent],
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

  personalDataItems = [
    'auth.personal_data_name',
    'auth.personal_data_surname',
    'auth.personal_data_id',
    'auth.personal_data_birth_date',
    'auth.personal_data_gender',
    'auth.personal_data_citizenship',
    'auth.personal_data_address',
    'auth.personal_data_phone',
    'auth.personal_data_email',
  ];

  processingPurposesItems = [
    'auth.processing_purpose_registration',
    'auth.processing_purpose_citizenship_check',
    'auth.processing_purpose_legal_obligations',
  ];

  dataSourcesItems = ['auth.data_source_portal_registration', 'auth.data_source_state_verification'];
}
