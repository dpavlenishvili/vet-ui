import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { GridModule } from '@progress/kendo-angular-grid';
import { PopoverModule, TooltipModule } from '@progress/kendo-angular-tooltip';
import { IconModule, SVGIconModule } from '@progress/kendo-angular-icons';
import { SwitchModule } from '@progress/kendo-angular-inputs';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { DialogsModule } from '@progress/kendo-angular-dialog';
import { DialogParams } from '../../shared.types';
import { DialogComponent } from '../dialog/dialog.component';
import { ComponentOutletComponent } from '../component-outlet.component';
import { NgTemplateOutlet } from '@angular/common';
import { TransPipe } from '../../pipes/trans.pipe';

@Component({
  selector: 'vet-single-dialog-outlet',
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
    DialogComponent,
    ComponentOutletComponent,
    NgTemplateOutlet,
    TransPipe,
  ],
  templateUrl: './single-dialog-outlet.component.html',
  styleUrl: './single-dialog-outlet.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SingleDialogOutletComponent<T> {
  params = input.required<DialogParams<T>>();
  hide = output();

  resolvedParams = computed<DialogParams<T>>(() => {
    const params = this.params();

    return {
      ...params,
      showHeader: params.showHeader ?? true,
      showActionsBar: params.showActionsBar ?? false,
      disablePadding: params.disablePadding ?? false,
      transparent: params.transparent ?? false,
    };
  });

  onClose() {
    this.hide.emit();
  }
}
