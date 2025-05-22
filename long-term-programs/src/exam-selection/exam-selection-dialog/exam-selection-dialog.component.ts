import { SchedulesService, Selection } from '@vet/backend';
import { ChangeDetectionStrategy, Component, computed, DestroyRef, inject, input, output } from '@angular/core';
import { KENDO_DIALOG } from '@progress/kendo-angular-dialog';
import { TranslocoPipe } from '@jsverse/transloco';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { KENDO_DATETIMEPICKER } from '@progress/kendo-angular-dateinputs';
import { KENDO_TEXTBOX } from '@progress/kendo-angular-inputs';
import { KENDO_LABEL } from '@progress/kendo-angular-label';
import { KENDO_BUTTON } from '@progress/kendo-angular-buttons';
import { iif, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'vet-exam-selection-dialog',
  imports: [
    KENDO_DIALOG,
    KENDO_DATETIMEPICKER,
    KENDO_LABEL,
    KENDO_TEXTBOX,
    TranslocoPipe,
    ReactiveFormsModule,
    KENDO_BUTTON,
  ],
  templateUrl: './exam-selection-dialog.component.html',
  styleUrl: './exam-selection-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExamSelectionDialogComponent {
  readonly scheduleId = input.required<string>();
  readonly selectionMethods = input<Selection[]>([]);
  readonly mode = input.required<'results' | 'dates'>();
  readonly dialogClose = output();
  readonly reloadTableData = output();

  protected readonly formGroups = computed(() => {
    if (this.mode() === 'dates') {
      return this.selectionMethods().map((selection) => this.createDatesForm(selection.method?.id));
    }
    return this.selectionMethods().map((selection) => this.createResultsForm(selection.method?.id));
  });

  protected get value() {
    return this.formGroups().map((formGroup) => formGroup.value);
  }

  protected readonly schedulesService = inject(SchedulesService);
  protected readonly destroyRef = inject(DestroyRef);

  protected createDatesForm(selection_method_id?: number): FormGroup {
    return new FormGroup({
      selection_method_id: new FormControl(selection_method_id),
      start_at: new FormControl(),
      address: new FormControl(),
    });
  }

  protected createResultsForm(selection_method_id?: number): FormGroup {
    return new FormGroup({
      selection_method_id: new FormControl(selection_method_id),
      score: new FormControl(),
    });
  }

  protected handleClose() {
    this.dialogClose.emit();
  }

  protected handleSave() {
    iif(
      () => this.mode() === 'dates',
      this.schedulesService.schedulesDates(this.scheduleId(), this.value),
      this.schedulesService.schedulesScores(this.scheduleId(), this.value),
    )
      .pipe(
        tap({
          next: () => {
            this.reloadTableData.emit();
            this.dialogClose.emit();
          },
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();
  }
}
