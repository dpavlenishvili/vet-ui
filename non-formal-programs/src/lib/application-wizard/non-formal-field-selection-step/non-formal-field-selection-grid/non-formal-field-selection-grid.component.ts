import { ChangeDetectionStrategy, Component, computed, input, output, ResourceRef } from '@angular/core';
import { KENDO_GRID, PageChangeEvent } from '@progress/kendo-angular-grid';
import { TranslocoPipe } from '@jsverse/transloco';
import { IconButtonComponent, vetIcons } from '@vet/shared';
import { PagerComponent } from '@progress/kendo-angular-pager';
import { TooltipDirective } from '@progress/kendo-angular-tooltip';

export interface NonFormalRegistrationProgram {
  id: number;
  isced: string;
  isced_code: string;
  registration_start_date: string;
  registration_end_date: string;
  organisation_name: string;
}

@Component({
  selector: 'vet-non-formal-field-selection-grid',
  imports: [KENDO_GRID, TranslocoPipe, PagerComponent, TooltipDirective, IconButtonComponent],
  templateUrl: './non-formal-field-selection-grid.component.html',
  styleUrl: './non-formal-field-selection-grid.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class NonFormalFieldSelectionGridComponent {
  data = input.required<ResourceRef<any>>();
  selectedProgramId = input<number | null>(null);
  isViewMode = input<boolean>(false);
  registeredNonFormalIds = input<number[]>([]);
  isFieldChangeDisabled = input<boolean>(false);
  currentApplicationFieldId = input<number | null>(null); // Current application's field (for update mode)
  programToggle = output<number>();
  pageChange = output<number>();
  programPreview = output<number>();

  protected readonly vetIcons = vetIcons;

  /**
   * Computed signal that returns a function to check if the add button should be disabled.
   * This ensures reactive updates when any input signal changes.
   */
  protected readonly isAddButtonDisabled = computed(() => {
    const selectedId = this.selectedProgramId();
    const fieldChangeDisabled = this.isFieldChangeDisabled();
    const registeredIds = this.registeredNonFormalIds();
    const currentFieldId = this.currentApplicationFieldId();

    return (program: NonFormalRegistrationProgram): boolean => {
      // Disable if another program is already selected
      if (selectedId !== null && selectedId !== program.id) {
        return true;
      }

      // Disable if status is not draft (field changes disabled)
      if (fieldChangeDisabled) {
        return true;
      }

      // Disable if this field already has a registered application
      // BUT allow reselecting user's own current field (for update mode)
      const isOwnField = currentFieldId !== null && program.id === currentFieldId;
      return registeredIds.includes(program.id) && !isOwnField;
    };
  });

  /**
   * Computed signal that returns a function to get the tooltip text for buttons.
   * This ensures reactive updates when any input signal changes.
   */
  protected readonly getTooltipText = computed(() => {
    const selectedId = this.selectedProgramId();
    const fieldChangeDisabled = this.isFieldChangeDisabled();
    const registeredIds = this.registeredNonFormalIds();
    const currentFieldId = this.currentApplicationFieldId();

    return (program: NonFormalRegistrationProgram): string => {
      const isSelected = selectedId === program.id;

      // Check if button is disabled
      if (selectedId !== null && selectedId !== program.id) {
        return 'non_formal.another_field_selected';
      }

      if (fieldChangeDisabled) {
        return 'non_formal.cannot_change_field_after_submission';
      }

      // Only show "already registered" tooltip for OTHER users' fields, not own field
      const isOwnField = currentFieldId !== null && program.id === currentFieldId;
      if (registeredIds.includes(program.id) && !isOwnField) {
        return 'non_formal.field_already_registered';
      }

      // If not disabled, show add/remove tooltip
      return isSelected ? 'non_formal.remove_program' : 'non_formal.add_program';
    };
  });

  protected readonly paginatedData = computed(() => {
    const response = this.data().value();
    if (!response) {
      return { data: [], total: 0, skip: 0, size: 10 };
    }

    const currentPage = response.meta?.current_page ?? 1;
    const pageSize = response.meta?.per_page ?? 10;

    return {
      data: response.data ?? [],
      total: response.meta?.total ?? 0,
      skip: (currentPage - 1) * pageSize,
      size: pageSize,
    };
  });

  protected onToggleProgramSelection(program: NonFormalRegistrationProgram): void {
    this.programToggle.emit(program.id);
  }

  protected onPreviewProgram(program: NonFormalRegistrationProgram): void {
    this.programPreview.emit(program.id);
  }

  protected onPageChange(event: PageChangeEvent): void {
    const newPage = event.skip / event.take + 1;
    this.pageChange.emit(newPage);
  }

  protected isSelected(programId: number): boolean {
    return this.selectedProgramId() === programId;
  }
}
