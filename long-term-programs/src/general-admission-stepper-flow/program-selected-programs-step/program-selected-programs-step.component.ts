import { ChangeDetectionStrategy, Component, DestroyRef, effect, inject, input, output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { InputsModule, RadioButtonModule } from '@progress/kendo-angular-inputs';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import { LabelModule } from '@progress/kendo-angular-label';
import { SVGIconModule } from '@progress/kendo-angular-icons';
import * as kendoIcons from '@progress/kendo-svg-icons';
import { TranslocoPipe } from '@jsverse/transloco';
import { ToastService, vetIcons } from '@vet/shared';
import { AdmissionService, LongTerm } from '@vet/backend';
import { ProgramSelectedProgramsComponent } from '../program-selected-programs/program-selected-programs.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { tap } from 'rxjs';
import { admissionProgramsResource } from '../admission-programs-resource';
import { Router } from '@angular/router';

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
  changeDetection: ChangeDetectionStrategy.OnPush
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

  private readonly admissionService = inject(AdmissionService);
  private readonly toastService = inject(ToastService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

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
    } else {
      this.toastService.info('programs.pleaseSelectProgram');
    }
  }

  onDeleteClick(item: LongTerm) {
    if (!item.program_id) {
      return;
    }
    const currentSelected = this.selectedPrograms.value();
    const updatedSelection = currentSelected
      ?.filter((p) => p.program?.program_id !== item.program_id)
      .map((p) => p.program?.program_id);
    this.form()?.get('program_ids')?.patchValue(updatedSelection);
    this.form()?.get('program_ids')?.updateValueAndValidity();
    this.selectionProgramsForm()?.get('program_ids')?.patchValue(updatedSelection);
    this.selectionProgramsForm()?.updateValueAndValidity();

    this.admissionService
      .editAdmission(this.admissionId() as string, this.form()?.getRawValue())
      .pipe(
        tap({
          next: () => {
            this.toastService.success('programs.programRemoved');
            this.selectedPrograms.reload();
            if (this.selectedPrograms.value()?.length === 0) {
              this.router.navigate(['long-term-programs', 'update-admission', this.admissionId(), 'program_selection']);
            }
          },
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();
  }
}
