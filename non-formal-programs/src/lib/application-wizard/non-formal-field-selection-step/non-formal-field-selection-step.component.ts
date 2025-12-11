import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TranslocoPipe } from '@jsverse/transloco';
import { NonFormalService } from '@vet/backend';
import { NonFormalProgramsFiltersComponent } from '../../non-formal-programs-filters/non-formal-programs-filters.component';
import { NonFormalProgramFilters } from '../../non-formal-programs.types';
import { rxResource, takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NonFormalFieldSelectionGridComponent } from './non-formal-field-selection-grid/non-formal-field-selection-grid.component';
import { PaginatedGridResult } from '@vet/shared';
import { useAlert } from '@vet/shared/dialogs';
import { ButtonComponent as VetButtonComponent } from '@vet/shared/ui-components';
import { NonFormalProgramPageComponent } from '../../non-formal-program-page/non-formal-program-page.component';
import { useNonFormalProgramDialog } from '../../non-formal-programs.signals';
import { NonFormalApplicationData } from '../application-wizard.component';

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
    VetButtonComponent,
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
  applicationData = input<NonFormalApplicationData | null>(null);
  next = output<void>();

  private readonly nonFormalService = inject(NonFormalService);
  private readonly alert = useAlert();
  private readonly destroyRef = inject(DestroyRef);

  protected readonly filters = signal<NonFormalProgramFilters>({});
  protected readonly page = signal(1);
  protected readonly selectedProgramId = signal<number | null>(null);
  protected readonly programDialog = useNonFormalProgramDialog(NonFormalProgramPageComponent);

  protected readonly registeredNonFormalIds = signal<number[]>([]);

  protected readonly isFieldChangeDisabled = computed(() => {
    const data = this.applicationData();
    if (!data || !data.id) return false;

    return !data.can_change_program;
  });

  constructor() {
    // Effect to sync selectedProgramId with form control value
    effect(() => {
      const form = this.formGroup();

      if (form) {
        const control = form.get('selected_program_id');

        // Set initial value from form control
        const currentValue = control?.value ?? null;
        this.selectedProgramId.set(currentValue);

        // Subscribe to value changes
        control?.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((value) => {
          this.selectedProgramId.set(value ?? null);
        });
      }
    });

    // Extract registeredNonFormalIds from API response
    effect(
      () => {
        const response = this.programsResource.value();
        if (response && response.registeredNonFormalIds) {
          this.registeredNonFormalIds.set(response.registeredNonFormalIds);
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

  protected onPreviewProgramClick(programId: number): void {
    if (programId) {
      this.programDialog.show({ programId });
    }
  }

  protected onNextClick(): void {
    if (this.isViewMode()) {
      this.next.emit();
      return;
    }

    const control = this.getSelectedProgramControl();

    if (!this.selectedProgramId()) {
      control?.markAsTouched();
      this.alert.show({
        text: 'non_formal.error_select_at_least_one_field',
        variant: 'warning',
      });
      return;
    }

    this.next.emit();
  }

  private buildQueryParams(filters: NonFormalProgramFilters): Record<string, string> {
    const params: Record<string, string> = {};

    if (filters.search) params['filters[search]'] = filters.search;
    if (filters.region != null) params['filters[region]'] = String(filters.region);
    if (filters.district != null) params['filters[district]'] = String(filters.district);
    if (filters.organisation != null) params['filters[organisation]'] = String(filters.organisation);

    // Handle isced_code array with indexed parameters
    if (filters.isced_code != null && Array.isArray(filters.isced_code) && filters.isced_code.length > 0) {
      filters.isced_code.forEach((code, index) => {
        params[`filters[isced_code][${index}]`] = code;
      });
    }

    if (filters.registration_start_from != null)
      params['filters[registration_start_from]'] = String(filters.registration_start_from);
    if (filters.registration_start_to != null)
      params['filters[registration_start_to]'] = String(filters.registration_start_to);

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
