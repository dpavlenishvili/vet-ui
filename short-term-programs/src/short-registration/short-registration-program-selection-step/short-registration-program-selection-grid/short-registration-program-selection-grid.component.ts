import { ChangeDetectionStrategy, Component, input, output, signal } from '@angular/core';
import { FormatDatePipe, useConfirm, vetIcons } from '@vet/shared';
import { ShortProgram, ShortProgramAdmission } from '@vet/backend';
import { ButtonComponent } from '@progress/kendo-angular-buttons';
import {
  CellTemplateDirective,
  ColumnComponent,
  GridComponent,
  NoRecordsTemplateDirective,
} from '@progress/kendo-angular-grid';
import { DialogComponent } from '@progress/kendo-angular-dialog';
import { SVGIconComponent } from '@progress/kendo-angular-icons';
import { TranslocoPipe } from '@jsverse/transloco';
import { ShortProgramPageComponent } from '../../../short-program-page/short-program-page.component';

@Component({
  selector: 'vet-short-registration-program-selection-grid',
  imports: [
    ButtonComponent,
    CellTemplateDirective,
    ColumnComponent,
    DialogComponent,
    GridComponent,
    NoRecordsTemplateDirective,
    SVGIconComponent,
    TranslocoPipe,
    ShortProgramPageComponent,
    FormatDatePipe,
  ],
  templateUrl: './short-registration-program-selection-grid.component.html',
  styleUrl: './short-registration-program-selection-grid.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class ShortRegistrationProgramSelectionGridComponent {
  items = input.required<ShortProgramAdmission[]>();
  isLoading = input.required<boolean>();
  selectedProgramIds = input.required<number[]>();
  itemSelect = output<ShortProgramAdmission>();
  itemUnselect = output<ShortProgramAdmission>();

  previewProgramId = signal(0);
  isProgramPreviewDialogOpen = signal(false);
  selectionConfirmation = useConfirm();
  unselectionConfirmation = useConfirm();
  vetIcons = vetIcons;

  isProgramSelected(item: ShortProgramAdmission) {
    return item.id && this.selectedProgramIds().includes(item.id);
  }

  onPreviewProgram(program: ShortProgramAdmission) {
    this.previewProgramId.set(Number(program.program?.id));
    this.isProgramPreviewDialogOpen.set(true);
  }

  onSelectProgram(program: ShortProgram) {
    this.selectionConfirmation.show({
      content: 'shorts.confirm_program_selection',
      onConfirm: () => this.itemSelect.emit(program),
    });
  }

  onUnselectProgram(program: ShortProgram) {
    this.unselectionConfirmation.show({
      content: 'shorts.confirm_program_unselection',
      onConfirm: () => this.itemUnselect.emit(program),
    });
  }

  onClosePreviewDialog() {
    this.isProgramPreviewDialogOpen.set(false);
  }
}
