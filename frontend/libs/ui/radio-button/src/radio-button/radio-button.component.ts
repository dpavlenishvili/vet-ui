/* eslint-disable @typescript-eslint/no-empty-function */
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostListener, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RadioButtonGroupComponent } from '../radio-button-group/radio-button-group.component';
import { RadioButtonService, RadioButtonValue } from '../radio-button.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

let quantity = 0;

@Component({
    selector: 'v-ui-radio-button',
    standalone: true,
    imports: [CommonModule, RadioButtonGroupComponent],
    templateUrl: './radio-button.component.html',
    styleUrls: ['./radio-button.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RadioButtonComponent {
    @Input() id = `v-ui-radio-button-${++quantity}`;
    @Input() value: RadioButtonValue = '';
    @Input() name = '';
    @Input() isDisabled = false;
    checked = false;

    constructor(
        private cdr: ChangeDetectorRef,
        protected radioButtonService: RadioButtonService,
    ) {
        this.radioButtonService.selected$.pipe(takeUntilDestroyed()).subscribe((value) => {
            this.checked = this.value == value;
            this.cdr.markForCheck();
        });

        this.radioButtonService.isDisabled$.pipe(takeUntilDestroyed()).subscribe((value) => {
            this.isDisabled = value;
            this.cdr.markForCheck();
        });
    }

    @HostListener('click', ['$event'])
    onClick($event: MouseEvent) {
        $event.stopPropagation();
        $event.preventDefault();

        if (this.isDisabled || this.checked) {
            return;
        }

        this.radioButtonService.setRadioButtonValue(this.value);
    }
}
