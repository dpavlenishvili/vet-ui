import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  output,
  PLATFORM_ID,
  signal
} from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ButtonComponent } from '@progress/kendo-angular-buttons';
import { ShortRegistrationProgramSelectionGridComponent } from './short-registration-program-selection-grid/short-registration-program-selection-grid.component';
import { rxResource } from '@angular/core/rxjs-interop';
import { ProgramsService, ShortProgramAdmission } from '@vet/backend';
import { ActivatedRoute, Router } from '@angular/router';
import {
  flattenQueryParams,
  FormControls,
  getUniqueItems, PaginatedGridResult,
  useControlValue,
  useFilters,
  useFiltersUpdater, usePage, usePageUpdater
} from '@vet/shared';
import { ShortTermProgramsFiltersComponent } from '../../short-term-programs-filters/short-term-programs-filters.component';
import { isPlatformBrowser } from '@angular/common';
import { ShortTermProgramFilters } from '../../short-term-programs.types';
import { map, of } from 'rxjs';
import { GridDataResult } from '@progress/kendo-angular-grid';

export interface ShortRegistrationProgramSelectionStepFormData {
  selected_programs: ShortProgramAdmission[] | null;
}

export type ShortRegistrationProgramSelectionStepFormGroup = FormGroup<
  FormControls<ShortRegistrationProgramSelectionStepFormData>
>;

@Component({
  selector: 'vet-short-registration-program-selection-step',
  imports: [
    TranslocoPipe,
    ReactiveFormsModule,
    ButtonComponent,
    ShortRegistrationProgramSelectionGridComponent,
    ShortTermProgramsFiltersComponent,
  ],
  templateUrl: './short-registration-program-selection-step.component.html',
  styleUrl: './short-registration-program-selection-step.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class ShortRegistrationProgramSelectionStepComponent {
  formGroup = input.required<ShortRegistrationProgramSelectionStepFormGroup>();
  next = output();
  back = output();
  itemSelect = output<ShortProgramAdmission>();
  itemUnselect = output<ShortProgramAdmission>();

  shortProgramsService = inject(ProgramsService);
  platformId = inject(PLATFORM_ID);
  router = inject(Router);
  activatedRoute = inject(ActivatedRoute);

  filters = useFilters<ShortTermProgramFilters>();
  page = usePage();
  realtimeFilters = signal<ShortTermProgramFilters>({});
  updateFilters = useFiltersUpdater<ShortTermProgramFilters>();
  updatePage = usePageUpdater();
  data = rxResource({
    request: () => ({
      filters: this.filters(),
      page: this.page(),
    }),
    defaultValue: {
      data: [],
      total: 0,
      size: 0,
      skip: 0,
    },
    loader: ({ request }) => this.shortProgramsService
      .programsShortAdmissions({
        page: request.page.toString(),
        ...flattenQueryParams(request.filters, 'filters'),
      } as any)
      .pipe(map(response => ({
        data: response.data ?? [],
        total: response.meta?.total ?? response.data?.length ?? 0,
        size: response.meta?.per_page ?? response.data?.length ?? 0,
        skip: response.meta?.from ? response.meta.from - 1 : 0,
      }) as PaginatedGridResult)),
  });
  foundProgramsCount = rxResource<number | null, ShortTermProgramFilters>({
    request: () => this.realtimeFilters(),
    defaultValue: null,
    loader: ({ request }) => {
      if (Object.keys(request).length === 0) {
        return of(0);
      }

      return this.shortProgramsService
        .programsShortAdmissions(flattenQueryParams(request, 'filters'))
        .pipe(map((response) => response.meta?.total ?? 0));
    },
  });
  selectedPrograms = useControlValue(this.formGroup, (form) => form.controls.selected_programs);
  selectedProgramIds = computed(() => {
    const selectedPrograms: ShortProgramAdmission[] = this.selectedPrograms() ?? [];

    return selectedPrograms.map((item) => item.id).filter(Boolean) as number[];
  });

  get isBrowser() {
    return isPlatformBrowser(this.platformId);
  }

  onFiltersChange(filters: ShortTermProgramFilters) {
    this.updateFilters(filters);
  }

  onPageChange(page: number) {
    this.updatePage(page);
  }

  onSubmit() {
    this.formGroup().markAllAsTouched();

    if (this.formGroup().valid) {
      this.next.emit();
    }
  }

  onBack() {
    this.back.emit();
  }

  onSelectProgram(item: ShortProgramAdmission) {
    if (item.id) {
      const control = this.formGroup().controls.selected_programs;
      const newItems = [...(control.value ?? []), item];
      control.setValue(getUniqueItems(newItems, (item) => item.id as number));
    }
  }

  onUnselectProgram(item: ShortProgramAdmission) {
    if (item.id) {
      const control = this.formGroup().controls.selected_programs;
      const items = control.value ?? [];
      control.setValue(items.filter((i) => i.id !== item.id));
    }
  }

  onDialogFiltersChangeRealtime(filters: ShortTermProgramFilters) {
    this.realtimeFilters.set(filters);
  }
}
