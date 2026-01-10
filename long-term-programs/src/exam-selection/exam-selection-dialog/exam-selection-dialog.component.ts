import { SchedulesService, Selection } from '@vet/backend';
import { ChangeDetectionStrategy, Component, computed, DestroyRef, inject, input, output } from '@angular/core';
import { KENDO_DIALOG } from '@progress/kendo-angular-dialog';
import { TranslocoPipe } from '@jsverse/transloco';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { KENDO_DATETIMEPICKER } from '@progress/kendo-angular-dateinputs';
import { KENDO_LABEL } from '@progress/kendo-angular-label';
import { iif, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ScheduleProvider } from 'long-term-programs/src/enums/schedule-provider.enum';
import { SelectionMethod } from 'long-term-programs/src/enums/selection-method.enum';
import { ButtonComponent as VetButtonComponent, InputComponent } from '@vet/shared';

@Component({
  selector: 'vet-exam-selection-dialog',
  imports: [
    KENDO_DIALOG,
    KENDO_DATETIMEPICKER,
    KENDO_LABEL,
    TranslocoPipe,
    ReactiveFormsModule,
    VetButtonComponent,
    InputComponent,
  ],
  templateUrl: './exam-selection-dialog.component.html',
  styleUrl: './exam-selection-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExamSelectionDialogComponent {
  readonly scheduleId = input.required<string>();
  readonly canSelectNextLevel = input.required<boolean | undefined>();
  readonly passLevel = input.required<boolean | undefined>();
  readonly selectionMethods = input<Selection[]>([]);
  readonly mode = input.required<'results' | 'dates'>();
  readonly dialogClose = output();
  readonly reloadTableData = output();

  protected readonly formGroups = computed(() => {
    if (this.mode() === 'dates') {
      return this.selectionMethods().map((selection) => this.createDatesForm(selection));
    }
    return this.selectionMethods().map((selection) => this.createResultsForm(selection));
  });

  protected get value() {
    return this.formGroups().map((formGroup) => formGroup.value);
  }

  protected readonly schedulesService = inject(SchedulesService);
  protected readonly destroyRef = inject(DestroyRef);

  protected createDatesForm(selection?: Selection): FormGroup {
    const isNaec = selection?.method?.provider === ScheduleProvider.Naec;
    return new FormGroup({
      selection_method_id: new FormControl(selection?.method?.id),
      start_at: new FormControl({ value: null, disabled: isNaec }),
      address: new FormControl({ value: null, disabled: isNaec }),
    });
  }

  protected createResultsForm(selection: Selection): FormGroup {
    return new FormGroup({
      selection_method_id: new FormControl(selection.method?.id),
      score: new FormControl({ value: null, disabled: this.isDatesDisabled(selection) }),
    });
  }

  isDatesDisabled(selection: Selection) {
    if (this.canSelectNextLevel() && !this.passLevel() && selection?.method?.category !== SelectionMethod.primary) {
      return true;
    }

    if (selection?.method?.reviewer !== ScheduleProvider.Collage) {
      return true;
    }

    return false;
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
