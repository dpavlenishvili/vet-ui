import { ChangeDetectionStrategy, Component, inject, output, signal, WritableSignal } from '@angular/core';
import { KENDO_UPLOAD } from '@progress/kendo-angular-upload';
import { KENDO_BUTTON } from '@progress/kendo-angular-buttons';
import * as kendoIcons from '@progress/kendo-svg-icons';
import { SVGIconComponent } from '@progress/kendo-angular-icons';
import { UploadedFile } from '../../shared.types';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'vet-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [KENDO_UPLOAD, KENDO_BUTTON, SVGIconComponent],
})
export class FileUploadComponent {
  uploadedFiles: WritableSignal<UploadedFile[]> = signal([]);
  errorMessage: WritableSignal<string | null> = signal(null);
  fileUploaded = output<UploadedFile[]>();
  kendoIcons = kendoIcons;
  allowedExtensions = signal(['pdf', 'doc', 'docx', 'png', 'jpg', 'jpeg', 'heic']);
  maxFiles = signal(2);
  document = inject(DOCUMENT);

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const files = Array.from(input.files);
      const currentFiles = this.uploadedFiles();

      if (currentFiles.length >= this.maxFiles()) {
        this.errorMessage.set('მაქსიმუმ 2 ფაილი შეიძლება ატვირთოთ.');
        this.clearErrorAfterDelay();
        return;
      }

      const remainingSlots = this.maxFiles() - currentFiles.length;
      if (files.length > remainingSlots) {
        this.errorMessage.set(
          `შეყვანილი ფაილების რაოდენობა იზიდავს, შეგიძლიათ მხოლოდ ${remainingSlots} მეტი ფაილი ატვირთოთ.`,
        );
      }
      const filesToProcess = files.slice(0, remainingSlots);

      filesToProcess.forEach((file) => {
        const fileExt = file.name.split('.').pop()?.toLowerCase();
        if (!fileExt || !this.allowedExtensions().includes(fileExt)) {
          this.errorMessage.set(`ფაილის ტიპი არ არის დებულებული: ${file.name}`);
          this.clearErrorAfterDelay();
          return;
        }
        const reader = new FileReader();
        reader.onload = () => {
          const fileData: UploadedFile = { filename: file.name, base64: reader.result as string };
          this.uploadedFiles.update((files) => [...files, fileData]);
          this.fileUploaded.emit(this.uploadedFiles());
        };
        reader.readAsDataURL(file);
      });
      input.value = '';
    }
  }

  removeFile(fileToRemove: UploadedFile): void {
    this.uploadedFiles.update((files) => files.filter((file) => file.filename !== fileToRemove.filename));
    this.fileUploaded.emit(this.uploadedFiles());
  }

  downloadFile(file: UploadedFile): void {
    const link = this.document.createElement('a');
    link.href = file.base64;
    link.download = file.filename || 'downloaded-file';
    this.document.body.appendChild(link);
    link.click();
    this.document.body.removeChild(link);
  }

  private clearErrorAfterDelay() {
    setTimeout(() => {
      this.errorMessage.set(null);
    }, 3000);
  }
}
