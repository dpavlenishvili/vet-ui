import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  input,
  OnInit,
  output,
  signal,
} from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { InputsModule, RadioButtonModule } from '@progress/kendo-angular-inputs';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import { LabelModule } from '@progress/kendo-angular-label';
import { SVGIconModule } from '@progress/kendo-angular-icons';
import { TranslocoPipe } from '@jsverse/transloco';
import { AdmissionService, LongTerm } from '@vet/backend';
import { filterNullValues, kendoIcons, RouteParamsService, useAlert, vetIcons } from '@vet/shared';
import { GridDataResult, GridModule, KENDO_GRID, PageChangeEvent } from '@progress/kendo-angular-grid';
import { DialogModule } from '@progress/kendo-angular-dialog';
import { EducationLevel } from 'long-term-programs/src/enums/education-level.enum';
import { ProgramSelectionFiltersComponent } from './program-selection-filters/program-selection-filters.component';
import { rxResource, takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { debounceTime, tap } from 'rxjs';
import { KENDO_TOOLTIP } from '@progress/kendo-angular-tooltip';
import { UnauthorisedProgramPageComponent } from '@vet/unauthorised-programs';

const MAX_PROGRAMS = 3;
const MIN_PROGRAMS_SSM = 2;
const MIN_PROGRAMS_REGULAR = 1;
const DEFAULT_PAGE_SIZE = 5;

export type ProgramSelectionStepFormGroup = FormGroup;
export type ProgramSsmStep = FormGroup;
export type SelectedProgramsStepForm = FormGroup;
export type GeneralInformationStepFromGroup = FormGroup;

export type ProgramSelectionFilter = {
  search?: string | null;
  organisation?: string | null;
  program_name?: string | null;
  program?: string | null;
  program_kind?: string | null;
  duration?: string | null;
  integrated?: boolean | null;
  program_types?: string | null;
  financing_type?: string | null;
  region?: number | null;
  district?: string | null;
  page?: number | null;
};

@Component({
  selector: 'vet-program-selection-step',
  imports: [
    ReactiveFormsModule,
    InputsModule,
    RadioButtonModule,
    ButtonModule,
    LabelModule,
    SVGIconModule,
    TranslocoPipe,
    KENDO_GRID,
    GridModule,
    UnauthorisedProgramPageComponent,
    DialogModule,
    ProgramSelectionFiltersComponent,
    KENDO_TOOLTIP,
  ],
  templateUrl: './program-selection-step.component.html',
  styleUrl: './program-selection-step.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProgramSelectionStepComponent implements OnInit {
  readonly nextClick = output<void>();
  readonly previousClick = output<void>();

  readonly form = input<ProgramSelectionStepFormGroup>();
  readonly ssmStepForm = input<ProgramSsmStep>();
  readonly generalInformationFrom = input<GeneralInformationStepFromGroup>();
  readonly selectedProgramsForm = input<SelectedProgramsStepForm>();
  readonly admissionId = input<string | null>();
  isViewMode = input<boolean>(false);


  readonly isProgramDialogOpen = signal(false);
  readonly isSelectionWarningDialogOpen = signal(false);
  readonly selectionWarningDialogText = signal('');
  readonly singleProgramId = signal(0);
  readonly filters = signal<ProgramSelectionFilter>({});
  readonly skip = signal(0);
  readonly vetIcons = vetIcons;
  readonly kendoIcons = kendoIcons;
  private readonly _selectedPrograms = signal<number[]>([]);
  readonly selectedPrograms = this._selectedPrograms.asReadonly();
  readonly selectedProgramsCount = computed(() => this._selectedPrograms().length);
  private readonly alert = useAlert();
  private readonly admissionService = inject(AdmissionService);
  eligiblePrograms$ = rxResource({
    request: () => ({
      admissionId: this.admissionId(),
      filters: filterNullValues(this.filters()),
    }),
    loader: ({ request: { admissionId, filters } }) => {
      // ტიპი არის დასამატებელი, აღსაწერია სვაგერი სწორად.
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      return this.admissionService.eligibleProgramsList(admissionId, filters);
    },
  });
  readonly gridData = computed((): GridDataResult => {
    const data = this.eligiblePrograms$.value()?.data || [];
    const total = this.eligiblePrograms$.value()?.meta?.total || 0;
    return { data, total };
  });
  readonly pageSize = computed(() => this.eligiblePrograms$.value()?.meta?.per_page || DEFAULT_PAGE_SIZE);
  private readonly destroyRef = inject(DestroyRef);
  private readonly routeParamsService = inject(RouteParamsService);

  ngOnInit(): void {
    this.initializeSelection();
    this.loadRouteParams();
  }

  onPreviewProgramClick(item: LongTerm): void {
    this.singleProgramId.set(Number(item.id));
    this.isProgramDialogOpen.set(true);
  }

  isAddButtonDisabled(item: LongTerm): boolean {
    const maxReached = this.selectedProgramsCount() >= MAX_PROGRAMS;
    const educationLevel = this.generalInformationFrom()?.get('education_level')?.value;
    const isIntegrated = Boolean(item.is_integrated);
    const isBasicEducation = isIntegrated && educationLevel === EducationLevel.Basic;
    const isCollegeEducation = isIntegrated && educationLevel === EducationLevel.ProfessionalBasic;

    return maxReached || isBasicEducation || isCollegeEducation;
  }

  onCloseClick(): void {
    this.isProgramDialogOpen.set(false);
    this.isSelectionWarningDialogOpen.set(false);
  }

  onPreviousClick(): void {
    this.previousClick.emit();
  }

  toggleProgramSelection(item: LongTerm): void {
    if (!item.program_id) return;

    const currentSelected = [...this._selectedPrograms()];
    const isSelected = currentSelected.includes(item.program_id);

    let updatedSelection: number[];
    let actionStatusText: string;

    if (isSelected) {
      updatedSelection = currentSelected.filter((id) => id !== item.program_id);
      actionStatusText = 'programs.programRemoved';
    } else {
      if (this.isAddButtonDisabled(item)) {
        this.alert.show({
          text: 'programs.cannotAddProgram',
          variant: 'warning',
        });
        return;
      }
      updatedSelection = [...currentSelected, item.program_id];
      actionStatusText = 'programs.programAdded';
    }

    this._selectedPrograms.set(updatedSelection);
    this.updateFormState(updatedSelection);

    this.persistSelection(updatedSelection, actionStatusText, isSelected);
  }

  onNextClick(): void {
    this.form()?.markAllAsTouched();

    const minRequired = this.getMinRequiredPrograms();
    const currentCount = this.selectedProgramsCount();

    if (currentCount < minRequired) {
      const messageKey =
        minRequired === MIN_PROGRAMS_SSM
          ? 'programs.warningMinTwoProgramShouldBeSelected'
          : 'programs.warningMinOneProgramShouldBeSelected';

      this.alert.show({
        text: messageKey,
        variant: 'warning',
      });
      return;
    }

    if (this.form()?.valid) {
      this.nextClick.emit();
    }
  }

  handlePageChange(event: PageChangeEvent): void {
    const page = event.skip / event.take + 1;
    this.skip.set(event.skip);

    const updatedFilters = {
      ...this.filters(),
      page,
    };
    this.filters.set(updatedFilters);
    this.updateRouteParams(updatedFilters, event.skip);
  }

  onFiltersChange(filterValue: ProgramSelectionFilter): void {
    this.filters.set(filterValue || {});
    this.skip.set(0);
    this.updateRouteParams(filterValue, 0);
  }

  private initializeSelection(): void {
    const programs = (this.form()?.get('program_ids')?.value as number[]) || [];
    this._selectedPrograms.set([...programs]);
  }

  private loadRouteParams(): void {
    this.routeParamsService
      .get<{ filters: ProgramSelectionFilter; skip: number }>()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((params) => {
        if (params.filters) {
          this.filters.set(params.filters);
        }
        if (params.skip !== undefined && params.skip !== this.skip()) {
          this.skip.set(Number(params.skip));
        }
      });
  }

  private updateFormState(programIds: number[]): void {
    this.form()?.get('program_ids')?.setValue(programIds, { emitEvent: false });
    this.selectedProgramsForm()?.get('program_ids')?.setValue(programIds, { emitEvent: false });
  }

  private persistSelection(updatedSelection: number[], actionStatusText: string, wasSelected: boolean): void {
    const admissionId = this.admissionId();
    if (!admissionId) return;

    const payload = {
      ...this.form()?.getRawValue(),
      program_ids: updatedSelection,
    };

    this.admissionService
      .editAdmission(admissionId, payload)
      .pipe(
        debounceTime(300),
        tap({
          next: () => {
            this.alert.show({
              text: actionStatusText,
              variant: wasSelected ? 'warning' : 'success',
            });
          },
          error: () => {
            const programs = (this.form()?.get('program_ids')?.value as number[]) || [];
            this._selectedPrograms.set(programs);
            this.alert.show({
              text: 'shared.errorOccurred',
              variant: 'error',
            });
          },
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();
  }

  private getMinRequiredPrograms(): number {
    const hasSsmContact = Boolean(this.ssmStepForm()?.get('e_name')?.value);
    return hasSsmContact ? MIN_PROGRAMS_SSM : MIN_PROGRAMS_REGULAR;
  }

  private updateRouteParams(filters: ProgramSelectionFilter, skip: number): void {
    this.routeParamsService.update({ filters, skip });
  }
}
