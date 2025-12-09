import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TranslocoPipe } from '@jsverse/transloco';
import { NonFormalService } from '@vet/backend';
import { rxResource, takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { KENDO_GRID } from '@progress/kendo-angular-grid';
import { ButtonComponent as VetButtonComponent, IconButtonComponent, useAlert, useConfirm } from '@vet/shared';
import { of } from 'rxjs';
import { NonFormalProgramPageComponent } from '../../non-formal-program-page/non-formal-program-page.component';
import { useNonFormalProgramDialog } from '../../non-formal-programs.signals';
import { TooltipDirective } from '@progress/kendo-angular-tooltip';
import { startWith } from 'rxjs/operators';
import { NonFormalApplicationData } from '../application-wizard.component';

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
  applicationData = input<NonFormalApplicationData | null>(null);
  back = output<void>();
  next = output<void>();
  programToggle = output<void>();

  private readonly nonFormalService = inject(NonFormalService);
  private readonly alert = useAlert();
  private readonly confirm = useConfirm();
  private readonly destroyRef = inject(DestroyRef);
  protected readonly programDialog = useNonFormalProgramDialog(NonFormalProgramPageComponent);

  protected readonly selectedProgramId = signal<number | null>(null);

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

  protected readonly isFieldChangeDisabled = computed(() => {
    const data = this.applicationData();
    if (!data || !data.id) return false;

    return !data.can_change_program;
  });

  constructor() {
    effect(() => {
      const form = this.formGroup();

      const initialValue = form.get('selected_program_id')?.value;
      this.selectedProgramId.set(initialValue);

      form
        .get('selected_program_id')
        ?.valueChanges.pipe(startWith(initialValue), takeUntilDestroyed(this.destroyRef))
        .subscribe((value) => {
          this.selectedProgramId.set(value);
        });
    });
  }

  protected onRemoveClick(): void {
    this.confirm.show({
      content: 'non_formal.confirm_program_removal',
      onConfirm: () => {
        this.formGroup().get('field_selection.selected_program_id')?.setValue(null);
        this.back.emit();
      },
    });
  }

  protected removeProgram(): void {
    this.programToggle.emit();
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

      this.back.emit();
      return;
    }
    this.next.emit();
  }
}
