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
import { AsyncPipe, NgClass, NgIf } from '@angular/common';
import { ErrorStateMatcher } from '../default-error-state-matcher';
import { FormGroupDirective, NgForm } from '@angular/forms';
import { FormLabelDirective } from '../form-label.directive';
import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion';
import { SvgIconComponent } from 'angular-svg-icon';
import { CALENDAR_ICON } from '@vet/shared';

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
            <button
                *ngIf="!removeClearBtn"
                type="button"
                class="v-ui-form-item__clear-btn"
                [attr.aria-hidden]="!hideClearBtn || !controlProvider.ngControl?.control?.value || disabled || null"
                [class.v-ui-form-item__hide-clear-btn]="
                    !hideClearBtn || !controlProvider.ngControl?.control?.value || disabled
                "
                (click)="$event.stopPropagation(); controlProvider.ngControl?.control?.reset(null)"
            >
                <i class="v-ui-icon cross"></i>
            </button>
            <div *ngIf="calendarIcon" class="v-ui-form-item__calendar-icon">
                <svg-icon [src]="calendarIconSrc"></svg-icon>
            </div>
        </div>
        <ng-container *ngIf="showError">
            <ng-content select="v-ui-form-error"></ng-content>
        </ng-container>
    `,
    imports: [NgIf, AsyncPipe, NgClass, SvgIconComponent],
    styleUrls: ['form-item.component.scss'],
    host: {
        '[class.v-ui-form-item]': 'true',
        '[class.v-ui-form-item--disabled]': 'disabled',
    },
    encapsulation: ViewEncapsulation.None,
})
export class FormItemComponent implements AfterViewInit {
    @Input({ transform: coerceBooleanProperty }) borderless: BooleanInput = false;
    @Input({ transform: coerceBooleanProperty }) hideClearBtn: BooleanInput = false;
    @Input({ transform: coerceBooleanProperty }) removeClearBtn: BooleanInput = false;
    @Input({ transform: coerceBooleanProperty }) calendarIcon: BooleanInput = false;

    @ContentChild(FormControlProvider)
    controlProvider!: FormControlProvider;

    @ContentChild(FormLabelDirective)
    labelDirective?: FormLabelDirective;

    errorStateMatcher: ErrorStateMatcher = inject(ErrorStateMatcher);
    formGroupDirective = inject(FormGroupDirective, { optional: true });
    ngForm = inject(NgForm, { optional: true });
    changeDetectorRef = inject(ChangeDetectorRef);

    public calendarIconSrc = CALENDAR_ICON;

    get disabled() {
        return !!this.controlProvider.ngControl?.disabled;
    }

    @HostBinding('class.v-ui-form-item--error')
    get showError(): boolean {
        if (this.controlProvider && this.controlProvider.ngControl) {
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
