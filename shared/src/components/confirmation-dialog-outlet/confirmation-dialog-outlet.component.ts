import { ChangeDetectionStrategy, Component, computed, HostListener, Signal } from '@angular/core';
import { NgClass } from '@angular/common';
import { GridModule } from '@progress/kendo-angular-grid';
import { PopoverModule, TooltipModule } from '@progress/kendo-angular-tooltip';
import { IconModule, SVGIconModule } from '@progress/kendo-angular-icons';
import { SwitchModule } from '@progress/kendo-angular-inputs';
import { ConfirmationDialogService } from '../../services/confirmation-dialog.service';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { DialogsModule } from '@progress/kendo-angular-dialog';
import { ConfirmationDialogParams, DialogVariant } from '../../shared.types';
import { TranslocoPipe } from '@jsverse/transloco';
import { vetIcons } from '../../shared.icons';

@Component({
  selector: 'vet-confirmation-dialog-outlet',
  standalone: true,
  imports: [
    GridModule,
    TranslocoPipe,
    TooltipModule,
    PopoverModule,
    IconModule,
    SVGIconModule,
    SwitchModule,
    ButtonsModule,
    DialogsModule,
    NgClass,
  ],
  templateUrl: './confirmation-dialog-outlet.component.html',
  styleUrl: './confirmation-dialog-outlet.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmationDialogOutletComponent {
  protected readonly vetIcons = vetIcons;
  protected readonly dialogWidth = 523;

  readonly params: Signal<ConfirmationDialogParams | null>;
  readonly resolvedParams = computed(() => {
    const params = this.params();

    if (!params) {
      return undefined;
    }

    return {
      ...params,
      variant: params.variant ?? 'default',
      showYesNoButtons: params.showYesNoButtons ?? true,
    };
  });

  constructor(private confirmationDialogService: ConfirmationDialogService) {
    this.params = this.confirmationDialogService.currentDialogParams;
  }

  protected getIconByVariant(variant: DialogVariant | 'default') {
    const iconMap = {
      success: this.vetIcons.successCircle,
      error: this.vetIcons.errorCircle,
      info: this.vetIcons.info,
      warning: this.vetIcons.infoWarning,
      default: this.vetIcons.info,
    };

    return iconMap[variant] || iconMap.default;
  }

  @HostListener('window:keydown', ['$event'])
  public onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      event.preventDefault();
      event.stopImmediatePropagation();
      this.close();
    }
  }

  protected close() {
    if (!this.params()?.preventCloseOnKeyDown) {
      this.confirmationDialogService.close();
    }
  }

  protected confirm() {
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

  protected dismiss() {
    const result = this.params()?.onDismiss?.();

    if (result) {
      result.subscribe(() => this.close());
    } else {
      this.close();
    }
  }
}
