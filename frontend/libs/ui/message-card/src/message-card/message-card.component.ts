import { Component, Input, ViewEncapsulation } from '@angular/core';
import { CHECK_ICON, ERROR_ICON, INFO_ICON, WARNING_ICON } from '@vet/shared';
import { SvgIconComponent } from 'angular-svg-icon';

@Component({
    // eslint-disable-next-line @angular-eslint/component-selector
    selector: 'v-ui-message-card',
    standalone: true,
    template: `
        <div class="v-ui-message-card__icon-container">
            <div [class.success-icon-color]="icon === checkIcon" [class.error-icon-color]="icon === errorIcon">
                <svg-icon [src]="icon"></svg-icon>
            </div>
        </div>
        <ng-content></ng-content>
    `,
    styleUrls: ['./message-card.component.scss'],
    // eslint-disable-next-line @angular-eslint/no-host-metadata-property
    host: {
        '[class.v-ui-message-card]': 'true',
        '[class.v-ui-message-card__success]': 'messageCardType === "success"',
        '[class.v-ui-message-card__info]': 'messageCardType === "info"',
        '[class.v-ui-message-card__warning]': 'messageCardType === "warning"',
        '[class.v-ui-message-card__error]': 'messageCardType === "error"',
    },
    encapsulation: ViewEncapsulation.None,
    imports: [SvgIconComponent],
})
export class MessageCardComponent {
    @Input() messageCardType: 'success' | 'info' | 'warning' | 'error' = 'success';

    checkIcon = CHECK_ICON;
    infoIcon = INFO_ICON;
    errorIcon = ERROR_ICON;
    warningIcon = WARNING_ICON;

    get icon() {
        if (this.messageCardType === 'success') {
            return this.checkIcon;
        } else if (this.messageCardType === 'info') {
            return this.infoIcon;
        } else if (this.messageCardType === 'warning') {
            return this.warningIcon;
        } else {
            return this.errorIcon;
        }
    }
}
