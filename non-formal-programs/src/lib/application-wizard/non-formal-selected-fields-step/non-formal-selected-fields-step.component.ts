import { ChangeDetectionStrategy, Component, computed, inject, input, output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TranslocoPipe } from '@jsverse/transloco';
import { NonFormalService } from '@vet/backend';
import { rxResource } from '@angular/core/rxjs-interop';
import { KENDO_GRID } from '@progress/kendo-angular-grid';
import { ButtonComponent as VetButtonComponent, IconButtonComponent, useAlert } from '@vet/shared';
import { of } from 'rxjs';
import { NonFormalProgramPageComponent } from '../../non-formal-program-page/non-formal-program-page.component';
import { useNonFormalProgramDialog } from '../../non-formal-programs.signals';
import { TooltipDirective } from '@progress/kendo-angular-tooltip';

@Component({
  selector: 'vet-non-formal-selected-fields-step',
  imports: [ReactiveFormsModule, TranslocoPipe, VetButtonComponent, KENDO_GRID, TooltipDirective, IconButtonComponent],
  templateUrl: './non-formal-selected-fields-step.component.html',
  styleUrl: './non-formal-selected-fields-step.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class NonFormalSelectedFieldsStepComponent {
  formGroup = input.required<FormGroup>();
  isViewMode = input<boolean>(false);
  back = output<void>();
  next = output<void>();

  private readonly nonFormalService = inject(NonFormalService);
  private readonly alert = useAlert();
  protected readonly programDialog = useNonFormalProgramDialog(NonFormalProgramPageComponent);

  protected readonly selectedProgramId = computed(() => this.formGroup().getRawValue().selected_program_id);
  protected readonly selectedProgramResource = rxResource({
    request: () => ({ programId: this.selectedProgramId() }),
    loader: ({ request }) => {
      const { programId } = request;
      if (!programId) {
        return of(null as any);
      }
      return this.nonFormalService.nonFormal(programId);
    },
  });

  protected readonly selectedProgram = computed(() => {
    const response = this.selectedProgramResource.value();
    return response?.data || null;
  });

  protected onRemoveClick(): void {
    this.formGroup().patchValue({ selected_program_id: null });
  }

  protected onPreviewProgramClick(): void {
    const programId = this.selectedProgramId();
    if (programId) {
      this.programDialog.show({ programId });
    }
  }

  protected onBackClick(): void {
    this.back.emit();
  }

  protected onNextClick(): void {
    if (!this.selectedProgramId()) {
      this.alert.show({
        text: 'non_formal.error_select_at_least_one_field',
        variant: 'warning',
      });
      // Auto-navigate back to field selection step
      this.back.emit();
      return;
    }
    this.next.emit();
  }
}
