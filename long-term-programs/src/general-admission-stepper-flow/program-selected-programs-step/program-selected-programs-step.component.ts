import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
  signal,
  effect
} from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { InputsModule, RadioButtonModule } from '@progress/kendo-angular-inputs';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import { LabelModule } from '@progress/kendo-angular-label';
import { SVGIconModule } from '@progress/kendo-angular-icons';
import * as kendoIcons from '@progress/kendo-svg-icons';
import { TranslocoPipe } from '@jsverse/transloco';
import { vetIcons } from '@vet/shared';
import { LongTerm } from '@vet/backend';
import { ProgramSelectedProgramsComponent } from '../program-selected-programs/program-selected-programs.component';

export type ProgramSelectedProgramsStepFormGroup = FormGroup;

@Component({
  selector: 'vet-program-selected-programs-step',
  imports: [
    ReactiveFormsModule,
    InputsModule,
    RadioButtonModule,
    ButtonModule,
    LabelModule,
    SVGIconModule,
    ProgramSelectedProgramsComponent,
    TranslocoPipe
  ],
  templateUrl: './program-selected-programs-step.component.html',
  styleUrl: './program-selected-programs-step.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class ProgramSelectedProgramsStepComponent {
  nextClick = output();
  previousClick = output();
  readonly admissionId = input<string | null>();

  form = input<ProgramSelectedProgramsStepFormGroup>();
  kendoIcons = kendoIcons;
  vetIcons = vetIcons;

  selectedProgramIds = signal<number[]>([]);

  constructor() {
    effect(() => {
      this.getSelectedProgramIds();
    });
  }

  getSelectedProgramIds() {
    const value = this.form()?.value;
    const selectedProgramIds = [];

    for (const item of value.program_ids) {
      if (item.program?.program_id) {
        selectedProgramIds.push(item.program.program_id);
      }
    }

    this.selectedProgramIds.set(selectedProgramIds);
  }

  onPreviousClick() {
    this.previousClick.emit();
  }

  onNextClick() {
    this.form()?.markAllAsTouched();
    if (this.form()?.valid) {
      this.nextClick.emit();
    }
  }

  onDeleteClick(item: LongTerm) {
    const filteredIds = this.selectedProgramIds().filter((id) => id !== item.program_id);
    this.form()?.get('program_ids')?.patchValue(filteredIds);
    this.form()?.get('program_ids')?.updateValueAndValidity();
  }
}
