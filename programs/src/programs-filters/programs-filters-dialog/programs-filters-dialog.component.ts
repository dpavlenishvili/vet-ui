import { ChangeDetectionStrategy, Component, output } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslocoPipe } from '@jsverse/transloco';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import { DialogModule } from '@progress/kendo-angular-dialog';
import { DropDownListModule } from '@progress/kendo-angular-dropdowns';
import { InputsModule, TextAreaModule, TextBoxModule } from '@progress/kendo-angular-inputs';
import { ToastModule } from '@vet/shared';
import * as kendoIcons from '@progress/kendo-svg-icons';
import { LabelModule } from '@progress/kendo-angular-label';
import { SVGIconModule } from '@progress/kendo-angular-icons';

@Component({
  selector: 'vet-programs-filters-dialog',
  imports: [
    TranslocoPipe,
    DialogModule,
    ReactiveFormsModule,
    DropDownListModule,
    TextBoxModule,
    ButtonModule,
    ToastModule,
    TextAreaModule,
    LabelModule,
    InputsModule,
    SVGIconModule,
  ],
  templateUrl: './programs-filters-dialog.component.html',
  styleUrl: './programs-filters-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true
})
export class ProgramsFiltersDialogComponent {
  kendoIcons = kendoIcons;

  dialogClose = output();

  handleSave() {
    console.log('hey');
  }

  handleClose() {
    this.dialogClose.emit();
  }
}
