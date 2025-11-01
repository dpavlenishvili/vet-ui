import { ChangeDetectionStrategy, Component, computed, DestroyRef, inject, input, OnInit, output, signal } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslocoPipe } from '@jsverse/transloco';
import { ButtonComponent } from '@progress/kendo-angular-buttons';
import { ErrorComponent, SwitchModule, TextAreaModule, NumericTextBoxComponent } from '@progress/kendo-angular-inputs';
import { AdmissionService } from '@vet/backend';
import { InputComponent, SelectOption, SelectorComponent, VetCheckboxComponent } from '@vet/shared';
import { rxResource, takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { map, tap } from 'rxjs';

interface CheckboxOption {
  id: number;
  name: string;
  translationKey: string;
}

@Component({
  selector: 'vet-non-formal-questionnaire-step',
  imports: [
    ReactiveFormsModule,
    TranslocoPipe,
    ButtonComponent,
    SelectorComponent,
    InputComponent,
    TextAreaModule,
    VetCheckboxComponent,
    SwitchModule,
    FormsModule,
    ErrorComponent,
    NumericTextBoxComponent,
  ],
  templateUrl: './non-formal-questionnaire-step.component.html',
  styleUrl: './non-formal-questionnaire-step.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class NonFormalQuestionnaireStepComponent implements OnInit {
  formGroup = input.required<FormGroup>();
  isViewMode = input<boolean>(false);
  back = output<void>();
  next = output<void>();

  admissionService = inject(AdmissionService);
  private readonly destroyRef = inject(DestroyRef);

  recognitionPurposeOptions: CheckboxOption[] = [
    { id: 1, name: 'personal_development', translationKey: 'non_formal.recognition_purpose_personal_development' },
    { id: 2, name: 'continuing_education', translationKey: 'non_formal.recognition_purpose_continuing_education' },
    { id: 3, name: 'granting_qualification', translationKey: 'non_formal.recognition_purpose_granting_qualification' },
    { id: 4, name: 'employment', translationKey: 'non_formal.recognition_purpose_employment' },
    { id: 5, name: 'career_growth', translationKey: 'non_formal.recognition_purpose_career_growth' },
    { id: 6, name: 'self_employment', translationKey: 'non_formal.recognition_purpose_self_employment' },
  ];

  whoTaughtYouOptions: CheckboxOption[] = [
    { id: 1, name: 'family_member', translationKey: 'non_formal.who_taught_family_member' },
    { id: 2, name: 'friend', translationKey: 'non_formal.who_taught_friend' },
    { id: 3, name: 'neighbor', translationKey: 'non_formal.who_taught_neighbor' },
    { id: 4, name: 'relative', translationKey: 'non_formal.who_taught_relative' },
    { id: 1000, name: 'other', translationKey: 'non_formal.who_taught_other' },
  ];

  sourceOfInformationOptions: CheckboxOption[] = [
    { id: 1, name: 'neighbor', translationKey: 'non_formal.source_neighbor' },
    { id: 2, name: 'relative', translationKey: 'non_formal.source_relative' },
    { id: 3, name: 'internet', translationKey: 'non_formal.source_internet' },
    { id: 4, name: 'family_member', translationKey: 'non_formal.source_family_member' },
    { id: 5, name: 'advertisement', translationKey: 'non_formal.source_advertisement' },
    { id: 1000, name: 'other', translationKey: 'non_formal.source_other' },
  ];

  // Track selected checkbox IDs
  selectedRecognitionPurpose = signal<number[]>([]);
  selectedWhoTaughtYou = signal<number[]>([]);
  selectedSourceOfInformation = signal<number[]>([]);

  private readonly actionDescriptionValue = signal<string>('');
  characterCount = computed(() => this.actionDescriptionValue().length);

  educationOptions = computed<SelectOption<number>[]>(() => {
    const educations = this.educations$.value() || [];
    return educations.map((edu) => ({
      label: edu.level || '',
      value: edu.levelId ? Number(edu.levelId) : null,
    }));
  });

  educations$ = rxResource({
    loader: () =>
      this.admissionService.educationStatus().pipe(
        map((educationStatuses) => {
          return educationStatuses ?? [];
        }),
        tap((educations) => {
          // Auto-select if there's only one education option
          if (educations.length === 1) {
            const educationControl = this.formGroup()?.get('education_level_id');
            const currentValue = educationControl?.getRawValue();

            // Only set if there's no existing value
            if (!currentValue && educations[0].levelId) {
              educationControl?.patchValue(Number(educations[0].levelId));
            }
          }
        }),
      ),
  });

  ngOnInit(): void {
    // Initialize selected checkboxes from form values
    const recognitionPurpose = this.formGroup()?.get('recognition_purpose')?.value;
    if (recognitionPurpose) {
      try {
        const parsed = JSON.parse(recognitionPurpose);
        this.selectedRecognitionPurpose.set(Array.isArray(parsed) ? parsed : []);
      } catch {
        this.selectedRecognitionPurpose.set([]);
      }
    }

    const whoTaughtYou = this.formGroup()?.get('who_taught_you')?.value;
    if (whoTaughtYou) {
      try {
        const parsed = JSON.parse(whoTaughtYou);
        this.selectedWhoTaughtYou.set(Array.isArray(parsed) ? parsed : []);
      } catch {
        this.selectedWhoTaughtYou.set([]);
      }
    }

    const sourceOfInformation = this.formGroup()?.get('source_of_information')?.value;
    if (sourceOfInformation) {
      try {
        const parsed = JSON.parse(sourceOfInformation);
        this.selectedSourceOfInformation.set(Array.isArray(parsed) ? parsed : []);
      } catch {
        this.selectedSourceOfInformation.set([]);
      }
    }

    const actionDescriptionControl = this.formGroup()?.get('action_description');
    if (actionDescriptionControl) {
      this.actionDescriptionValue.set(actionDescriptionControl.value || '');
      actionDescriptionControl.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((value) => {
        this.actionDescriptionValue.set(value || '');
      });
    }
  }

  onCheckboxChange(optionId: number, field: 'recognition_purpose' | 'who_taught_you' | 'source_of_information') {
    let currentSelection: number[] = [];
    let signalToUpdate: typeof this.selectedRecognitionPurpose;

    if (field === 'recognition_purpose') {
      currentSelection = [...this.selectedRecognitionPurpose()];
      signalToUpdate = this.selectedRecognitionPurpose;
    } else if (field === 'who_taught_you') {
      currentSelection = [...this.selectedWhoTaughtYou()];
      signalToUpdate = this.selectedWhoTaughtYou;
    } else {
      currentSelection = [...this.selectedSourceOfInformation()];
      signalToUpdate = this.selectedSourceOfInformation;
    }

    const index = currentSelection.indexOf(optionId);
    if (index > -1) {
      currentSelection.splice(index, 1);
    } else {
      currentSelection.push(optionId);
    }

    signalToUpdate.set(currentSelection);

    // Update form control with JSON stringified array of IDs
    const control = this.formGroup()?.get(field);
    if (control) {
      control.patchValue(JSON.stringify(currentSelection));
      control.markAsTouched();
    }

    // If "Other" unchecked, clear corresponding "other" input
    const isOther = this.isOtherOption(optionId, field);
    if (isOther && !currentSelection.includes(optionId)) {
      const otherControlName =
        field === 'who_taught_you' ? 'who_taught_you_other' : field === 'source_of_information' ? 'source_of_information_other' : null;
      if (otherControlName) {
        this.formGroup()?.get(otherControlName)?.patchValue(null);
      }
    }
  }

  isCheckboxChecked(
    optionId: number,
    field: 'recognition_purpose' | 'who_taught_you' | 'source_of_information',
  ): boolean {
    if (field === 'recognition_purpose') {
      return this.selectedRecognitionPurpose().includes(optionId);
    } else if (field === 'who_taught_you') {
      return this.selectedWhoTaughtYou().includes(optionId);
    } else {
      return this.selectedSourceOfInformation().includes(optionId);
    }
  }

  isOtherSelected(field: 'who_taught_you' | 'source_of_information'): boolean {
    const otherId = 1000;
    return field === 'who_taught_you'
      ? this.selectedWhoTaughtYou().includes(otherId)
      : this.selectedSourceOfInformation().includes(otherId);
  }

  private isOtherOption(
    optionId: number,
    field: 'recognition_purpose' | 'who_taught_you' | 'source_of_information',
  ): boolean {
    if (field === 'recognition_purpose') {
      return false;
    }
    return optionId === 1000;
  }

  onNextClick() {
    const form = this.formGroup();
    if (!form) return;

    form.markAllAsTouched();

    if (form.valid || this.isViewMode()) {
      this.next.emit();
    }
  }
}
