import { ChangeDetectionStrategy, Component, computed, inject, input, output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TranslocoPipe } from '@jsverse/transloco';
import { ButtonComponent } from '@progress/kendo-angular-buttons';
import { NonFormalService } from '@vet/backend';
import { rxResource } from '@angular/core/rxjs-interop';
import { KENDO_GRID } from '@progress/kendo-angular-grid';
import { vetIcons } from '@vet/shared';
import { of } from 'rxjs';
import { NonFormalProgramPageComponent } from '../../non-formal-program-page/non-formal-program-page.component';
import { useNonFormalProgramDialog } from '../../non-formal-programs.signals';

@Component({
  selector: 'vet-non-formal-selected-fields-step',
  imports: [ReactiveFormsModule, TranslocoPipe, ButtonComponent, KENDO_GRID],
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
  protected readonly vetIcons = vetIcons;
  protected readonly programDialog = useNonFormalProgramDialog(NonFormalProgramPageComponent);

  protected readonly selectedProgramId = computed(() => this.formGroup().value.selected_program_id);

  protected readonly selectedProgramResource = rxResource({
    request: () => ({ programId: this.selectedProgramId() }),
    loader: ({ request }) => {
      const { programId } = request;
      if (!programId) {
        return of(null as any);
      }
      return this.nonFormalService.nonFormalsRegistration({
        'filters[id]': programId,
      });
    },
  });

  protected readonly selectedProgram = computed(() => {
    const programId = this.selectedProgramId();
    if (!programId) {
      return null;
    }

    const response = this.selectedProgramResource.value();
    if (!response?.data || response.data.length === 0) {
      return null;
    }
    return response.data[0];
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
      return;
    }
    this.next.emit();
  }
}
