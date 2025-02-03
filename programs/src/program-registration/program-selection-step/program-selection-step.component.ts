import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { InputsModule, RadioButtonModule } from '@progress/kendo-angular-inputs';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import { LabelModule } from '@progress/kendo-angular-label';
import { SVGIconModule } from '@progress/kendo-angular-icons';
import * as kendoIcons from '@progress/kendo-svg-icons';
import { TranslocoPipe } from '@jsverse/transloco';

export type ProgramSelectionStepFormGroup = FormGroup;

@Component({
  selector: 'vet-program-selection-step',
  imports: [
    ReactiveFormsModule,
    InputsModule,
    RadioButtonModule,
    ButtonModule,
    LabelModule,
    SVGIconModule,
    TranslocoPipe
  ],
  templateUrl: './program-selection-step.component.html',
  styleUrl: './program-selection-step.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class ProgramSelectionStepComponent {
  nextClick = output();
  previousClick = output();

  form = input<ProgramSelectionStepFormGroup>();
  kendoIcons = kendoIcons;

  onPreviousClick() {
    this.previousClick.emit();
  }

  onNextClick() {
    this.form()?.markAllAsTouched();
    if (this.form()?.valid) {
      this.nextClick.emit();
    }
  }
}
