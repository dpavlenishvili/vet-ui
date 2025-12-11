import { ChangeDetectionStrategy, Component, inject, input, output, signal } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TranslocoPipe } from '@jsverse/transloco';
import { UploadedFile } from '@vet/shared';
import { FileUploadComponent } from '@vet/shared/heavy-components';
import { ButtonComponent as VetButtonComponent } from '@vet/shared/ui-components';
import { NonFormalService } from '@vet/backend';
import { catchError, finalize, of } from 'rxjs';

// Constant for iterating over form control names
const DOCUMENT_FIELDS = ['certificate', 'employment_contract', 'certificate_from_workplace', 'other'] as const;

@Component({
  selector: 'vet-non-formal-documents-step',
  imports: [ReactiveFormsModule, TranslocoPipe, FileUploadComponent, VetButtonComponent],
  templateUrl: './non-formal-documents-step.component.html',
  styleUrl: './non-formal-documents-step.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class NonFormalDocumentsStepComponent {
  formGroup = input.required<FormGroup>();
  nonFormalId = input.required<number | undefined>();
  isViewMode = input<boolean>(false);
  back = output<void>();
  next = output<void>();
  documentsUploaded = output<void>();

  private readonly nonFormalService = inject(NonFormalService);

  protected readonly isUploading = signal(false);
  protected readonly uploadError = signal<string | null>(null);

  protected handleFileUpload(file: UploadedFile | File, controlName: string): void {
    const control = this.formGroup().get(controlName);
    if (control) {
      const currentFiles = control.value || [];
      control.setValue([...currentFiles, file]);
      control.markAsTouched();
      control.markAsDirty();
      control.updateValueAndValidity();
    }
  }

  protected handleRemoveFile(
    event: { removedFile: UploadedFile; remainingFiles: UploadedFile[] },
    controlName: string,
  ): void {
    const { removedFile, remainingFiles } = event;

    if (removedFile.id) {
      const nonFormalId = this.nonFormalId();
      if (nonFormalId) {
        this.nonFormalService
          .deleteNonFormalApplicationFile(nonFormalId, Number(removedFile.id))
          .pipe(
            catchError((error) => {
              console.error('Error deleting file:', error);
              return of(null);
            }),
          )
          .subscribe();
      }
    }

    const control = this.formGroup().get(controlName);
    if (control) {
      control.setValue(remainingFiles);
      control.markAsTouched();
      control.markAsDirty();
      control.updateValueAndValidity();
    }
  }

  protected getErrorMessage(controlName: string, labelKey: string): string | null {
    const control = this.formGroup().get(controlName);
    if (control?.touched && control?.errors?.['required']) {
      return 'non_formal.please_upload_documents'; // Generic validation message
    }
    return null;
  }

  protected onNextClick(): void {
    if (this.isViewMode()) {
      this.next.emit();
      return;
    }

    const form = this.formGroup();
    form.markAllAsTouched();

    if (!form.valid) {
      return;
    }

    if (form.dirty) {
      const nonFormalId = this.nonFormalId();
      if (!nonFormalId) {
        this.uploadError.set('non_formal.error_missing_program_id');
        return;
      }
      this.uploadDocuments(nonFormalId);
    } else {
      this.next.emit();
    }
  }

  private uploadDocuments(nonFormalId: number): void {
    const form = this.formGroup();

    const hasFilesToUpload = DOCUMENT_FIELDS.some((fieldName) => {
      const files: UploadedFile[] = form.get(fieldName)?.value || [];
      return files.some(
        (uploadedFile) =>
          !uploadedFile.id &&
          (!!uploadedFile.file || !!uploadedFile.name || !!uploadedFile.file_name || !!uploadedFile.filename),
      );
    });

    if (!hasFilesToUpload) {
      this.next.emit();
      return;
    }

    const formData = this.prepareFormData();
    this.uploadError.set(null);
    this.isUploading.set(true);

    this.nonFormalService
      .nonFormalsRegistrationDocuments(nonFormalId, formData as any)
      .pipe(
        catchError((error) => {
          console.error('Error uploading documents:', error);
          const errorMessage = this.extractErrorMessage(error);
          this.uploadError.set(errorMessage);
          return of(null);
        }),
        finalize(() => this.isUploading.set(false)),
      )
      .subscribe({
        next: (response) => {
          if (response) {
            const form = this.formGroup();
            form.markAsPristine();

            this.documentsUploaded.emit();

            this.next.emit();
          }
        },
      });
  }

  private prepareFormData(): FormData {
    const formData = new FormData();
    const form = this.formGroup();

    DOCUMENT_FIELDS.forEach((fieldName) => {
      const files: UploadedFile[] = form.get(fieldName)?.value || [];
      files.forEach((uploadedFile: any) => {
        if (uploadedFile && !uploadedFile.id) {
          const fileName = uploadedFile.name || uploadedFile.filename || 'file';
          formData.append(`${fieldName}[]`, uploadedFile, fileName);
        }
      });
    });

    return formData;
  }

  private extractErrorMessage(error: any): string {
    return error?.error?.message || error?.message || 'non_formal.error_upload_failed';
  }
}
