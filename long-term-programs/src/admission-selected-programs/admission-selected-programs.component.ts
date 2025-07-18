import { UnauthorisedProgramPageComponent } from '@vet/unauthorised-programs';
import { AdmissionPrograms, LongTerm } from '@vet/backend';
import { ChangeDetectionStrategy, Component, input, output, signal } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { InputsModule, RadioButtonModule } from '@progress/kendo-angular-inputs';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import { LabelModule } from '@progress/kendo-angular-label';
import { SVGIconModule } from '@progress/kendo-angular-icons';
import * as kendoIcons from '@progress/kendo-svg-icons';
import { TranslocoPipe } from '@jsverse/transloco';
import { useConfirm, vetIcons } from '@vet/shared';
import { KENDO_GRID } from '@progress/kendo-angular-grid';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { KENDO_DIALOG } from '@progress/kendo-angular-dialog';
import { KENDO_TOOLTIP } from '@progress/kendo-angular-tooltip';

export type ProgramSelectedProgramsStepFormGroup = FormGroup;

@Component({
  selector: 'vet-admission-selected-programs',
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
    UnauthorisedProgramPageComponent,
    KENDO_TOOLTIP,
  ],
  templateUrl: './admission-selected-programs.component.html',
  styleUrl: './admission-selected-programs.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdmissionSelectedProgramsComponent {
  readonly isEditMode = input(false, { transform: coerceBooleanProperty });
  readonly selectedPrograms = input<AdmissionPrograms[] | undefined>();
  readonly selectedProgramsLoading = input<boolean>(false);
  readonly readonly = input<boolean>(false);
  readonly selectedProgramsError = input<Error | null>(null);
  readonly deleteClick = output<LongTerm>();

  protected readonly isProgramDialogOpen = signal(false);
  protected readonly singleProgramId = signal(0);
  protected readonly kendoIcons = kendoIcons;
  protected readonly vetIcons = vetIcons;
  protected readonly confirm = useConfirm();

  protected onPreviewProgramClick(item: AdmissionPrograms): void {
    const program = item?.program;
    if (program) {
      this.singleProgramId.set(Number(program.id));
      this.isProgramDialogOpen.set(true);
    }
  }

  protected onCloseClick(): void {
    this.isProgramDialogOpen.set(false);
  }

  protected onDeleteClick(item: AdmissionPrograms): void {
    const program = item?.program;
    if (program) {
      this.confirm.warning({
        title: 'programs.removeProgramSelection',
        content: 'programs.confirm_program_selection_delete',
        confirmButtonText: 'programs.remove',
        dismissButtonText: 'shared.cancel',
        onConfirm: () => this.deleteClick.emit(program),
      });
    }
  }
}
