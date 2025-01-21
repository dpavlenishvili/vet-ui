import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { InputsModule, RadioButtonModule } from '@progress/kendo-angular-inputs';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import { LabelModule } from '@progress/kendo-angular-label';
import { TranslocoModule } from '@jsverse/transloco';

enum Citizenship {
  Georgian = 'GEO',
  Foreigner = 'Foreigner',
}

@Component({
  selector: 'vet-registration-citizenship',
  imports: [ReactiveFormsModule, InputsModule, RadioButtonModule, ButtonModule, LabelModule, TranslocoModule],
  templateUrl: './registration-citizenship.component.html',
  styleUrl: './registration-citizenship.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true
})
export class RegistrationCitizenshipComponent {
  form = input<
    FormGroup<{
      citizenship: FormControl<string | null>;
    }>
  >();

  citizenship = Citizenship

  nextClick = output();

  onNextClick() {
    this.form()?.markAllAsTouched();
    if (this.form()?.valid) {
      this.nextClick.emit();
    }
  }
}
