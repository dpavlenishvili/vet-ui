/* eslint-disable @angular-eslint/no-host-metadata-property */
import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ContentChild,
    HostBinding,
    inject,
    Input,
} from '@angular/core';
import { FormControlProvider } from '../form-control-provider';
import { AsyncPipe, NgIf } from '@angular/common';
import { ErrorStateMatcher } from '../default-error-state-matcher';
import { FormGroupDirective, NgForm } from '@angular/forms';

@Component({
    selector: 'v-ui-form-item',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <ng-content></ng-content>
        <ng-container *ngIf="showError">
            <ng-content select="v-ui-form-error-c"></ng-content>
        </ng-container>
    `,
    imports: [NgIf, AsyncPipe],
    styleUrls: ['form-item.component.scss'],
    host: {
        '[class.radio-button-wrapper-border]': 'border',
    },
})
export class FormItemComponent implements AfterViewInit {
    @Input() border = false;
    @ContentChild(FormControlProvider)
    controlProvider!: FormControlProvider;

    errorStateMatcher: ErrorStateMatcher = inject(ErrorStateMatcher);
    formGroupDirective = inject(FormGroupDirective, { optional: true });
    ngForm = inject(NgForm, { optional: true });
    changeDetectorRef = inject(ChangeDetectorRef);

    @HostBinding('class.form-item--error')
    get showError(): boolean {
        if (this.controlProvider) {
            const isErrorState = this.errorStateMatcher.isErrorState(
                this.controlProvider.ngControl.control,
                this.formGroupDirective || this.ngForm || null,
            );

            this.changeDetectorRef.markForCheck();

            return isErrorState;
        }

        return false;
    }

    ngAfterViewInit() {
        if (!this.controlProvider) {
            throw new Error('No control provider found for form item');
        }
    }
}
