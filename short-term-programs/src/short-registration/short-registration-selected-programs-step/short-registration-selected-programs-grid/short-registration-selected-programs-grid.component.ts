import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { FormatDatePipe, InfoComponent, useConfirm, vetIcons } from '@vet/shared';
import { ShortProgram, ShortProgramAdmission } from '@vet/backend';
import { ButtonComponent } from '@progress/kendo-angular-buttons';
import {
  CellTemplateDirective,
  ColumnComponent,
  GridComponent,
  NoRecordsTemplateDirective,
} from '@progress/kendo-angular-grid';
import { SVGIconComponent } from '@progress/kendo-angular-icons';
import { TranslocoPipe } from '@jsverse/transloco';
import { useProgramDialog } from '../../../short-term-programs.signals';

@Component({
  selector: 'vet-short-registration-selected-programs-grid',
  imports: [
    ButtonComponent,
    CellTemplateDirective,
    ColumnComponent,
    GridComponent,
    NoRecordsTemplateDirective,
    SVGIconComponent,
    TranslocoPipe,
    FormatDatePipe,
    InfoComponent,
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
