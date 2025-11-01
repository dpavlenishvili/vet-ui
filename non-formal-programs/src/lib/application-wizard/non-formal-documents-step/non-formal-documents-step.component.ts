import { ChangeDetectionStrategy, Component, inject, input, output, signal } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TranslocoPipe } from '@jsverse/transloco';
import { ButtonComponent } from '@progress/kendo-angular-buttons';
import { FileUploadComponent, UploadedFile } from '@vet/shared';
import { NonFormalService } from '@vet/backend';
import { catchError, finalize, of } from 'rxjs';

// Constant for iterating over form control names
const DOCUMENT_FIELDS = ['certificate', 'employment_contract', 'certificate_from_workplace', 'other'] as const;

@Component({
  selector: 'vet-non-formal-documents-step',
  imports: [ReactiveFormsModule, TranslocoPipe, ButtonComponent, FileUploadComponent],
  templateUrl: './non-formal-documents-step.component.html',
  styleUrl: './non-formal-documents-step.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class NonFormalDocumentsStepComponent {
  // --- Component Inputs and Outputs ---
  formGroup = input.required<FormGroup>();
  nonFormalId = input.required<number | undefined>();
  isViewMode = input<boolean>(false);
  back = output<void>();
  next = output<void>();

  // --- Services ---
  private readonly nonFormalService = inject(NonFormalService);

  // --- State Signals ---
  protected readonly isUploading = signal(false);
  protected readonly uploadError = signal<string | null>(null);

  /**
   * Handles adding a file to the corresponding form control.
   * @param file The file that was uploaded.
   * @param controlName The name of the form control to update.
   */
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

  /**
   * Handles removing files from the corresponding form control.
   * If file has ID (server file), deletes it from the server.
   * @param event Object with removed file and remaining files
   * @param controlName The name of the form control to update.
   */
  protected handleRemoveFile(
    event: { removedFile: UploadedFile; remainingFiles: UploadedFile[] },
    controlName: string,
  ): void {
    const { removedFile, remainingFiles } = event;

    // If file has ID, delete from server (fire and forget)
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

    // Update form control
    const control = this.formGroup().get(controlName);
    if (control) {
      control.setValue(remainingFiles);
      control.markAsTouched();
      control.markAsDirty();
      control.updateValueAndValidity();
    }
  }

  /**
   * Gets the validation error message for a specific form control.
   * Relies on the control being touched to display the error.
   * @param controlName The name of the form control.
   * @param labelKey The translation key for the field's label.
   * @returns The error message key or null.
   */
  protected getErrorMessage(controlName: string, labelKey: string): string | null {
    const control = this.formGroup().get(controlName);
    if (control?.touched && control?.errors?.['required']) {
      return labelKey; // The pipe in the template will translate this key
    }
    return null;
  }

  /**
   * Triggered when the 'Next' button is clicked.
   * It validates the form and initiates the document upload process.
   */
  protected onNextClick(): void {
    if (this.isViewMode()) {
      this.next.emit();
      return;
    }

    const form = this.formGroup();
    form.markAllAsTouched(); // Mark all fields as touched to show validation errors

    if (!form.valid) {
      return;
    }

    // Only call upload if the form is dirty (i.e., files were added or removed).
    if (form.dirty) {
      const nonFormalId = this.nonFormalId();
      if (!nonFormalId) {
        this.uploadError.set('non_formal.error_missing_program_id');
        return;
      }
      this.uploadDocuments(nonFormalId);
    } else {
      // If form is not dirty, it means no files were changed, so just proceed.
      this.next.emit();
    }
  }

  /**
   * Prepares the FormData and calls the service to upload documents.
   * @param nonFormalId The ID of the non-formal program.
   */
  /**
   * Prepares the FormData and calls the service to upload documents.
   * @param nonFormalId The ID of the non-formal program.
   */
  private uploadDocuments(nonFormalId: number): void {
    const form = this.formGroup();

    // Check if any of the form controls contain NEW files to upload (files without ID).
    // Existing files (with ID) are already on the server and should not be re-uploaded.
    const hasFilesToUpload = DOCUMENT_FIELDS.some((fieldName) => {
      const files: UploadedFile[] = form.get(fieldName)?.value || [];
      return files.some(
        (uploadedFile) =>
          !uploadedFile.id &&
          (!!uploadedFile.file || !!uploadedFile.name || !!uploadedFile.file_name || !!uploadedFile.filename),
      );
    });

    // If there are no NEW files to upload, just proceed.
    if (!hasFilesToUpload) {
      this.next.emit();
      return;
    }

    // Now that we know there are files, prepare the FormData for the request.
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
          return of(null); // Return a non-error observable to continue the stream
        }),
        finalize(() => this.isUploading.set(false)),
      )
      .subscribe({
        next: (response) => {
          if (response) {
            this.next.emit();
          }
        },
      });
  }

  /**
   * Creates a FormData object from ONLY the NEW files in the form controls.
   * Existing files (with ID) are skipped as they're already on the server.
   * @returns A FormData object containing only new files to upload.
   */
  private prepareFormData(): FormData {
    const formData = new FormData();
    const form = this.formGroup();

    DOCUMENT_FIELDS.forEach((fieldName) => {
      const files: UploadedFile[] = form.get(fieldName)?.value || [];
      files.forEach((uploadedFile: any) => {
        // Only append NEW files (files without an ID from the server)
        // Files with ID are already uploaded to the server
        if (uploadedFile && !uploadedFile.id) {
          // uploadedFile.file is the actual File object from FileUploadComponent
          const fileName = uploadedFile.name || uploadedFile.filename || 'file';
          formData.append(`${fieldName}[]`, uploadedFile, fileName);
        }
      });
    });

    return formData;
  }

  /**
   * Extracts a user-friendly error message from an HTTP error response.
   * @param error The error object from the API call.
   * @returns A string representing the error message.
   */
  private extractErrorMessage(error: any): string {
    return error?.error?.message || error?.message || 'non_formal.error_upload_failed';
  }
}
