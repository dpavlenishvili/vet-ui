import { ChangeDetectionStrategy, Component, DestroyRef, inject, input, OnInit, output, signal } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { InputsModule, RadioButtonModule } from '@progress/kendo-angular-inputs';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import { LabelModule } from '@progress/kendo-angular-label';
import { SVGIconModule } from '@progress/kendo-angular-icons';
import { TranslocoPipe } from '@jsverse/transloco';
import { AdmissionService, LongTerm } from '@vet/backend';
import { filterNullValues, kendoIcons, RouteParamsService, ToastService, vetIcons } from '@vet/shared';
import { GridModule, KENDO_GRID, PageChangeEvent } from '@progress/kendo-angular-grid';
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
  filters: {
    filter?: string | null;
    organisation?: string | null;
    program_name?: string | null;
    program?: string | null;
    program_kind?: string | null;
    duration?: string | null;
    integrated?: boolean | null;
    financing_type?: string | null;
    region?: string | null;
    district?: string | null;
  };
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
  isInfoDialogOpen = signal(false);
  singleProgramId = signal(0);
  selectedPrograms = signal<number[]>([]);
  selectedProgramsCount = signal<number>(0);
  infoDialogText = signal<string>('shared.maxItemAddError');
  vetIcons = vetIcons;
  kendoIcons = kendoIcons;
  previewProgram: LongTerm | null = null;

  private toastService = inject(ToastService);
  private admissionService = inject(AdmissionService);
  private routeParamsService = inject(RouteParamsService);
  private destroyRef = inject(DestroyRef);

  protected filters = signal<ProgramSelectionFilter['filters'] | undefined>(undefined);

  eligiblePrograms$ = rxResource({
    request: () => ({ admissionId: this.admissionId(), filters: this.filters() }),
    loader: ({ request: { admissionId, filters } }) => this.admissionService.eligibleProgramsList(admissionId, filters),
  });

  ngOnInit() {
    const programs = (this.form()?.get('program_ids')?.value as number[]) || [];
    this.selectedPrograms.set(programs);
    this.selectedProgramsCount.set(programs.length);
  }

  onPreviewProgramClick(item: LongTerm) {
    this.singleProgramId.set(Number(item.id));
    this.isProgramDialogOpen.set(true);
    this.previewProgram = item;
  }

  isAddButtonDisabled(item: LongTerm): boolean {
    const maxReached = this.selectedProgramsCount() >= 3;
    const educationLevel = this.generalInformationFrom()?.get('education_level')?.value;
    const isIntegrated = !!item.is_integrated;
    const isBasicEducation = isIntegrated && educationLevel === EducationLevel.Basic;
    const isCollegeEducation = isIntegrated && educationLevel === EducationLevel.ProfessionalBasic;
    return maxReached || isBasicEducation || isCollegeEducation;
  }

  onCloseClick() {
    this.isProgramDialogOpen.set(false);
    this.isInfoDialogOpen.set(false);
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
        this.toastService.warning('programs.cannotAddProgram');
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
            this.selectedProgramsCount.set(this.selectedPrograms().length);
            this.form()?.get('program_ids')?.patchValue(this.selectedPrograms());
            this.form()?.get('program_ids')?.updateValueAndValidity();
            this.toastService.success(actionStatusText);
          },
          error: (error) => {
            this.toastService.error(error?.error?.error?.message ?? 'shared.error');
          },
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();
  }

  onNextClick() {
    this.form()?.markAllAsTouched();
    if (this.ssmStepForm()?.get('e_name')?.value && this.selectedPrograms().length < 2) {
      this.isInfoDialogOpen.set(true);
    } else if (this.form()?.valid) {
      this.nextClick.emit();
    }
  }

  handlePageChange(event: PageChangeEvent) {
    this.routeParamsService.update({
      page: event.skip / event.take + 1,
    });
  }

  onFiltersChange(filters: ProgramSelectionFilter) {
    this.routeParamsService.update(filters);
    this.filters.set(filterNullValues(filters.filters));
  }
}
