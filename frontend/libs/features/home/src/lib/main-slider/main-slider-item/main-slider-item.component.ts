import { Component, forwardRef, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe, NgOptimizedImage } from '@angular/common';
import { AbstractSliderItem } from '@vet/ui/slider';
import { TemporaryInterface } from '../../features-home/features-home.component';

@Component({
    // eslint-disable-next-line @angular-eslint/component-selector
    selector: 'v-ui-main-slider-item',
    templateUrl: './main-slider-item.component.html',
    providers: [
        {
            provide: AbstractSliderItem,
            useExisting: forwardRef(() => MainSliderItemComponent),
        },
    ],
    // eslint-disable-next-line @angular-eslint/no-host-metadata-property
    host: {
        '[class.keen-slider__slide]': 'true',
    },
    standalone: true,
    imports: [RouterLink, NgOptimizedImage, DatePipe],
})
export class MainSliderItemComponent extends AbstractSliderItem {
    @Input() post!: TemporaryInterface;
}
