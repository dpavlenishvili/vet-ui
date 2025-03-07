import { AdmissionPrograms, AdmissionService } from '@vet/backend';
import { ChangeDetectionStrategy, Component, OnInit, inject, input, output, signal } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { InputsModule, RadioButtonModule } from '@progress/kendo-angular-inputs';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import { LabelModule } from '@progress/kendo-angular-label';
import { SVGIconModule } from '@progress/kendo-angular-icons';
import * as kendoIcons from '@progress/kendo-svg-icons';
import { TranslocoPipe } from '@jsverse/transloco';
import { ConfirmationDialogService, vetIcons } from '@vet/shared';
import { KENDO_GRID } from '@progress/kendo-angular-grid';
import { map, Observable, of } from 'rxjs';
import { LongTerm } from '@vet/backend';
import { rxResource } from '@angular/core/rxjs-interop';

export type ProgramSelectedProgramsStepFormGroup = FormGroup;

@Component({
  selector: 'vet-program-selected-programs',
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
  templateUrl: './program-selected-programs.component.html',
  styleUrl: './program-selected-programs.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class ProgramSelectedProgramsComponent {
  admissionId = input<string | null>();
  form = input<ProgramSelectedProgramsStepFormGroup>();
  mode = input<'edit' | 'view'>('edit');
  deleteClick = output<LongTerm>();

  kendoIcons = kendoIcons;
  vetIcons = vetIcons;

  confirmationDialogService = inject(ConfirmationDialogService);
  admissionService = inject(AdmissionService);

  protected readonly selectedPrograms = rxResource({
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

  onDeleteClick(item: LongTerm) {
    this.confirmationDialogService.show({
      content: 'programs.confirm_program_selection_delete',
      onConfirm: () => this.deleteClick.emit(item),
    });
  }
}
