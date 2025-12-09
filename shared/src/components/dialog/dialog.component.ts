import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, input, OnDestroy, output, signal, viewChild } from '@angular/core';
import { GridModule } from '@progress/kendo-angular-grid';
import { PopoverModule, TooltipModule } from '@progress/kendo-angular-tooltip';
import { IconModule, SVGIconModule } from '@progress/kendo-angular-icons';
import { SwitchModule } from '@progress/kendo-angular-inputs';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { DialogsModule } from '@progress/kendo-angular-dialog';
import { FormsModule } from '@angular/forms';
import { vetIcons } from '../../shared.icons';

@Component({
  selector: 'vet-dialog',
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
    FormsModule,
  ],
  templateUrl: './dialog.component.html',
  styleUrl: './dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogComponent implements AfterViewInit, OnDestroy {
  title = input<string>();
  showHeader = input<boolean>(true);
  showActionsBar = input<boolean>(true);
  disablePadding = input<boolean>(false);
  transparent = input<boolean>(false);
  width = input<string | number | null | undefined>(500);
  height = input<string | number | null | undefined>(400);
  // eslint-disable-next-line @angular-eslint/no-output-native
  close = output();

  contentContainer = viewChild<ElementRef>('contentContainer');
  
  hasDialogActions = signal(false);
  private mutationObserver?: MutationObserver;

  vetIcons = vetIcons;

  ngAfterViewInit() {
    const container = this.contentContainer()?.nativeElement;

    if (!container) {
      return;
    }

    this.checkForDialogActions(container);

    this.mutationObserver = new MutationObserver(() => {
      this.checkForDialogActions(container);
    });

    this.mutationObserver.observe(container, {
      childList: true,
      subtree: true,
    });
  }

  ngOnDestroy() {
    this.mutationObserver?.disconnect();
  }

  private checkForDialogActions(container: HTMLElement) {
    const hasActions = !!container.querySelector('[dialog-actions]');
    this.hasDialogActions.set(hasActions);
  }

  onClose() {
    this.close.emit();
  }
}
