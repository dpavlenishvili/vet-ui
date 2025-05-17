import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonComponent } from '@progress/kendo-angular-buttons';
import { LabelComponent } from '@progress/kendo-angular-label';
import { KENDO_CHECKBOX } from '@progress/kendo-angular-inputs';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'vet-registration-terms-and-conditions',
  imports: [ButtonComponent, FormsModule, LabelComponent, ReactiveFormsModule, TranslocoPipe, KENDO_CHECKBOX],
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

  onPreviousClick() {
    this.previousClick.emit();
  }

  onNextClick() {
    const form = this.form();

    if (!form) {
      return;
    }

    if (this.form()?.valid) {
      this.nextClick.emit();
    }
  }
}
