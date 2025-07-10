import { ChangeDetectionStrategy, Component, effect, inject, input, OnInit, output, signal } from '@angular/core';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TranslocoPipe } from '@jsverse/transloco';
import {
  ButtonComponent,
  IconButtonComponent,
  InputComponent,
  SelectorComponent,
  vetIcons,
  withoutEmptyProperties
} from '@vet/shared';
import { CommissionReviewFilters } from '../commission-results.component';
import { UserRolesService } from '@vet/auth';
import { useProgramsWithOrganisation } from 'long-term-programs/src/long-term.resources';
import { tap } from 'rxjs';

@Component({
  selector: 'vet-commission-results-filters',
  imports: [
    TranslocoPipe,
    ReactiveFormsModule,
    InputsModule,
    SelectorComponent,
    IconButtonComponent,
    ButtonComponent,
    InputComponent,
  ],
  templateUrl: './commission-results-filters.component.html',
  styleUrl: './commission-results-filters.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommissionResultsFiltersComponent implements OnInit {
  numberOfRecords = input<number>();
  filters = input.required<CommissionReviewFilters>();
  filtersChange = output<CommissionReviewFilters>();

  vetIcons = vetIcons;
  filterForm = this.createFilterForm();

  userRolesService = inject(UserRolesService);

  selectedOrganisation = signal<string | null>(this.userRolesService.organisation());

  programsOptions = useProgramsWithOrganisation(this.selectedOrganisation);

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

  createFilterForm() {
    return new FormGroup({
      program: new FormControl(),
      pid: new FormControl(),
      fullname: new FormControl(),
    });
  }

  clearFilters() {
    this.filterForm.reset();
    this.filterForm.updateValueAndValidity();
    this.onSubmit();
  }

  onSubmit() {
    this.filtersChange.emit(withoutEmptyProperties(this.filterForm.value) as CommissionReviewFilters);
  }
}
