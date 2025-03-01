import { ChangeDetectionStrategy, Component, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GridModule } from '@progress/kendo-angular-grid';
import { PopoverModule, TooltipModule } from '@progress/kendo-angular-tooltip';
import { IconModule, SVGIconModule } from '@progress/kendo-angular-icons';
import { SwitchModule } from '@progress/kendo-angular-inputs';
import { ConfirmationDialogService } from '../../services/confirmation-dialog.service';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { DialogsModule } from '@progress/kendo-angular-dialog';
import { ConfirmationDialogParams } from '../../shared.types';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'vet-confirmation-dialog-outlet',
  standalone: true,
  imports: [
    CommonModule,
    GridModule,
    TranslocoPipe,
    TooltipModule,
    PopoverModule,
    IconModule,
    SVGIconModule,
    SwitchModule,
    ButtonsModule,
    DialogsModule,
  ],
  templateUrl: './confirmation-dialog-outlet.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmationDialogOutletComponent {
  params: Signal<ConfirmationDialogParams | null>;

  constructor(private confirmationDialogService: ConfirmationDialogService) {
    this.params = this.confirmationDialogService.currentDialogParams;
  }

  close() {
    this.confirmationDialogService.currentDialogParams.set(null);
  }

  confirm() {
    const result = this.params()?.onConfirm();

    if (result) {
      result.subscribe({
        next: () => this.close(),
        error: () => this.close(),
      });
    } else {
      this.close();
    }
  }

  dismiss() {
    const result = this.params()?.onDismiss?.();

    if (result) {
      result.subscribe(() => this.close());
    } else {
      this.close();
    }
  }
}
