import { inject, Injectable, TemplateRef } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BaseModalComponent } from './base-modal.component';

export enum BaseModalTypesEnum {
    SUCCESS = 'success',
    ERROR = 'error',
}

const defaultConfig = {
    animated: false,
    keyboard: true,
    backdrop: true,
    ignoreBackdropClick: false,
    class: 'modal-dialog-centered',
};

@Injectable({ providedIn: 'root' })
export class BaseModalService {
    private modalService = inject(BsModalService);

    showErrorModal(message: string | TemplateRef<void>) {
        return this.showModal(BaseModalTypesEnum.ERROR, message);
    }

    showSuccessModal(message: string | TemplateRef<void>) {
        return this.showModal(BaseModalTypesEnum.SUCCESS, message);
    }

    showModal(modalType: BaseModalTypesEnum, message: string | TemplateRef<void>) {
        const initialState = {
            data: {
                type: modalType,
                message: message,
            },
        };

        return this.modalService.show(BaseModalComponent, {
            ...defaultConfig,
            initialState,
        });
    }
}
