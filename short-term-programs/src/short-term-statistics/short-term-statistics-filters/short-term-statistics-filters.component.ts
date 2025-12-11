import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  effect,
  inject,
  input,
  OnInit,
  output,
  signal,
} from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TranslocoPipe } from '@jsverse/transloco';
import { UserRolesService } from '@vet/auth';
import { withoutEmptyProperties } from '@vet/shared';
import { SelectorComponent } from '@vet/shared/heavy-components';
import { IconButtonComponent, ButtonComponent } from '@vet/shared/ui-components';
import { ShortStatsFilters } from 'short-term-programs/src/short-term-programs.types';
import { useProgramKinds } from '@vet/shared-resources';
import {
  useOrganisationsForApplication,
  useProgramsWithOrganisation,
} from 'short-term-programs/src/short-term.resources';
import { ActivatedRoute } from '@angular/router';
import { tap } from 'rxjs';

@Component({
  selector: 'vet-short-term-statistics-filters',
  imports: [SelectorComponent, ReactiveFormsModule, TranslocoPipe, ButtonComponent, IconButtonComponent],
  templateUrl: './short-term-statistics-filters.component.html',
  styleUrl: './short-term-statistics-filters.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShortTermStatisticsFiltersComponent implements OnInit {
  numberOfRecords = input<number>();
  filters = input.required<ShortStatsFilters>();
  filtersChange = output<ShortStatsFilters>();

  userRolesService = inject(UserRolesService);
  destroyRef = inject(DestroyRef);
  private route = inject(ActivatedRoute);
  routeOrganisationId = this.route.snapshot.paramMap.get('organisationId');

  organisationId = signal<string | undefined>(
    this.userRolesService.getOrganisationId() ?? String(this.routeOrganisationId),
  );
  selectedProgramId = signal<string | undefined>(undefined);
  institutionOptions = useOrganisationsForApplication();
  programsOptions = useProgramsWithOrganisation(this.organisationId);
  programKindOptions = useProgramKinds('short-term');

  formGroup = this.createFormGroup();

  constructor() {
    effect(() => {
      this.formGroup.patchValue(this.filters());
    });
  }

  ngOnInit(): void {
    this.onProgramChange();
  }

  onProgramChange() {
    const programControl = this.formGroup.get('program');
    const programKindControl = this.formGroup.get('program_kind');

    programControl?.valueChanges.pipe(tap(() => programKindControl?.reset())).subscribe();
  }

  createFormGroup() {
    return new FormGroup({
      program: new FormControl(''),
      program_kind: new FormControl<string | null>(null),
    });
  }

  onSubmit() {
    this.filtersChange.emit(withoutEmptyProperties(this.formGroup.value) as ShortStatsFilters);
  }

  onClearClick() {
    this.formGroup.patchValue({
      program: null,
      program_kind: null,
    });
    this.formGroup.updateValueAndValidity();
    this.onSubmit();
  }
}
