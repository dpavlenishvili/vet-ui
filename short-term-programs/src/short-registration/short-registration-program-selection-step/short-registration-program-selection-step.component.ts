import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  output,
  PLATFORM_ID,
  signal,
} from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ButtonComponent } from '@progress/kendo-angular-buttons';
import { ShortRegistrationProgramSelectionGridComponent } from './short-registration-program-selection-grid/short-registration-program-selection-grid.component';
import { rxResource } from '@angular/core/rxjs-interop';
import { ProgramsService } from '@vet/backend';
import { ActivatedRoute, Router } from '@angular/router';
import { FilterOptionsMap, toFilterOptionsMap, useFilters, useFiltersUpdater } from '@vet/shared';
import {
  ShortTermProgramFilters,
  ShortTermProgramsFiltersComponent,
} from '../../short-term-programs-filters/short-term-programs-filters.component';
import { isPlatformBrowser } from '@angular/common';

export type ShortRegistrationProgramSelectionStepFormGroup = FormGroup<{}>;

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

  shortProgramsService = inject(ProgramsService);
  platformId = inject(PLATFORM_ID);
  router = inject(Router);
  activatedRoute = inject(ActivatedRoute);
  filterOptionsMap = signal<FilterOptionsMap>(new Map());
  filters = useFilters<ShortTermProgramFilters>();
  updateFilters = useFiltersUpdater<ShortTermProgramFilters>();
  data = rxResource({
    request: () => this.filters(),
    loader: ({ request }) =>
      this.shortProgramsService.programsShort({
        filter: JSON.stringify(request),
      }),
  });
  programs = computed(() => this.data.value()?.data ?? []);

  constructor() {
    effect(() => {
      if (this.data.hasValue()) {
        const filters = this.data.value()?.filters;

        if (filters) {
          this.filterOptionsMap.set(toFilterOptionsMap(filters));
        }
      }
    });
  }

  get isBrowser() {
    return isPlatformBrowser(this.platformId);
  }

  onFiltersChange(filters: ShortTermProgramFilters) {
    this.updateFilters(filters);
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
}
