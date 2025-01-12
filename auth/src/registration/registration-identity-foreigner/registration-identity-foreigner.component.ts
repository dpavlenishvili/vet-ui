import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TranslocoModule } from '@jsverse/transloco';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import { KENDO_DATEINPUTS } from '@progress/kendo-angular-dateinputs';
import { KENDO_DROPDOWNS } from '@progress/kendo-angular-dropdowns';
import { InputsModule, RadioButtonModule } from '@progress/kendo-angular-inputs';
import { LabelModule } from '@progress/kendo-angular-label';
import { countries, genders } from '@vet/shared';

@Component({
  selector: 'vet-registration-identity-foreigner',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputsModule,
    RadioButtonModule,
    ButtonModule,
    LabelModule,
    TranslocoModule,
    KENDO_DATEINPUTS,
    KENDO_DROPDOWNS,
  ],
  templateUrl: './registration-identity-foreigner.component.html',
  styleUrl: './registration-identity-foreigner.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegistrationIdentityForeignerComponent {
  form = input<
    FormGroup<{
      citizenship: FormControl<string | null>;
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

  onPreviousClick() {
    this.previousClick.emit();
  }

  onNextClick() {
    if (this.form()?.valid) {
      this.nextClick.emit();
    }
  }
}
