import { Component, Input, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SvgIconComponent } from 'angular-svg-icon';
import { MainSliderItemComponent } from './main-slider-item/main-slider-item.component';
import { SliderComponent } from '@vet/ui/slider';
import { CollectionItem } from '@vet/backend';

@Component({
    // eslint-disable-next-line @angular-eslint/component-selector
    selector: 'v-ui-main-slider',
    standalone: true,
    imports: [CommonModule, RouterLink, SvgIconComponent, MainSliderItemComponent, SliderComponent],
    templateUrl: './main-slider.component.html',
    styleUrl: './main-slider.component.scss',
    encapsulation: ViewEncapsulation.None,
})
export class MainSliderComponent {
    @Input() posts: CollectionItem[] | undefined = [];
    currentActiveElementIndex = 0;
}
