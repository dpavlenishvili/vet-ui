import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  effect,
  inject,
  input,
  OnInit,
  output,
  ResourceRef,
} from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { InputsModule, RadioButtonModule } from '@progress/kendo-angular-inputs';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import { LabelModule } from '@progress/kendo-angular-label';
import { SVGIconModule } from '@progress/kendo-angular-icons';
import * as kendoIcons from '@progress/kendo-svg-icons';
import { TranslocoPipe } from '@jsverse/transloco';
import { useAlert, vetIcons } from '@vet/shared';
import { AdmissionPrograms, AdmissionService, LongTerm } from '@vet/backend';
import { AdmissionSelectedProgramsComponent } from '../../admission-selected-programs/admission-selected-programs.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { tap } from 'rxjs';
import { admissionProgramsResource } from '../admission-programs-resource';
import { ProgramSsmStep } from '../program-selection-step/program-selection-step.component';

export type ProgramSelectedProgramsStepFormGroup = FormGroup;
export type ProgramsSelectionStepFormGroup = FormGroup;

@Component({
  selector: 'vet-program-selected-programs-step',
  imports: [
    ReactiveFormsModule,
    InputsModule,
    RadioButtonModule,
    ButtonModule,
    LabelModule,
    SVGIconModule,
    TranslocoPipe,
    AdmissionSelectedProgramsComponent,
  ],
  templateUrl: './program-selected-programs-step.component.html',
  styleUrl: './program-selected-programs-step.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProgramSelectedProgramsStepComponent implements OnInit {
  nextClick = output();
  previousClick = output();

  readonly admissionId = input.required<string | null>();
  form = input<ProgramSelectedProgramsStepFormGroup>();
  ssmStepForm = input<ProgramSsmStep>();
  selectionProgramsForm = input<ProgramsSelectionStepFormGroup>();
  isViewMode = input<boolean>(false);

  kendoIcons = kendoIcons;
  vetIcons = vetIcons;

  protected readonly selectedPrograms: ResourceRef<AdmissionPrograms[] | undefined> = admissionProgramsResource(
    this.admissionId,
  );

  private readonly admissionService = inject(AdmissionService);
  private readonly alert = useAlert();
  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    effect(() => {
      this.selectedPrograms.reload();
    });
  }

  ngOnInit(): void {
    this.selectedPrograms.reload();
  }

  onPreviousClick() {
    this.previousClick.emit();
  }

  onNextClick() {
    if (this.isViewMode()) {
      this.nextClick.emit();
      return;
    }

    this.form()?.markAllAsTouched();

    const selectedPrograms = this.selectedPrograms.value();
    const selectedCount = selectedPrograms?.length || 0;

    if (this.ssmStepForm()?.get('e_name')?.value && selectedCount < 2) {
      this.alert.show({
        text: 'programs.warningMinTwoProgramShouldBeSelected',
        variant: 'warning',
      });
    } else if (!this.ssmStepForm()?.get('e_name')?.value && selectedCount < 1) {
      this.alert.show({
        text: 'programs.warningMinOneProgramShouldBeSelected',
        variant: 'warning',
      });
    } else if (this.form()?.valid) {
      this.nextClick.emit();
    }
  }

  onDeleteClick(item: LongTerm) {
    if (!item.program_id || this.isViewMode()) {
      return;
    }
    const currentSelected = this.selectedPrograms.value();
    const updatedSelection = currentSelected
      ?.filter((p) => p.program?.program_id !== item.program_id)
      .map((p) => p.program?.program_id);
    this.form()?.get('program_ids')?.patchValue(updatedSelection);
    this.form()?.get('program_ids')?.updateValueAndValidity();
    this.selectionProgramsForm()?.get('program_ids')?.patchValue(updatedSelection);
    this.selectionProgramsForm()?.updateValueAndValidity();

    this.admissionService
      .editAdmission(this.admissionId() as string, this.form()?.getRawValue())
      .pipe(
        tap({
          next: () => {
            this.selectedPrograms.reload();
          },
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();
  }
}
