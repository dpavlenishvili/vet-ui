import { Component, ViewEncapsulation, inject, TemplateRef } from '@angular/core';
import { CHECK_ICON, CROSS_ICON, ERROR_ICON } from '@vet/shared';
import { ButtonComponent } from '@vet/ui/button';
import { SvgIconComponent } from 'angular-svg-icon';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { NgTemplateOutlet } from '@angular/common';
import { NavigationEnd, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

interface BaseModalTemplateContext {
    bsModalRef?: BsModalRef;
}

export interface BaseModalData {
    type: 'success' | 'error';
    message?: string | TemplateRef<BaseModalTemplateContext | void>;
    closeButton?: string;
}

@Component({
    // eslint-disable-next-line @angular-eslint/component-selector
    selector: 'v-ui-base-modal',
    standalone: true,
    templateUrl: './base-modal.component.html',
    styleUrls: ['./base-modal.component.scss'],
    imports: [SvgIconComponent, ButtonComponent, NgTemplateOutlet],
    encapsulation: ViewEncapsulation.None,
})
export class BaseModalComponent {
    protected bsModalRef = inject(BsModalRef);

    checkIcon = CHECK_ICON;
    errorIcon = ERROR_ICON;
    crossIcon = CROSS_ICON;

    data: BaseModalData = {
        type: 'success',
    };

    constructor(private router: Router) {
        router.events.pipe(takeUntilDestroyed()).subscribe((res) => {
            if (res instanceof NavigationEnd) {
                this.onClose();
            }
        });
    }

    onClose() {
        this.bsModalRef.hide();
    }

    isMessageTemplate(m: unknown): m is TemplateRef<unknown> {
        return m instanceof TemplateRef;
    }
}
