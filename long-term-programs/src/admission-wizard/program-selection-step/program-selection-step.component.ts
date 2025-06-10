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
import { filterNullValues, kendoIcons, RouteParamsService, useAlert, vetIcons } from '@vet/shared'; // Import RouteParamsService
import { GridDataResult, GridModule, KENDO_GRID, PageChangeEvent } from '@progress/kendo-angular-grid';
import { ProgramComponent } from 'programs/src/program/program.component';
import { DialogModule } from '@progress/kendo-angular-dialog';
import { EducationLevel } from 'long-term-programs/src/enums/education-level.enum';
import { ProgramSelectionFiltersComponent } from './program-selection-filters/program-selection-filters.component';
import { rxResource, takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { tap } from 'rxjs';

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
    ProgramComponent,
    DialogModule,
    ProgramSelectionFiltersComponent,
  ],
  templateUrl: './program-selection-step.component.html',
  styleUrl: './program-selection-step.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProgramSelectionStepComponent implements OnInit {
  nextClick = output<void>();
  previousClick = output<void>();
  form = input<ProgramSelectionStepFormGroup>();
  ssmStepForm = input<ProgramSsmStep>();
  generalInformationFrom = input<GeneralInformationStepFromGroup>();
  selectedProgramsForm = input<SelectedProgramsStepForm>();
  admissionId = input<string | null>();

  isProgramDialogOpen = signal(false);
  isSelectionWarningDialogOpen = signal(false);
  selectionWarningDialogText = signal('');
  singleProgramId = signal(0);
  selectedPrograms = signal<number[]>([]);
  selectedProgramsCount = signal<number>(0);
  filters = signal<ProgramSelectionFilter>({});
  vetIcons = vetIcons;
  kendoIcons = kendoIcons;
  previewProgram: LongTerm | null = null;

  private alert = useAlert();
  private admissionService = inject(AdmissionService);
  private destroyRef = inject(DestroyRef);
  private routeParamsService = inject(RouteParamsService);

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

  readonly gridData = computed(() => {
    const val = this.eligiblePrograms$.value();
    return { data: val?.data || [], total: val?.meta?.total || 0 } as GridDataResult;
  });
  readonly pageSize = computed(() => this.eligiblePrograms$.value()?.meta?.per_page || 5);
  readonly skip = signal(0);

  ngOnInit() {
    const programs = (this.form()?.get('program_ids')?.value as number[]) || [];
    this.selectedPrograms.set(programs);
    this.selectedProgramsCount.set(programs.length);
    this.loadRouteParams();
  }

  private loadRouteParams() {
    this.routeParamsService
      .get<{ filters: ProgramSelectionFilter; skip: number }>()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((params) => {
        console.log(params);
        if (params.filters) {
          this.filters.set(params.filters);
        }
        if (params.skip !== undefined && params.skip !== this.skip()) {
          this.skip.set(Number(params.skip));
        }
      });
  }

  onPreviewProgramClick(item: LongTerm) {
    this.singleProgramId.set(Number(item.id));
    this.isProgramDialogOpen.set(true);
    this.previewProgram = item;
  }

  isAddButtonDisabled(item: LongTerm) {
    const maxReached = this.selectedProgramsCount() >= 3;
    const educationLevel = this.generalInformationFrom()?.get('education_level')?.value;
    const isIntegrated = !!item.is_integrated;
    const isBasicEducation = isIntegrated && educationLevel === EducationLevel.Basic;
    const isCollegeEducation = isIntegrated && educationLevel === EducationLevel.ProfessionalBasic;
    return maxReached || isBasicEducation || isCollegeEducation;
  }

  onCloseClick() {
    this.isProgramDialogOpen.set(false);
    this.isSelectionWarningDialogOpen.set(false);
  }

  onPreviousClick() {
    this.previousClick.emit();
  }

  toggleProgramSelection(item: LongTerm) {
    if (!item.program_id) {
      return;
    }
    const currentSelected = this.selectedPrograms();
    const isSelected = currentSelected.includes(item.program_id);
    let actionStatusText;
    let updatedSelection;

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

    this.admissionService
      .editAdmission(this.admissionId() as string, {
        ...this.form()?.getRawValue(),
        program_ids: updatedSelection,
      })
      .pipe(
        tap({
          next: () => {
            this.selectedPrograms.set(updatedSelection);
            this.alert.show({
              text: actionStatusText,
              variant: this.selectedPrograms().length > this.selectedProgramsCount() ? 'success' : 'warning',
            });
            this.selectedProgramsCount.set(this.selectedPrograms().length);
            this.form()?.get('program_ids')?.patchValue(this.selectedPrograms());
            this.form()?.get('program_ids')?.updateValueAndValidity();
          },
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();
  }

  onNextClick() {
    this.form()?.markAllAsTouched();
    if (this.ssmStepForm()?.get('e_name')?.value && this.selectedPrograms().length < 2) {
      this.alert.show({
        text: 'programs.warningMinTwoProgramShouldBeSelected',
        variant: 'warning',
      });
    } else if (!this.ssmStepForm()?.get('e_name')?.value && this.selectedPrograms().length < 1) {
      this.alert.show({
        text: 'programs.warningMinOneProgramShouldBeSelected',
        variant: 'warning',
      });
    } else if (this.form()?.valid) {
      this.nextClick.emit();
    }
  }

  handlePageChange(event: PageChangeEvent) {
    const page = event.skip / event.take + 1;
    this.skip.set(Number(event.skip));

    const updatedFilters = {
      ...this.filters(),
      page: page,
    };
    this.filters.set(updatedFilters);

    this.updateRouteParams(updatedFilters, event.skip);
  }

  onFiltersChange(filterValue: ProgramSelectionFilter) {
    this.filters.set(filterValue ?? {});
    this.skip.set(0);

    this.updateRouteParams(filterValue, 0);
  }

  private updateRouteParams(filters: ProgramSelectionFilter, skip: number) {
    this.routeParamsService.update({
      filters,
      skip,
    });
  }
}
