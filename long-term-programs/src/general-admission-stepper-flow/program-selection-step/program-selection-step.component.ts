import { ChangeDetectionStrategy, Component, inject, input, OnInit, output, signal } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { InputsModule, RadioButtonModule } from '@progress/kendo-angular-inputs';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import { LabelModule } from '@progress/kendo-angular-label';
import { SVGIconModule } from '@progress/kendo-angular-icons';
import { TranslocoPipe } from '@jsverse/transloco';
import { AdmissionService, LongTerm } from '@vet/backend';
import { kendoIcons, RouteParamsService } from '@vet/shared';
import { GridModule, KENDO_GRID, PageChangeEvent } from '@progress/kendo-angular-grid';
import { ProgramComponent } from 'programs/src/program/program.component';
import { DialogModule } from '@progress/kendo-angular-dialog';
import { ProgramSelectionFiltersComponent } from './program-selection-filters/program-selection-filters.component';
import { AsyncPipe } from '@angular/common';
import { Observable } from 'rxjs';

export type ProgramSelectionStepFormGroup = FormGroup;

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
    AsyncPipe,
  ],
  templateUrl: './program-selection-step.component.html',
  styleUrl: './program-selection-step.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class ProgramSelectionStepComponent implements OnInit {
  nextClick = output();
  previousClick = output();
  isProgramDialogOpen = false;

  admissionId = input<string | null>();
  eligiblePrograms$: Observable<any> | undefined;
  admissionService = inject(AdmissionService);
  routeParamsService = inject(RouteParamsService);

  form = input<ProgramSelectionStepFormGroup>();
  kendoIcons = kendoIcons;
  selectedPrograms = signal<any>([]);

  onPreviewProgramClick() {
    this.isProgramDialogOpen = true;
  }

  closeDialog() {
    this.isProgramDialogOpen = false;
  }

  onPreviousClick() {
    this.previousClick.emit();
  }

  onProgramAddClick(item: LongTerm) {
    if (item.program_id) {
      this.selectedPrograms().push(item?.program_id);
      this.form()?.get('program_ids')?.patchValue(this.selectedPrograms())
      this.form()?.get('program_ids')?.updateValueAndValidity();
    }
  }

  onNextClick() {
    this.form()?.markAllAsTouched();
    if (this.form()?.valid) {
      this.nextClick.emit();
    }
  }

  handlePageChange(event: PageChangeEvent) {
    this.routeParamsService.update({
      page: event.skip / event.take + 1,
    });
  }

  ngOnInit(): void {
    console.log('ngOnInit', this.admissionId());
    this.eligiblePrograms$ = this.admissionService.eligibleProgramsList(this.admissionId());
  }
}
