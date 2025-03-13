import { AdmissionPrograms, LongTerm } from '@vet/backend';
import { ChangeDetectionStrategy, Component, inject, input, output, signal } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { InputsModule, RadioButtonModule } from '@progress/kendo-angular-inputs';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import { LabelModule } from '@progress/kendo-angular-label';
import { SVGIconModule } from '@progress/kendo-angular-icons';
import * as kendoIcons from '@progress/kendo-svg-icons';
import { TranslocoPipe } from '@jsverse/transloco';
import { ConfirmationDialogService, vetIcons } from '@vet/shared';
import { KENDO_GRID } from '@progress/kendo-angular-grid';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { KENDO_DIALOG } from '@progress/kendo-angular-dialog';
import { ProgramComponent } from 'programs/src/program/program.component';

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
    KENDO_DIALOG,
    ProgramComponent
  ],
  templateUrl: './program-selected-programs.component.html',
  styleUrl: './program-selected-programs.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class ProgramSelectedProgramsComponent {
  isEditMode = input(false, { transform: coerceBooleanProperty });
  selectedPrograms = input<AdmissionPrograms[]>();
  selectedProgramsLoading = input<boolean>();
  selectedProgramsError = input<Error>();
  deleteClick = output<LongTerm>();

  isProgramDialogOpen = signal(false);
  singleProgramId = signal(0);

  kendoIcons = kendoIcons;
  vetIcons = vetIcons;

  confirmationDialogService = inject(ConfirmationDialogService);
  onPreviewProgramClick(item: LongTerm) {
    this.singleProgramId.set(Number(item.id));
    this.isProgramDialogOpen.set(true);
  }

  onCloseClick() {
    this.isProgramDialogOpen.set(false);
  }

  onDeleteClick(item: LongTerm) {
    this.confirmationDialogService.show({
      content: 'programs.confirm_program_selection_delete',
      onConfirm: () => this.deleteClick.emit(item),
    });
  }
}
