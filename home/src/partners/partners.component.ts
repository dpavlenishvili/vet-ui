import { ChangeDetectionStrategy, Component } from '@angular/core';
import { KENDO_SVGICON } from '@progress/kendo-angular-icons';
import * as kendoIcons from '@progress/kendo-svg-icons';
import { Observable, of } from 'rxjs';
import { TranslocoPipe } from '@jsverse/transloco';
import { AsyncPipe } from '@angular/common';

export interface SliderItem {
  imageUrl: string;
  title: string;
  subtitle: string;
}

@Component({
  selector: 'vet-partners',
  standalone: true,
  imports: [KENDO_SVGICON, TranslocoPipe, AsyncPipe],
  templateUrl: './partners.component.html',
  styleUrls: ['./partners.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PartnersComponent {
  readonly kendoIcons = kendoIcons;

  public sliderData$: Observable<SliderItem[]> = of(sliderItems);

  scrollLeft(container: HTMLElement) {
    container.scrollBy({ left: -300, behavior: 'smooth' });
  }

  scrollRight(container: HTMLElement) {
    container.scrollBy({ left: 300, behavior: 'smooth' });
  }
}

export const sliderItems = [
  {
    imageUrl: 'https://cdn.prod.website-files.com/65943d23dc44e6ce92eb6b67/65fdef4ec320a0bbac89222e_amazon_logo.png',
    title: 'NAMELOGO',
    subtitle: 'IT-service',
  },
  {
    imageUrl: 'https://cdn.prod.website-files.com/65943d23dc44e6ce92eb6b67/65fdef4e9151de118ca4e48f_gatik_logo.png',
    title: 'TECH',
    subtitle: 'IT-service',
  },
  {
    imageUrl:
      'https://cdn.prod.website-files.com/65943d23dc44e6ce92eb6b67/65fdf1587d4c137728ae012a_canadian_tire_logo.png',
    title: 'Bicycle Shop',
    subtitle: 'IT-service',
  },
  {
    imageUrl: 'https://cdn.prod.website-files.com/65943d23dc44e6ce92eb6b67/65fdef4e686502959d8139d7_lime_logo.png',
    title: 'TECHLOGO',
    subtitle: 'IT-service',
  },
  {
    imageUrl: 'https://cdn.prod.website-files.com/65943d23dc44e6ce92eb6b67/65fdef4ec320a0bbac89222e_amazon_logo.png',
    title: 'NAMELOGO',
    subtitle: 'IT-service',
  },
  {
    imageUrl: 'https://cdn.prod.website-files.com/65943d23dc44e6ce92eb6b67/65fdef4e9151de118ca4e48f_gatik_logo.png',
    title: 'TECH',
    subtitle: 'IT-service',
  },
  {
    imageUrl:
      'https://cdn.prod.website-files.com/65943d23dc44e6ce92eb6b67/65fdf1587d4c137728ae012a_canadian_tire_logo.png',
    title: 'Bicycle Shop',
    subtitle: 'IT-service',
  },
  {
    imageUrl: 'https://cdn.prod.website-files.com/65943d23dc44e6ce92eb6b67/65fdef4e686502959d8139d7_lime_logo.png',
    title: 'TECHLOGO',
    subtitle: 'IT-service',
  },
  {
    imageUrl: 'https://cdn.prod.website-files.com/65943d23dc44e6ce92eb6b67/65fdef4ec320a0bbac89222e_amazon_logo.png',
    title: 'NAMELOGO',
    subtitle: 'IT-service',
  },
  {
    imageUrl: 'https://cdn.prod.website-files.com/65943d23dc44e6ce92eb6b67/65fdef4e9151de118ca4e48f_gatik_logo.png',
    title: 'TECH',
    subtitle: 'IT-service',
  },
  {
    imageUrl:
      'https://cdn.prod.website-files.com/65943d23dc44e6ce92eb6b67/65fdf1587d4c137728ae012a_canadian_tire_logo.png',
    title: 'Bicycle Shop',
    subtitle: 'IT-service',
  },
  {
    imageUrl: 'https://cdn.prod.website-files.com/65943d23dc44e6ce92eb6b67/65fdef4e686502959d8139d7_lime_logo.png',
    title: 'TECHLOGO',
    subtitle: 'IT-service',
  },
];
