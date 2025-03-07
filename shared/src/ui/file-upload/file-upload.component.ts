import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  model,
  output,
  signal,
  WritableSignal,
} from '@angular/core';
import * as kendoIcons from '@progress/kendo-svg-icons';
import { SVGIconComponent } from '@progress/kendo-angular-icons';
import { UploadedFile } from '../../shared.types';
import { DOCUMENT } from '@angular/common';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { useBaseUrl } from '../../shared.injectors';

@Component({
  selector: 'vet-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [SVGIconComponent, TranslocoPipe],
})
export class FileUploadComponent {
  title = input('');
  uploadedFiles = model<UploadedFile[]>([]);
  errorMessage: WritableSignal<string | null> = signal(null);
  fileUploaded = output<UploadedFile>();
  fileRemoved = output<UploadedFile[]>();
  kendoIcons = kendoIcons;
  allowedExtensions = signal(['pdf', 'doc', 'docx', 'png', 'jpg', 'jpeg', 'heic']);
  maxFiles = signal(2);
  document = inject(DOCUMENT);
  translocoService = inject(TranslocoService);
  baseUrl = `${useBaseUrl()}/download?file=`;

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const files = Array.from(input.files);
      const currentFiles = this.uploadedFiles();

      if (currentFiles.length >= this.maxFiles()) {
        this.errorMessage.set(this.translocoService.translate('shared.maxFilesUploadError'));
        this.clearErrorAfterDelay();
        return;
      }

      const remainingSlots = this.maxFiles() - currentFiles.length;
      if (files.length > remainingSlots) {
        this.errorMessage.set(
          this.translocoService.translate('shared.exceedFileLimitError', { remaining: remainingSlots }),
        );
      }
      const filesToProcess = files.slice(0, remainingSlots);

      filesToProcess.forEach((file) => {
        const fileExt = file.name.split('.').pop()?.toLowerCase();
        if (!fileExt || !this.allowedExtensions().includes(fileExt)) {
          this.errorMessage.set(
            this.translocoService.translate('shared.invalidFileTypeError', { fileName: file.name }),
          );
          this.clearErrorAfterDelay();
          return;
        }
        const reader = new FileReader();
        reader.onload = () => {
          const fileData: UploadedFile = { filename: file.name, base64: reader.result as string };
          this.uploadedFiles.set([...this.uploadedFiles(), fileData]);
          this.fileUploaded.emit(fileData);
        };
        reader.readAsDataURL(file);
      });
      input.value = '';
    }
  }

  removeFile(fileToRemove: UploadedFile): void {
    const updatedFiles = this.uploadedFiles().filter((file) => file.filename !== fileToRemove.filename);
    this.uploadedFiles.set(updatedFiles);
    this.fileRemoved.emit(updatedFiles);
  }

  downloadFile(file: UploadedFile): void {
    if (file.id) {
      this.document.defaultView?.open(file.download_url, '_blank');
    } else {
      const link = this.document.createElement('a');
      link.href = file.base64!;
      link.download = file.filename || 'downloaded-file';
      this.document.body.appendChild(link);
      link.click();
      this.document.body.removeChild(link);
    }
  }

  private clearErrorAfterDelay() {
    setTimeout(() => {
      this.errorMessage.set(null);
    }, 3000);
  }
}
