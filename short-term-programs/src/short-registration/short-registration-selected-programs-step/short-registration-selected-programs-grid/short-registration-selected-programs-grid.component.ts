import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { useConfirm } from '@vet/shared/dialogs';
import { vetIcons } from '@vet/shared/icons';
import { FormatDatePipe } from '@vet/shared/pipes';
import { IconButtonComponent, InfoComponent } from '@vet/shared/ui-components';
import { ShortProgram, ShortProgramAdmission } from '@vet/backend';
import {
  CellTemplateDirective,
  ColumnComponent,
  GridComponent,
  NoRecordsTemplateDirective,
} from '@progress/kendo-angular-grid';
import { TranslocoPipe } from '@jsverse/transloco';
import { useProgramDialog } from '../../../short-term-programs.signals';
import { KENDO_TOOLTIP } from '@progress/kendo-angular-tooltip';

@Component({
  selector: 'vet-short-registration-selected-programs-grid',
  imports: [
    CellTemplateDirective,
    ColumnComponent,
    GridComponent,
    NoRecordsTemplateDirective,
    TranslocoPipe,
    FormatDatePipe,
    InfoComponent,
    IconButtonComponent,
    KENDO_TOOLTIP
  ],
  templateUrl: './short-registration-selected-programs-grid.component.html',
  styleUrl: './short-registration-selected-programs-grid.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class ShortRegistrationSelectedProgramsGridComponent {
  isEditMode = input(true);
  selectedPrograms = input.required<ShortProgramAdmission[]>();
  itemUnselect = output<ShortProgramAdmission>();

  programDialog = useProgramDialog();
  unselectionConfirmation = useConfirm();
  vetIcons = vetIcons;

  onPreviewProgram(program: ShortProgramAdmission) {
    const programId = Number(program.program?.id);
    this.programDialog.show({ programId });
  }

  onUnselectProgram(program: ShortProgram) {
    if (this.selectedPrograms().length > 0) {
      this.unselectionConfirmation.show({
        content: 'shorts.confirm_program_unselection',
        onConfirm: () => this.itemUnselect.emit(program),
      });
    }
  }
}
