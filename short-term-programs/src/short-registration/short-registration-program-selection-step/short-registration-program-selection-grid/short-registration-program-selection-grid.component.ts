import { ChangeDetectionStrategy, Component, input, output, ResourceRef, signal } from '@angular/core';
import { DialogComponent, FormatDatePipe, PaginatedGridResult, useConfirm, useToast, vetIcons } from '@vet/shared';
import { ShortProgram, ShortProgramAdmission } from '@vet/backend';
import { ButtonComponent } from '@progress/kendo-angular-buttons';
import {
  CellTemplateDirective,
  ColumnComponent,
  GridComponent,
  NoRecordsTemplateDirective, PageChangeEvent
} from '@progress/kendo-angular-grid';
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
    DialogComponent,
  ],
  templateUrl: './short-registration-program-selection-grid.component.html',
  styleUrl: './short-registration-program-selection-grid.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class ShortRegistrationProgramSelectionGridComponent {
  data = input.required<ResourceRef<PaginatedGridResult>>();
  selectedProgramIds = input.required<number[]>();
  itemSelect = output<ShortProgramAdmission>();
  itemUnselect = output<ShortProgramAdmission>();
  pageChange = output<number>();

  previewProgramId = signal(0);
  isProgramPreviewDialogOpen = signal(false);
  toast = useToast();
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
    this.itemSelect.emit(program);
    this.toast.success('shorts.program_selection_success');
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

  onPageChange(event: PageChangeEvent) {
    this.pageChange.emit(event.skip / event.take + 1);
  }
}
