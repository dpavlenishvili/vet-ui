import { Injectable } from '@angular/core';
import { NotificationService, Type } from '@progress/kendo-angular-notification';
import { TranslocoService } from '@jsverse/transloco';
import { ToastModule } from '../toast.module';

export interface ToastParams {
  translate?: boolean;
}

@Injectable({ providedIn: ToastModule })
export class ToastService {
  constructor(private notificationService: NotificationService, private translocoService: TranslocoService) {}

  success(message: string, params?: ToastParams) {
    this.show('success', message, params);
  }

  error(message: string, params?: ToastParams) {
    this.show('error', message, params);
  }

  warning(message: string, params?: ToastParams) {
    this.show('warning', message, params);
  }

  info(message: string, params?: ToastParams) {
    this.show('info', message, params);
  }

  show(type: Type['style'], message: string, params: ToastParams = {}) {
    const { translate = true } = params;

    this.notificationService.show({
      content: translate ? this.translocoService.translate(message) : message,
      animation: { type: 'slide', duration: 400 },
      position: { horizontal: 'center', vertical: 'top' },
      type: { style: type, icon: true },
      hideAfter: 3000,
    });
  }
}
