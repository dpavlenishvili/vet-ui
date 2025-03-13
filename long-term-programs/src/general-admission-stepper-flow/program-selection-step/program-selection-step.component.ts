import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  computed,
  effect,
  inject,
  input,
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
import { filterNullValues, kendoIcons, RouteParamsService, vetIcons } from '@vet/shared';
import { GridModule, KENDO_GRID, PageChangeEvent } from '@progress/kendo-angular-grid';
import { ProgramComponent } from 'programs/src/program/program.component';
import { DialogModule } from '@progress/kendo-angular-dialog';
import { ProgramSelectionFiltersComponent } from './program-selection-filters/program-selection-filters.component';
import { rxResource, takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { tap } from 'rxjs';
import { EducationLevel } from 'long-term-programs/src/enums/education-level.enum';

export type ProgramSelectionStepFormGroup = FormGroup;
export type ProgramSsmStep = FormGroup;
export type SelectedProgramsStepForm = FormGroup;
export type GeneralInformationStepFromGroup = FormGroup;
export type ProgramSelectionFilter = {
  filters: {
    organisation: number | null;
    program_name: string | null;
    program: string | null;
    duration: string | null;
    integrated: string | null;
    financing_type: string | null;
    region: number | null;
    district: number | null;
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
  standalone: true,
})
export class ProgramSelectionStepComponent {
  nextClick = output();
  previousClick = output();
  isProgramDialogOpen = signal(false);
  isConfirmationDialogOpen = signal(false);
  isInfoDialogOpen = signal(false);
  infoDialogText = '';
  vetIcons = vetIcons;

  singleProgramId = signal(0);

  admissionId = input<string | null>();
  eligiblePrograms$ = rxResource({
    request: () => ({ admissionId: this.admissionId(), filters: this.filters() }),
    loader: ({ request: { admissionId, filters } }) =>
      this.admissionService.eligibleProgramsList(
        admissionId,
        // @ts-expect-error Not yet implemented by BE, should be removed once this works
        filters,
      ),
  });
  admissionService = inject(AdmissionService);
  routeParamsService = inject(RouteParamsService);
  destroyRef = inject(DestroyRef);

  form = input<ProgramSelectionStepFormGroup>();
  ssmStepForm = input<ProgramSsmStep>();
  generalInformationFrom = input<GeneralInformationStepFromGroup>();
  selectedProgramsForm = input<SelectedProgramsStepForm>();
  kendoIcons = kendoIcons;
  selectedPrograms = signal<number[]>([]);
  selectedProgramsCount = computed(() => this.form()?.get('program_ids')?.value?.length ?? 0);

  previewProgram: LongTerm | null = null;
  protected readonly filters = signal<ProgramSelectionFilter['filters'] | undefined>(undefined);

  onPreviewProgramClick(item: LongTerm) {
    this.singleProgramId.set(Number(item.id));
    this.isProgramDialogOpen.set(true);
    this.previewProgram = item;
  }

  isAddButtonDisabled(item: LongTerm): boolean {
    const isMaxProgramCount = this.selectedProgramsCount() >= 3;
    const educationLevel = this.generalInformationFrom()?.get('education_level')?.value;
    const isBasicEducation = !!item.is_integrated && educationLevel === EducationLevel.Basic;
    const isCollegeEducation = !!item.is_integrated && educationLevel === EducationLevel.ProfessionalBasic;

    return isMaxProgramCount || isBasicEducation || isCollegeEducation;
  }

  onCloseClick() {
    this.isProgramDialogOpen.set(false);
    this.isConfirmationDialogOpen.set(false);
    this.isInfoDialogOpen.set(false);
  }

  onPreviousClick() {
    this.previousClick.emit();
  }

  onProgramAddClick(item: LongTerm) {
    this.selectedPrograms.set(this.form()?.get('program_ids')?.value);
    if (item.program_id) {
      if (!this.selectedPrograms().includes(item.program_id)) {
        this.selectedPrograms().push(item.program_id);
        this.form()?.get('program_ids')?.patchValue(this.selectedPrograms());
        this.form()?.get('program_ids')?.updateValueAndValidity();
        this.isConfirmationDialogOpen.set(true);
        this.admissionService
          .editAdmission(this.admissionId() as string, this.form()?.value)
          .pipe(
            takeUntilDestroyed(this.destroyRef),
            tap(() => this.isConfirmationDialogOpen.set(true)),
          )
          .subscribe();
      } else {
        this.isInfoDialogOpen.set(true);
        this.infoDialogText = 'programs.program_already_chosen';
      }
    }
  }

  onNextClick() {
    this.form()?.markAllAsTouched();

    if (this.ssmStepForm()?.get('e_name')?.value && this.selectedPrograms().length < 2) {
      this.isInfoDialogOpen.set(true);
      this.infoDialogText = 'must_choose_min_two';
    } else {
      if (this.form()?.valid) {
        this.nextClick.emit();
      }
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
