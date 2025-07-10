import { ChangeDetectionStrategy, Component, effect, inject, input, OnInit, output, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TranslocoPipe } from '@jsverse/transloco';
import {
  ButtonComponent,
  IconButtonComponent,
  InputComponent,
  SelectorComponent,
  vetIcons,
  withoutEmptyProperties,
} from '@vet/shared';
import { ReviewFilters } from '../commission-review.component';
import { useProgramsWithOrganisation } from 'long-term-programs/src/long-term.resources';
import { UserRolesService } from '@vet/auth';
import { tap } from 'rxjs';

@Component({
  selector: 'vet-commission-review-filters',
  imports: [
    SelectorComponent,
    ReactiveFormsModule,
    TranslocoPipe,
    IconButtonComponent,
    ButtonComponent,
    InputComponent,
  ],
  templateUrl: './commission-review-filters.component.html',
  styleUrl: './commission-review-filters.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommissionReviewFiltersComponent implements OnInit {
  numberOfRecords = input<number>();
  filters = input.required<ReviewFilters>();
  filtersChange = output<ReviewFilters>();

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
    this.filtersChange.emit(withoutEmptyProperties(this.filterForm.value) as ReviewFilters);
  }
}
