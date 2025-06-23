import { ChangeDetectionStrategy, Component, input, output, signal } from '@angular/core';
import { DialogComponent, FormatDatePipe, InfoComponent, useConfirm, vetIcons } from '@vet/shared';
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
import { ShortProgramPageComponent } from '../../../short-program-page/short-program-page.component';

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
    ShortProgramPageComponent,
    FormatDatePipe,
    DialogComponent,
    InfoComponent,
  ],
  templateUrl: './short-registration-selected-programs-grid.component.html',
  styleUrl: './short-registration-selected-programs-grid.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class ShortRegistrationSelectedProgramsGridComponent {
  selectedPrograms = input.required<ShortProgramAdmission[]>();
  itemUnselect = output<ShortProgramAdmission>();

  previewProgramId = signal(0);
  isProgramPreviewDialogOpen = signal(false);
  unselectionConfirmation = useConfirm();
  vetIcons = vetIcons;

  onPreviewProgram(program: ShortProgramAdmission) {
    this.previewProgramId.set(Number(program.program?.id));
    this.isProgramPreviewDialogOpen.set(true);
  }

  onUnselectProgram(program: ShortProgram) {
    if (this.selectedPrograms().length > 0) {
      this.unselectionConfirmation.show({
        content: 'shorts.confirm_program_unselection',
        onConfirm: () => this.itemUnselect.emit(program),
      });
    }
  }

  onClosePreviewDialog() {
    this.isProgramPreviewDialogOpen.set(false);
  }
}
