import { ChangeDetectionStrategy, Component, computed, inject, Signal, HostListener } from '@angular/core';
import { NgClass, NgTemplateOutlet } from '@angular/common';
import { GridModule } from '@progress/kendo-angular-grid';
import { PopoverModule, TooltipModule } from '@progress/kendo-angular-tooltip';
import { IconModule, SVGIconModule } from '@progress/kendo-angular-icons';
import { SwitchModule } from '@progress/kendo-angular-inputs';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { DialogsModule } from '@progress/kendo-angular-dialog';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { Router } from '@angular/router';
import { WA_WINDOW } from '@ng-web-apis/common';
import { DomSanitizer } from '@angular/platform-browser';
import { AlertDialogParams, DialogVariant } from '../../shared.types';
import { AlertDialogService } from '../../services/alert-dialog.service';
import { vetIcons } from '../../shared.icons';

@Component({
  selector: 'vet-alert-dialog-outlet',
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
    NgTemplateOutlet,
    NgClass,
  ],
  templateUrl: './alert-dialog-outlet.component.html',
  styleUrl: './alert-dialog-outlet.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AlertDialogOutletComponent {
  private readonly router = inject(Router);
  private readonly window = inject(WA_WINDOW);
  private readonly sanitizer = inject(DomSanitizer);
  private readonly translocoService = inject(TranslocoService);
  private readonly alertDialogService = inject(AlertDialogService);

  protected readonly vetIcons = vetIcons;
  protected readonly dialogWidth = 523;

  readonly params: Signal<AlertDialogParams | null>;
  readonly resolvedParams = computed(() => {
    const params = this.params();

    if (!params) {
      return undefined;
    }

    return {
      ...params,
      variant: params.variant ?? 'success',
      text: this.sanitizeAndTranslateText(params.text),
    };
  });

  constructor() {
    this.params = this.alertDialogService.currentDialogParams;
  }

  @HostListener('window:keydown', ['$event'])
  public onKeydown(event: KeyboardEvent): void {
    // Enhanced: Allow ESC key to close alert dialogs
    if (event.key === 'Escape') {
      event.preventDefault();
      event.stopImmediatePropagation();
      this.close();
    }
  }

  protected getIconByVariant(variant: DialogVariant) {
    const iconMap = {
      success: this.vetIcons.successCircle,
      error: this.vetIcons.errorCircle,
      info: this.vetIcons.info,
      warning: this.vetIcons.infoWarning,
    };

    return iconMap[variant] || iconMap.success;
  }

  private sanitizeAndTranslateText(text?: string) {
    if (!text) {
      return undefined;
    }

    const translatedText = this.translocoService.translate(text);
    return this.sanitizer.bypassSecurityTrustHtml(translatedText);
  }

  protected close() {
    this.resolvedParams()?.onClose?.();
    this.alertDialogService.close();
  }

  protected handleLinkClick(event: MouseEvent) {
    const target = event.target as HTMLElement;

    if (target?.tagName?.toLowerCase() !== 'a') {
      return;
    }

    const anchor = target as HTMLAnchorElement;
    const url = URL.parse(anchor.href);

    if (url?.host !== this.window?.location?.host) {
      return;
    }

    event.preventDefault();
    const pathname = url?.pathname;

    if (pathname) {
      void this.router.navigateByUrl(pathname);
    }

    this.close();
  }
}
