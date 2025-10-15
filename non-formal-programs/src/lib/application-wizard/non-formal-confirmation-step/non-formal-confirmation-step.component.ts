import { ChangeDetectionStrategy, Component, computed, inject, input, output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TranslocoPipe } from '@jsverse/transloco';
import { ButtonComponent } from '@progress/kendo-angular-buttons';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { LabelModule } from '@progress/kendo-angular-label';
import { AuthenticationService } from '@vet/auth';
import { GeneralsService, NonFormalService } from '@vet/backend';
import { rxResource } from '@angular/core/rxjs-interop';
import { FileUploadComponent, vetIcons } from '@vet/shared';
import { WA_WINDOW } from '@ng-web-apis/common';
import { NonFormalApplicationData } from '../application-wizard.component';
import { of } from 'rxjs';

@Component({
  selector: 'vet-non-formal-confirmation-step',
  imports: [ReactiveFormsModule, TranslocoPipe, ButtonComponent, InputsModule, LabelModule, FileUploadComponent],
  templateUrl: './non-formal-confirmation-step.component.html',
  styleUrl: './non-formal-confirmation-step.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class NonFormalConfirmationStepComponent {
  formGroup = input.required<FormGroup>();
  applicationData = input<NonFormalApplicationData | null>(null);
  isViewMode = input<boolean>(false);
  back = output<void>();
  complete = output<void>();

  protected readonly vetIcons = vetIcons;
  protected readonly user = inject(AuthenticationService).user;
  private readonly window = inject(WA_WINDOW);
  private readonly generalsService = inject(GeneralsService);
  private readonly nonFormalService = inject(NonFormalService);

  protected readonly educations$ = rxResource({
    loader: () => this.generalsService.getAllConfigs({ key: 'education_levels' }),
  });

  protected readonly selectedEducation = computed(() => {
    const educations = this.educations$.value();
    const form = this.formGroup();

    if (!educations || !form) {
      return '';
    }

    const selectedEducationId = form.get('questionnaire.education_level_id')?.value;
    const selectedEducation = educations?.education_levels?.find((edu) => edu.id === selectedEducationId);

    return selectedEducation?.value || '';
  });

  protected readonly programId = computed(() => this.applicationData()?.non_formal_id);

  protected readonly selectedProgramResource = rxResource({
    request: () => ({ programId: this.programId() }),
    loader: ({ request }) => {
      const { programId } = request;
      if (!programId || typeof programId !== 'number') {
        return of(null);
      }
      return this.nonFormalService.nonFormal(programId);
    },
  });

  protected readonly selectedProgramName = computed(() => {
    const response = this.selectedProgramResource.value();
    return response?.data?.isced || '';
  });

  protected onBackClick(): void {
    this.back.emit();
  }

  protected onCompleteClick(): void {
    this.complete.emit();
  }

  protected onPrintClick(): void {
    this.window?.print?.();
  }

  protected getQuestionnaireValue(field: string): string | boolean {
    const value = this.formGroup()?.get(`questionnaire.${field}`)?.value;
    return value ?? '-';
  }

  protected getDescriptionLength(): number {
    const value = this.getQuestionnaireValue('action_description');
    return typeof value === 'string' ? value.length : 0;
  }

  protected getDocuments(field: string): Array<{ id?: number; file_name?: string; url?: string }> {
    const documents = this.formGroup()?.get(`documents.${field}`)?.value;
    const mediaDocuments = this.applicationData()?.media?.[field as keyof NonFormalApplicationData['media']];

    if (mediaDocuments && Array.isArray(mediaDocuments)) {
      return mediaDocuments;
    }

    return documents || [];
  }
}
