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
    ViewEncapsulation,
} from '@angular/core';
import { FormControlProvider } from '../form-control-provider';
import { AsyncPipe, NgIf } from '@angular/common';
import { ErrorStateMatcher } from '../default-error-state-matcher';
import { FormGroupDirective, NgForm } from '@angular/forms';
import { FormLabelDirective } from '../form-label.directive';

@Component({
    selector: 'v-ui-form-item',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <label class="v-ui-form-item__label" [for]="controlProvider.id" *ngIf="labelDirective">
            <ng-content select="v-ui-form-item-label"></ng-content>
        </label>
        <div
            class="v-ui-form-item__control-container"
            [class.v-ui-form-item__control-container--borderless]="borderless"
        >
            <ng-content></ng-content>
            <ng-container *ngIf="clearBtn && controlProvider.ngControl.control?.value">
                <button
                    class="v-ui-form-item__clear-btn"
                    (click)="$event.stopPropagation(); controlProvider.ngControl.control?.reset(null)"
                >
                    <i class="v-ui-icon cross"></i>
                </button>
            </ng-container>
        </div>
        <ng-container *ngIf="showError">
            <ng-content select="v-ui-form-error"></ng-content>
        </ng-container>
    `,
    imports: [NgIf, AsyncPipe],
    styleUrls: ['form-item.component.scss'],
    host: {
        '[class.v-ui-form-item]': 'true',
        '[class.v-ui-form-item--disabled]': 'disabled',
    },
    encapsulation: ViewEncapsulation.None,
})
export class FormItemComponent implements AfterViewInit {
    @Input() borderless = false;
    @Input() clearBtn = false;

    @ContentChild(FormControlProvider)
    controlProvider!: FormControlProvider;

    @ContentChild(FormLabelDirective)
    labelDirective?: FormLabelDirective;

    errorStateMatcher: ErrorStateMatcher = inject(ErrorStateMatcher);
    formGroupDirective = inject(FormGroupDirective, { optional: true });
    ngForm = inject(NgForm, { optional: true });
    changeDetectorRef = inject(ChangeDetectorRef);

    get disabled() {
        return this.controlProvider.ngControl.disabled;
    }

    @HostBinding('class.v-ui-form-item--error')
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
