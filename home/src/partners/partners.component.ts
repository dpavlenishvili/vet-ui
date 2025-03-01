import { ChangeDetectionStrategy, Component } from '@angular/core';
import { KENDO_SVGICON } from '@progress/kendo-angular-icons';
import * as kendoIcons from '@progress/kendo-svg-icons';
import { Observable, of } from 'rxjs';
import { TranslocoPipe } from '@jsverse/transloco';
import { AsyncPipe } from '@angular/common';
import { vetIcons } from '@vet/shared';

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
  vetIcons = vetIcons;

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
    imageUrl: '/assets/images/partners/61c785f9825ae302036d6eaae3935de7.jpg',
    title: 'NAMELOGO',
    subtitle: 'IT-service',
  },
  {
    imageUrl: '/assets/images/partners/297bfad129d802c0fbe5f97b14a8ef41.jpg',
    title: 'TECH',
    subtitle: 'IT-service',
  },
  {
    imageUrl: '/assets/images/partners/08fc25d51165d4bb7dbb7e2b3788b029.jpg',
    title: 'Bicycle Shop',
    subtitle: 'IT-service',
  },
  {
    imageUrl: '/assets/images/partners/1fe494e3ee8f31a63b47472c1b1de35a.jpg',
    title: 'TECHLOGO',
    subtitle: 'IT-service',
  },
  {
    imageUrl: '/assets/images/partners/297bfad129d802c0fbe5f97b14a8ef41.jpg',
    title: 'NAMELOGO',
    subtitle: 'IT-service',
  },
  {
    imageUrl: '/assets/images/partners/629e565a995de991807f8e620b718682.jpg',
    title: 'TECH',
    subtitle: 'IT-service',
  },
  {
    imageUrl: '/assets/images/partners/08fc25d51165d4bb7dbb7e2b3788b029.jpg',
    title: 'Bicycle Shop',
    subtitle: 'IT-service',
  },
  {
    imageUrl: '/assets/images/partners/b58db6be30ca33038d0a9fc46d52e9a2.jpg',
    title: 'TECHLOGO',
    subtitle: 'IT-service',
  },
  {
    imageUrl: '/assets/images/partners/61c785f9825ae302036d6eaae3935de7.jpg',
    title: 'NAMELOGO',
    subtitle: 'IT-service',
  },
  {
    imageUrl: '/assets/images/partners/297bfad129d802c0fbe5f97b14a8ef41.jpg',
    title: 'TECH',
    subtitle: 'IT-service',
  },
  {
    imageUrl: '/assets/images/partners/08fc25d51165d4bb7dbb7e2b3788b029.jpg',
    title: 'Bicycle Shop',
    subtitle: 'IT-service',
  },
  {
    imageUrl: '/assets/images/partners/1fe494e3ee8f31a63b47472c1b1de35a.jpg',
    title: 'TECHLOGO',
    subtitle: 'IT-service',
  },
];
