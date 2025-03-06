import { AdmissionService } from '@vet/backend';
import {ChangeDetectionStrategy, Component, OnInit, inject, input, output, signal, linkedSignal} from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { InputsModule, RadioButtonModule } from '@progress/kendo-angular-inputs';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import { LabelModule } from '@progress/kendo-angular-label';
import { SVGIconModule } from '@progress/kendo-angular-icons';
import * as kendoIcons from '@progress/kendo-svg-icons';
import { TranslocoPipe } from '@jsverse/transloco';
import { ConfirmationDialogService, vetIcons } from '@vet/shared';
import { KENDO_GRID } from '@progress/kendo-angular-grid';
import {Observable, map, of, startWith} from 'rxjs';
import { AdmissionPrograms, LongTerm } from '@vet/backend';
import { rxResource } from '@angular/core/rxjs-interop';

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
    TranslocoPipe,
    KENDO_GRID,
  ],
  templateUrl: './program-selected-programs-step.component.html',
  styleUrl: './program-selected-programs-step.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProgramSelectedProgramsStepComponent {
  nextClick = output();
  previousClick = output();
  readonly admissionId = input<string | null>();

  form = input<ProgramSelectedProgramsStepFormGroup>();
  kendoIcons = kendoIcons;
  vetIcons = vetIcons;
  selectedPrograms$: Observable<AdmissionPrograms[]> | undefined;

  selectedProgramIds = signal<number[]>([]);

  confirmationDialogService = inject(ConfirmationDialogService);
  admissionService = inject(AdmissionService);

  protected readonly selectedProgram = rxResource({
    request: () => ({ admissionId: this.admissionId() }),
    loader: ({ request: { admissionId } }): Observable<AdmissionPrograms[]> => {
      if (!admissionId) {
        return of([]);
      }
      return this.admissionService
        .admissionList({
          role: 'Default User',
          number: admissionId,
        })
        .pipe(map((res) => res.data?.[0]?.programs ?? []));
    },
  });

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
    this.confirmationDialogService.show({
      content: 'programs.confirm_program_selection_delete',
      onConfirm: () => {
        this.selectedProgramIds().filter((id) => id !== item.program_id);
        this.form()?.get('program_ids')?.patchValue(this.selectedProgramIds());
        this.form()?.get('program_ids')?.updateValueAndValidity();
      },
    });
  }
}
