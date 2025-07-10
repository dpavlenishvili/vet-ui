import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { SelectEvent } from '@progress/kendo-angular-upload';
import { KENDO_LABEL } from '@progress/kendo-angular-label';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { KENDO_DROPDOWNS } from '@progress/kendo-angular-dropdowns';
import { TranslocoPipe } from '@jsverse/transloco';
import { KENDO_CHECKBOX, KENDO_SWITCH } from '@progress/kendo-angular-inputs';
import { KENDO_BUTTON } from '@progress/kendo-angular-buttons';
import { KENDO_SVGICON } from '@progress/kendo-angular-icons';
import { vetIcons } from '@vet/shared';

@Component({
  selector: 'vet-vacancy',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    KENDO_DROPDOWNS,
    TranslocoPipe,
    KENDO_LABEL,
    KENDO_SVGICON,
    KENDO_BUTTON,
    KENDO_SWITCH,
    KENDO_CHECKBOX,
  ],
  templateUrl: './job-seeker.component.html',
  styleUrl: './job-seeker.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JobSeekerComponent {
  jobForm: FormGroup = new FormGroup({
    file: new FormControl(),
    position: new FormControl(),
    municipally: new FormControl(),
    orinetation: new FormControl(),
    emainNotification: new FormControl<boolean>(false),
    conditions: new FormControl<boolean>(false),
  });
  icons = vetIcons;
  uploadState = signal<boolean>(true);

  onFileSelect(event: SelectEvent) {
    if (event.files.length > 0) {
      const file = event.files[0].rawFile;
      this.jobForm.patchValue({ file });
    }
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      const file = input.files[0];
      this.jobForm.get('file')?.patchValue({ file });
    }
  }
}
