import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnInit,
  WritableSignal,
  effect,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TranslocoPipe } from '@jsverse/transloco';
import { withoutEmptyProperties } from '@vet/shared/utils';
import { SelectorComponent } from '@vet/shared';
import { vetIcons } from '@vet/shared/icons';
import { ButtonComponent, IconButtonComponent } from '@vet/shared';
import { ShortApplicationsListenersFilters } from '../../short-term-programs.types';
import { RolePipe, UserRolesService } from '@vet/auth';
import { ShortProgramsService } from '@vet/backend';
import {
  useAdmissionsWithPrograms,
  useOrganisationsForApplication,
  useProgramsWithOrganisation,
} from 'short-term-programs/src/short-term.resources';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { tap } from 'rxjs';

@Component({
  selector: 'vet-short-term-registered-listeners-filters',
  imports: [SelectorComponent, ReactiveFormsModule, TranslocoPipe, ButtonComponent, IconButtonComponent, RolePipe],
  templateUrl: './short-term-registered-listeners-filters.component.html',
  styleUrl: './short-term-registered-listeners-filters.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShortTermRegisteredListenersFiltersComponent implements OnInit {
  numberOfRecords = input<number>();
  filters = input.required<ShortApplicationsListenersFilters>();
  filtersChange = output<ShortApplicationsListenersFilters>();

  shortProgramsService = inject(ShortProgramsService);
  userRolesService = inject(UserRolesService);
  private destroyRef = inject(DestroyRef);

  vetIcons = vetIcons;
  formGroup = this.createFormGroup();

  selectedOrganisation = signal<string | undefined>(this.userRolesService.getOrganisationId());
  organisationId = signal<string | undefined>(this.userRolesService.getOrganisationId());
  selectedProgramId = signal<string | undefined>(undefined);

  institutionOptions = useOrganisationsForApplication();
  programsOptions = useProgramsWithOrganisation(this.organisationId);
  admissionOptions = useAdmissionsWithPrograms(this.selectedProgramId);

  constructor() {
    effect(() => {
      this.formGroup.patchValue(this.filters());
    });
  }

  ngOnInit(): void {
    this.updateSignalByControl(this.formGroup.controls['organisation_id'], this.organisationId);
    this.updateSignalByControl(this.formGroup.controls['program_id'], this.selectedProgramId);
    this.onOrganisationChange();
    this.onProgramChange();
  }

  onOrganisationChange() {
    const organisationControl = this.formGroup.get('organisation_id');
    const programControl = this.formGroup.get('program_id');
    const admissionControl = this.formGroup.get('program_admission_id');

    organisationControl?.valueChanges
      .pipe(
        tap(() => {
          programControl?.reset();
          admissionControl?.reset();
        }),
      )
      .subscribe();
  }

  onProgramChange() {
    const programControl = this.formGroup.get('program_id');
    const admissionControl = this.formGroup.get('program_admission_id');

    programControl?.valueChanges
      .pipe(
        tap(() => {
          admissionControl?.reset();
        }),
      )
      .subscribe();
  }

  updateSignalByControl(control: AbstractControl, signal: WritableSignal<string | null | undefined>) {
    control.valueChanges
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        tap((id) => {
          if (id) {
            signal.set(id);
          }
        }),
      )
      .subscribe();
  }

  createFormGroup() {
    return new FormGroup({
      organisation_id: new FormControl<string | null>(null),
      program_id: new FormControl(''),
      program_admission_id: new FormControl<string | null>(null),
    });
  }

  onSubmit() {
    this.filtersChange.emit(withoutEmptyProperties(this.formGroup.value) as ShortApplicationsListenersFilters);
  }

  onClearClick() {
    this.formGroup.patchValue({
      organisation_id: null,
      program_id: null,
      program_admission_id: null,
    });
    this.formGroup.updateValueAndValidity();
    this.onSubmit();
  }
}
