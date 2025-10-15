import { ChangeDetectionStrategy, Component, computed, input, output, ResourceRef } from '@angular/core';
import { KENDO_GRID, PageChangeEvent } from '@progress/kendo-angular-grid';
import { TranslocoPipe } from '@jsverse/transloco';
import { ButtonComponent } from '@progress/kendo-angular-buttons';
import { vetIcons } from '@vet/shared';
import { PagerComponent } from '@progress/kendo-angular-pager';
import { SVGIconComponent } from '@progress/kendo-angular-icons';

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
  imports: [KENDO_GRID, TranslocoPipe, ButtonComponent, PagerComponent, SVGIconComponent],
  templateUrl: './non-formal-field-selection-grid.component.html',
  styleUrl: './non-formal-field-selection-grid.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class NonFormalFieldSelectionGridComponent {
  data = input.required<ResourceRef<any>>();
  selectedProgramId = input<number | null>(null);
  programToggle = output<number>();
  pageChange = output<number>();

  protected readonly vetIcons = vetIcons;

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

  protected onPageChange(event: PageChangeEvent): void {
    const newPage = event.skip / event.take + 1;
    this.pageChange.emit(newPage);
  }

  protected isSelected(programId: number): boolean {
    return this.selectedProgramId() === programId;
  }

  protected isAddButtonDisabled(program: NonFormalRegistrationProgram): boolean {
    const selectedId = this.selectedProgramId();
    // Disable add button if another program is already selected
    return selectedId !== null && selectedId !== program.id;
  }
}
