import { ChangeDetectionStrategy, Component, DestroyRef, effect, inject, input, output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { InputsModule, RadioButtonModule } from '@progress/kendo-angular-inputs';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import { LabelModule } from '@progress/kendo-angular-label';
import { SVGIconModule } from '@progress/kendo-angular-icons';
import * as kendoIcons from '@progress/kendo-svg-icons';
import { TranslocoPipe } from '@jsverse/transloco';
import { vetIcons } from '@vet/shared';
import { AdmissionService, LongTerm } from '@vet/backend';
import { ProgramSelectedProgramsComponent } from '../program-selected-programs/program-selected-programs.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { tap } from 'rxjs';
import { admissionProgramsResource } from '../admission-programs-resource';

export type ProgramSelectedProgramsStepFormGroup = FormGroup;
export type ProgramsSelectionStepFormGroup = FormGroup;

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
    TranslocoPipe,
  ],
  templateUrl: './program-selected-programs-step.component.html',
  styleUrl: './program-selected-programs-step.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class ProgramSelectedProgramsStepComponent {
  nextClick = output();
  previousClick = output();
  readonly admissionId = input.required<string | null>();
  protected readonly selectedPrograms = admissionProgramsResource(this.admissionId);
  form = input<ProgramSelectedProgramsStepFormGroup>();
  selectionProgramsForm = input<ProgramsSelectionStepFormGroup>();
  kendoIcons = kendoIcons;
  vetIcons = vetIcons;

  admissionService = inject(AdmissionService);
  private destroyRef = inject(DestroyRef);

  constructor() {
    effect(() => {
      this.selectedPrograms.reload();
    });
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
    const deletedProgramIds = this.form()
      ?.get('program_ids')
      ?.value.filter((id: number) => id !== item.program_id);
    this.form()?.get('program_ids')?.patchValue(deletedProgramIds);
    this.form()?.updateValueAndValidity();
    this.selectionProgramsForm()?.get('program_ids')?.patchValue(deletedProgramIds);
    this.selectionProgramsForm()?.updateValueAndValidity();

    this.admissionService
      .editAdmission(this.admissionId() as string, this.form()?.value)
      .pipe(
        tap(() => {
          this.selectedPrograms.reload();
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();
  }
}
