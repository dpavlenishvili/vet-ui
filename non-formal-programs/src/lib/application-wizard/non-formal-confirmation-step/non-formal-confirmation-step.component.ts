import { ChangeDetectionStrategy, Component, computed, inject, input, output } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslocoPipe } from '@jsverse/transloco';
import { InputsModule, SwitchModule, TextAreaModule } from '@progress/kendo-angular-inputs';
import { LabelModule } from '@progress/kendo-angular-label';
import { AuthenticationService } from '@vet/auth';
import { AdmissionService, NonFormalService } from '@vet/backend';
import { rxResource } from '@angular/core/rxjs-interop';
import { vetIcons } from '@vet/shared/icons';
import {
  ButtonComponent as VetButtonComponent,
  FileUploadComponent,
  InputComponent,
  VetCheckboxComponent,
  VetSwitchComponent,
} from '@vet/shared/ui-components';
import { WA_WINDOW } from '@ng-web-apis/common';
import { NonFormalApplicationData } from '../application-wizard.component';
import { map, of } from 'rxjs';

interface CheckboxOption {
  id: number;
  translationKey: string;
}

@Component({
  selector: 'vet-non-formal-confirmation-step',
  imports: [
    ReactiveFormsModule,
    TranslocoPipe,
    InputsModule,
    TextAreaModule,
    SwitchModule,
    LabelModule,
    FileUploadComponent,
    VetCheckboxComponent,
    InputComponent,
    VetButtonComponent,
    VetSwitchComponent,
    FormsModule,
  ],
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
  private readonly admissionService = inject(AdmissionService);
  private readonly nonFormalService = inject(NonFormalService);

  protected readonly recognitionPurposeOptions: CheckboxOption[] = [
    { id: 1, translationKey: 'non_formal.recognition_purpose_personal_development' },
    { id: 2, translationKey: 'non_formal.recognition_purpose_continuing_education' },
    { id: 3, translationKey: 'non_formal.recognition_purpose_granting_qualification' },
    { id: 4, translationKey: 'non_formal.recognition_purpose_employment' },
    { id: 5, translationKey: 'non_formal.recognition_purpose_career_growth' },
    { id: 6, translationKey: 'non_formal.recognition_purpose_self_employment' },
  ];

  protected readonly whoTaughtYouOptions: CheckboxOption[] = [
    { id: 1, translationKey: 'non_formal.who_taught_family_member' },
    { id: 2, translationKey: 'non_formal.who_taught_friend' },
    { id: 3, translationKey: 'non_formal.who_taught_neighbor' },
    { id: 4, translationKey: 'non_formal.who_taught_relative' },
    { id: 1000, translationKey: 'non_formal.who_taught_other' },
  ];

  protected readonly sourceOfInformationOptions: CheckboxOption[] = [
    { id: 1, translationKey: 'non_formal.source_neighbor' },
    { id: 2, translationKey: 'non_formal.source_relative' },
    { id: 3, translationKey: 'non_formal.source_internet' },
    { id: 4, translationKey: 'non_formal.source_family_member' },
    { id: 5, translationKey: 'non_formal.source_advertisement' },
    { id: 1000, translationKey: 'non_formal.source_other' },
  ];

  protected readonly educations$ = rxResource({
    loader: () =>
      this.admissionService.educationStatus().pipe(
        map((educationStatuses) => {
          return educationStatuses ?? [];
        }),
      ),
  });

  protected readonly selectedEducation = computed(() => {
    const educations = this.educations$.value();
    const form = this.formGroup();

    if (!educations || !form) {
      return '';
    }

    const selectedEducationId = form.get('questionnaire')?.get('education_level_id')?.value;
    const selectedEducation = educations?.find((edu) => Number(edu.levelId) === selectedEducationId);

    return selectedEducation?.level || '';
  });

  protected details = computed(() => {
    const user = this.user();

    const educationStatus = this.selectedEducation();

    if (!user) {
      return null;
    }

    return [
      { label: 'shorts.pid', value: user.pid },
      { label: 'shorts.name_surname', value: user.name },
      { label: 'shorts.mobile', value: user.phone },
      { label: 'shorts.education', value: educationStatus },
    ];
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

  protected readonly selectedProgramData = computed(() => {
    return this.selectedProgramResource.value()?.data;
  });

  protected readonly educationOptions = computed(() => {
    const educations = this.educations$.value();
    if (!educations) {
      return [];
    }
    return educations.map((edu) => ({
      label: edu.level || '',
      value: edu.levelId ? Number(edu.levelId) : null,
    }));
  });

  get selectedRecognitionPurposes() {
    return this.recognitionPurposeOptions.filter((o) => this.isCheckboxChecked(o.id, 'recognition_purpose'));
  }

  get selectedWhoTaughtYouOptions() {
    return this.whoTaughtYouOptions.filter((o) => this.isCheckboxChecked(o.id, 'who_taught_you'));
  }

  get selectedSourceOfInformationOptions() {
    return this.sourceOfInformationOptions.filter((o) => this.isCheckboxChecked(o.id, 'source_of_information'));
  }

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

  protected getQuestionnaireSelectedLabels(field: string): string[] {
    const value = this.formGroup()?.get(`questionnaire.${field}`)?.value;
    if (!value) {
      return [];
    }

    let parsedIds: number[] = [];
    try {
      parsedIds = Array.isArray(value) ? value : JSON.parse(value);
    } catch {
      return [];
    }

    if (!Array.isArray(parsedIds)) {
      return [];
    }

    let options: CheckboxOption[] = [];
    switch (field) {
      case 'recognition_purpose':
        options = this.recognitionPurposeOptions;
        break;
      case 'who_taught_you':
        options = this.whoTaughtYouOptions;
        break;
      case 'source_of_information':
        options = this.sourceOfInformationOptions;
        break;
    }

    return parsedIds
      .map((id) => options.find((opt) => opt.id === id)?.translationKey)
      .filter((key): key is string => !!key);
  }

  protected isCheckboxChecked(
    optionId: number,
    field: 'recognition_purpose' | 'who_taught_you' | 'source_of_information',
  ): boolean {
    const value = this.formGroup()?.get(`questionnaire.${field}`)?.value;
    if (!value) {
      return false;
    }

    let parsedIds: number[] = [];
    try {
      parsedIds = Array.isArray(value) ? value : JSON.parse(value);
    } catch {
      return false;
    }

    return Array.isArray(parsedIds) && parsedIds.includes(optionId);
  }

  protected isOtherSelected(field: 'who_taught_you' | 'source_of_information'): boolean {
    const otherId = 1000;
    return this.isCheckboxChecked(otherId, field);
  }
}
