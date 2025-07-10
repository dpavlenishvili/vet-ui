import { ChangeDetectionStrategy, Component, OnInit, effect, inject, input, output, DestroyRef, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TranslocoPipe } from '@jsverse/transloco';
import {
  SelectorComponent,
  VetSwitchComponent,
  vetIcons,
  InputComponent,
  ButtonComponent,
  IconButtonComponent
} from '@vet/shared';
import { SchedulesFilters } from '../exam-selection.component';
import { useProgramsWithOrganisation } from 'long-term-programs/src/long-term.resources';
import { UserRolesService } from '@vet/auth';
import { tap } from 'rxjs';
import { useInstitutionsDictionary } from '@vet/shared-resources';

@Component({
  selector: 'vet-exam-selection-filters',
  imports: [
    SelectorComponent,
    VetSwitchComponent,
    ReactiveFormsModule,
    TranslocoPipe,
    InputComponent,
    ButtonComponent,
    IconButtonComponent,
  ],
  templateUrl: './exam-selection-filters.component.html',
  styleUrl: './exam-selection-filters.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExamSelectionFiltersComponent implements OnInit {
  vetIcons = vetIcons;

  numberOfRecords = input<number>();
  filters = input.required<SchedulesFilters>();
  filtersChange = output<SchedulesFilters>();

  filterForm = this.createFilterForm();

  userRolesService = inject(UserRolesService);
  destroyRef = inject(DestroyRef);

  selectedOrganisation = signal<string | null>(this.userRolesService.organisation());

  programsOptions = useProgramsWithOrganisation(this.selectedOrganisation);
  institutionOptions = useInstitutionsDictionary();

  constructor() {
    effect(() => {
      this.filterForm.patchValue(this.filters());
    });
  }

  ngOnInit(): void {
    this.handleInstitutionChange();
  }

  handleInstitutionChange() {
    this.filterForm
      .get('organisation')
      ?.valueChanges.pipe(
        tap((organisation) => {
          this.selectedOrganisation.set(organisation);
        }),
      )
      .subscribe();
  }

  hasOrganisationsField() {
    return this.userRolesService.hasRole('Default User') || this.userRolesService.hasRole('Super Admin');
  }

  createFilterForm() {
    return new FormGroup({
      program: new FormControl(),
      pid: new FormControl(),
      organisation: new FormControl(),
      spec: new FormControl(),
      fullname: new FormControl(),
      status: new FormControl(),
    });
  }

  clearFilters() {
    this.filterForm.reset();
    this.filterForm.updateValueAndValidity();
    this.onSubmit();
  }

  onSubmit() {
    const value = this.filterForm.value;

    const filterData: SchedulesFilters = {
      program: value.program ?? null,
      pid: value.pid ?? null,
      organisation: value.organisation ?? null,
      spec: value.spec ?? null,
      fullname: value.fullname ?? null,
      status: value.status ?? null,
    };

    this.filtersChange.emit(filterData);
  }
}
