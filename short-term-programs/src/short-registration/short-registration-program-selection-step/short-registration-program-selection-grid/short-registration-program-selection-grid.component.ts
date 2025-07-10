import { ChangeDetectionStrategy, Component, input, output, ResourceRef } from '@angular/core';
import { FormatDatePipe, IconComponent, PaginatedGridResult, useAlert, useConfirm, vetIcons } from '@vet/shared';
import { ShortProgram, ShortProgramAdmission } from '@vet/backend';
import { ButtonComponent } from '@progress/kendo-angular-buttons';
import {
  CellTemplateDirective,
  ColumnComponent,
  GridComponent,
  NoRecordsTemplateDirective,
  PageChangeEvent,
} from '@progress/kendo-angular-grid';
import { SVGIconComponent } from '@progress/kendo-angular-icons';
import { TranslocoPipe } from '@jsverse/transloco';
import { useProgramDialog } from '../../../short-term-programs.signals';

@Component({
  selector: 'vet-short-registration-program-selection-grid',
  imports: [
    ButtonComponent,
    CellTemplateDirective,
    ColumnComponent,
    GridComponent,
    NoRecordsTemplateDirective,
    SVGIconComponent,
    TranslocoPipe,
    FormatDatePipe,
    IconComponent
  ],
  templateUrl: './short-registration-program-selection-grid.component.html',
  styleUrl: './short-registration-program-selection-grid.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class ShortRegistrationProgramSelectionGridComponent {
  data = input.required<ResourceRef<PaginatedGridResult>>();
  selectedProgramIds = input.required<number[]>();
  isSelectionDisabled = input.required<boolean>();
  itemSelect = output<ShortProgramAdmission>();
  itemUnselect = output<ShortProgramAdmission>();
  pageChange = output<number>();

  programDialog = useProgramDialog();
  alert = useAlert();
  unselectionConfirmation = useConfirm();
  vetIcons = vetIcons;

  isProgramSelected(item: ShortProgramAdmission) {
    return item.id && this.selectedProgramIds().includes(item.id);
  }

  onPreviewProgram(program: ShortProgramAdmission) {
    const programId = Number(program.program?.id);
    this.programDialog.show({ programId });
  }

  onSelectProgram(program: ShortProgram) {
    this.itemSelect.emit(program);
    this.alert.success('shorts.program_selection_success')
  }

  onUnselectProgram(program: ShortProgram) {
    this.unselectionConfirmation.show({
      content: 'shorts.confirm_program_unselection',
      onConfirm: () => this.itemUnselect.emit(program),
    });
  }

  onPageChange(event: PageChangeEvent) {
    this.pageChange.emit(event.skip / event.take + 1);
  }
}
