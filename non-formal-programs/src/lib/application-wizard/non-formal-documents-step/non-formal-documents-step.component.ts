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
    }
  }

  /**
   * Handles removing files from the corresponding form control.
   * @param files The remaining files after removal.
   * @param controlName The name of the form control to update.
   */
  protected handleRemoveFile(files: UploadedFile[] | File[], controlName: string): void {
    const control = this.formGroup().get(controlName);
    if (control) {
      control.setValue(files);
      control.markAsTouched();
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
    const form = this.formGroup();
    form.markAllAsTouched(); // Mark all fields as touched to show validation errors

    debugger
    // Rely on form validation to check if required files are present
    if (!form.valid) {
      return;
    }

    const nonFormalId = this.nonFormalId();
    if (!nonFormalId) {
      this.uploadError.set('non_formal.error_missing_program_id');
      return;
    }

    this.uploadDocuments(nonFormalId);
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

    // Check if any of the form controls contain actual files to upload.
    const hasFilesToUpload = DOCUMENT_FIELDS.some(fieldName => {
      const files: UploadedFile[] = form.get(fieldName)?.value || [];
      return files.some(uploadedFile => !!uploadedFile.file || !!uploadedFile.name || !!uploadedFile.file_name || !!uploadedFile.filename);
    });

    // If there are no files, and the form is valid, just proceed.
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
   * Creates a FormData object from the files in the form controls.
   * @returns A FormData object containing the files to upload.
   */
  private prepareFormData(): FormData {
    const formData = new FormData();
    const form = this.formGroup();

    DOCUMENT_FIELDS.forEach((fieldName) => {
      const files = form.get(fieldName)?.value || [];
      files.forEach((uploadedFile: any) => {
        // Only append if there's an actual file object to upload
        if (uploadedFile) {
          formData.append(`${fieldName}[]`, uploadedFile, uploadedFile.name);
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
