import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core';
import { vetIcons } from '@vet/shared';
import { ShortProgram } from '@vet/backend';
import { ButtonComponent } from '@progress/kendo-angular-buttons';
import {
  CellTemplateDirective,
  ColumnComponent,
  GridComponent,
  NoRecordsTemplateDirective,
} from '@progress/kendo-angular-grid';
import { DialogComponent } from '@progress/kendo-angular-dialog';
import { SVGIconComponent } from '@progress/kendo-angular-icons';
import { TranslocoPipe } from '@jsverse/transloco';
import { ShortProgramPageComponent } from '../../../short-program-page/short-program-page.component';

@Component({
  selector: 'vet-short-registration-program-selection-grid',
  imports: [
    ButtonComponent,
    CellTemplateDirective,
    ColumnComponent,
    DialogComponent,
    GridComponent,
    NoRecordsTemplateDirective,
    SVGIconComponent,
    TranslocoPipe,
    ShortProgramPageComponent,
  ],
  templateUrl: './short-registration-program-selection-grid.component.html',
  styleUrl: './short-registration-program-selection-grid.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class ShortRegistrationProgramSelectionGridComponent {
  items = input.required<ShortProgram[]>();
  isLoading = input.required<boolean>();
  vetIcons = vetIcons;
  previewProgramId = signal(0);
  isProgramPreviewDialogOpen = signal(false);
  isConfirmSelectionDialogOpen = signal(false);

  onPreviewProgram(program: ShortProgram) {
    this.previewProgramId.set(Number(program.id));
    this.isProgramPreviewDialogOpen.set(true);
  }

  onSelectProgram(program: ShortProgram) {
    this.isConfirmSelectionDialogOpen.set(true);
  }

  onCloseDialog() {
    this.isProgramPreviewDialogOpen.set(false);
    this.isConfirmSelectionDialogOpen.set(false);
  }
}
