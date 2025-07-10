import { ChangeDetectionStrategy, Component, computed, inject, ViewContainerRef } from '@angular/core';
import { GridModule } from '@progress/kendo-angular-grid';
import { PopoverModule, TooltipModule } from '@progress/kendo-angular-tooltip';
import { IconModule, SVGIconModule } from '@progress/kendo-angular-icons';
import { SwitchModule } from '@progress/kendo-angular-inputs';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { DialogsModule } from '@progress/kendo-angular-dialog';
import { AppDialogService } from '../../services/app-dialog.service';
import { DialogRef } from '../../shared.types';
import { SingleDialogOutletComponent } from '../single-dialog-outlet/single-dialog-outlet.component';

@Component({
  selector: 'vet-dialog-outlet',
  standalone: true,
  imports: [
    GridModule,
    TooltipModule,
    PopoverModule,
    IconModule,
    SVGIconModule,
    SwitchModule,
    ButtonsModule,
    DialogsModule,
    SingleDialogOutletComponent,
  ],
  templateUrl: './dialog-outlet.component.html',
  styleUrl: './dialog-outlet.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogOutletComponent {
  private readonly dialogService = inject(AppDialogService);

  readonly openedDialogs = this.dialogService.openedDialogs;

  onClose(id?: string) {
    if (id) {
      this.dialogService.hide(id);
    }
  }
}
