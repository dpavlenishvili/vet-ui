import { ChangeDetectionStrategy, Component, computed, effect, inject, input, output, signal } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TranslocoPipe } from '@jsverse/transloco';
import { ButtonComponent } from '@progress/kendo-angular-buttons';
import { NonFormalService } from '@vet/backend';
import { NonFormalProgramsFiltersComponent } from '../../non-formal-programs-filters/non-formal-programs-filters.component';
import { NonFormalProgramFilters } from '../../non-formal-programs.types';
import { rxResource } from '@angular/core/rxjs-interop';
import { NonFormalFieldSelectionGridComponent } from './non-formal-field-selection-grid/non-formal-field-selection-grid.component';
import { PaginatedGridResult, vetIcons } from '@vet/shared';

const DEFAULT_PAGE_SIZE = 15;

interface NonFormalProgram {
  id: number;
  isced: string;
  [key: string]: any;
}

@Component({
  selector: 'vet-non-formal-field-selection-step',
  imports: [
    ReactiveFormsModule,
    TranslocoPipe,
    ButtonComponent,
    NonFormalProgramsFiltersComponent,
    NonFormalFieldSelectionGridComponent,
  ],
  templateUrl: './non-formal-field-selection-step.component.html',
  styleUrl: './non-formal-field-selection-step.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class NonFormalFieldSelectionStepComponent {
  formGroup = input.required<FormGroup>();
  isViewMode = input<boolean>(false);
  next = output<void>();

  private readonly nonFormalService = inject(NonFormalService);

  protected readonly vetIcons = vetIcons;
  protected readonly filters = signal<NonFormalProgramFilters>({});
  protected readonly page = signal(1);
  protected readonly selectedProgramId = signal<number | null>(null);

  private readonly isInitialized = signal(false);

  constructor() {
    // Initialize selectedProgramId from form value once
    effect(
      () => {
        const form = this.formGroup();
        if (!this.isInitialized() && form) {
          const initialValue = form.get('selected_program_id')?.value ?? null;
          this.selectedProgramId.set(initialValue);
          this.isInitialized.set(true);
        }
      },
      { allowSignalWrites: true },
    );
  }

  protected readonly programsResource = rxResource({
    request: () => ({ filters: this.filters(), page: this.page() }),
    loader: ({ request }) => {
      const { filters } = request;
      const queryParams = this.buildQueryParams(filters);
      return this.nonFormalService.nonFormalsRegistration(queryParams);
    },
  });

  protected readonly paginatedData = computed(() => {
    const response = this.programsResource.value();
    if (!response) {
      return {
        data: [],
        total: 0,
        skip: 0,
        size: DEFAULT_PAGE_SIZE,
      } as PaginatedGridResult<NonFormalProgram>;
    }

    const currentPage = this.page();
    const pageSize = response.meta?.per_page ?? DEFAULT_PAGE_SIZE;

    return {
      data: response.data ?? [],
      total: response.meta?.total ?? 0,
      skip: (currentPage - 1) * pageSize,
      size: pageSize,
    } as PaginatedGridResult<NonFormalProgram>;
  });

  protected onFiltersChange(newFilters: NonFormalProgramFilters): void {
    this.filters.set(newFilters);
    this.page.set(1);
  }

  protected onPageChange(newPage: number): void {
    this.page.set(newPage);
  }

  protected onProgramToggle(programId: number): void {
    const currentSelectedId = this.selectedProgramId();
    const newValue = currentSelectedId === programId ? null : programId;

    this.updateSelection(newValue);
  }

  protected onNextClick(): void {
    const control = this.getSelectedProgramControl();

    if (!this.selectedProgramId()) {
      control?.markAsTouched();
      return;
    }

    this.next.emit();
  }

  private buildQueryParams(filters: NonFormalProgramFilters): Record<string, string> {
    const params: Record<string, string> = {};

    if (filters.search) params['filters[search]'] = filters.search;
    if (filters.region) params['filters[region]'] = filters.region;
    if (filters.district) params['filters[district]'] = filters.district;
    if (filters.organisation_name) params['filters[organisation]'] = filters.organisation_name;

    return params;
  }

  private updateSelection(programId: number | null): void {
    const control = this.getSelectedProgramControl();

    this.formGroup().patchValue({ selected_program_id: programId });
    this.selectedProgramId.set(programId);

    control?.markAsTouched();
    control?.updateValueAndValidity();
  }

  private getSelectedProgramControl() {
    return this.formGroup().controls['selected_program_id'];
  }
}
