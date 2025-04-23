import { ChangeDetectionStrategy, Component, computed, inject, Signal } from '@angular/core';
import { GridModule } from '@progress/kendo-angular-grid';
import { PopoverModule, TooltipModule } from '@progress/kendo-angular-tooltip';
import { IconModule, SVGIconModule } from '@progress/kendo-angular-icons';
import { SwitchModule } from '@progress/kendo-angular-inputs';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { DialogsModule } from '@progress/kendo-angular-dialog';
import { AlertDialogParams } from '../../shared.types';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { AlertDialogService } from '../../services/alert-dialog.service';
import { NgTemplateOutlet } from '@angular/common';
import { vetIcons } from '../../shared.icons';
import { Router } from '@angular/router';
import { WA_WINDOW } from '@ng-web-apis/common';
import { DomSanitizer } from '@angular/platform-browser';

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
  ],
  templateUrl: './alert-dialog-outlet.component.html',
  styleUrl: './alert-dialog-outlet.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AlertDialogOutletComponent {
  router = inject(Router);

  params: Signal<AlertDialogParams | null>;
  window = inject(WA_WINDOW);
  sanitizer = inject(DomSanitizer);
  translocoService = inject(TranslocoService);
  resolvedParams = computed(() => {
    const params = this.params();

    if (!params) {
      return undefined;
    }

    return {
      ...params,
      variant: params?.variant ?? 'success',
      text: params?.text
        ? this.sanitizer.bypassSecurityTrustHtml(this.translocoService.translate(params.text))
        : undefined,
    };
  });

  protected readonly vetIcons = vetIcons;

  constructor(private alertDialogService: AlertDialogService) {
    this.params = this.alertDialogService.currentDialogParams;
  }

  close() {
    this.alertDialogService.close();
  }

  onClick(event: MouseEvent) {
    const target = event.target as HTMLElement;

    if (target?.tagName?.toLowerCase() === 'a') {
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
}
