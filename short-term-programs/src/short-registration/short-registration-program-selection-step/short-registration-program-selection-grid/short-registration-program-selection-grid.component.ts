import { ChangeDetectionStrategy, Component, inject, input, output, ResourceRef } from '@angular/core';
import {
  DateDiffPipe,
  FormatDatePipe,
  IconButtonComponent,
  IconComponent,
  PaginatedGridResult,
  useAlert,
  useConfirm,
  vetIcons,
} from '@vet/shared';
import { ProgramShortAdmissionRes, ShortProgram, ShortProgramAdmission } from '@vet/backend';
import {
  CellTemplateDirective,
  ColumnComponent,
  GridComponent,
  NoRecordsTemplateDirective,
  PageChangeEvent,
} from '@progress/kendo-angular-grid';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { useProgramDialog } from '../../../short-term-programs.signals';
import { KENDO_TOOLTIP } from '@progress/kendo-angular-tooltip';
import { ShortAdmissionEligibility } from 'short-term-programs/src/short-term-programs.types';

@Component({
  selector: 'vet-short-registration-program-selection-grid',
  imports: [
    CellTemplateDirective,
    ColumnComponent,
    GridComponent,
    NoRecordsTemplateDirective,
    TranslocoPipe,
    FormatDatePipe,
    IconComponent,
    DateDiffPipe,
    KENDO_TOOLTIP,
    IconButtonComponent,
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

  translocoService = inject(TranslocoService);

  programDialog = useProgramDialog();
  alert = useAlert();
  unselectionConfirmation = useConfirm();
  vetIcons = vetIcons;

  getEligibilityError(item: ShortAdmissionEligibility): string {
    if (!item.eligibility?.eligible) {
      const personError = item?.eligibility?.personsExistingFlowsErrors?.[0]?.error?.reason;
      const prerequisiteError = item?.eligibility?.programPreRequisiteErrors?.[0]?.reason;
      const reason = personError || prerequisiteError;

      return reason;
    }

    return 'shorts.add_program';
  }

  isProgramSelected(item: ShortProgramAdmission) {
    return item.id && this.selectedProgramIds().includes(item.id);
  }

  onPreviewProgram(program: ShortProgramAdmission) {
    const programId = Number(program.program?.id);
    this.programDialog.show({ programId });
  }

  onSelectProgram(program: ShortProgram) {
    this.itemSelect.emit(program);
    this.alert.success('shorts.program_selection_success');
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
