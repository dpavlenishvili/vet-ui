import { ChangeDetectionStrategy, Component, output, signal, WritableSignal } from '@angular/core';
import { KENDO_UPLOAD } from '@progress/kendo-angular-upload';
import { KENDO_BUTTON } from '@progress/kendo-angular-buttons';
import * as kendoIcons from '@progress/kendo-svg-icons';
import { SVGIconComponent } from '@progress/kendo-angular-icons';


@Component({
  selector: 'vet-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrl: './file-upload.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [KENDO_UPLOAD, KENDO_BUTTON, SVGIconComponent],
})
export class FileUploadComponent {
  fileBase64: WritableSignal<string | null> = signal(null);
  selectedFileName = signal('');
  fileUploaded = output<string>();
  kendoIcons = kendoIcons;

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.selectedFileName.set(file.name);
      const reader = new FileReader();
      reader.onload = () => {
        this.fileBase64.set(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }

  uploadFile(): void {
    if (this.fileBase64) {
      console.log('Uploading Base64:', this.fileBase64);
      this.fileUploaded.emit(this.fileBase64() as string);
    }
  }

  removeFile(): void {
    this.fileBase64.set(null);
    this.selectedFileName.set('');
  }

  downloadFile(): void {
    if (this.fileBase64()) {
      const link = document.createElement('a');
      link.href = this.fileBase64() as string;
      link.download = this.selectedFileName() || 'downloaded-file';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }
}
