import { AfterViewInit, ChangeDetectionStrategy, Component, input, viewChild } from '@angular/core';
import { KENDO_SCROLLVIEW, ScrollViewComponent } from '@progress/kendo-angular-scrollview';
import { vetIcons } from '@vet/shared';

export interface Item {
  date: string;
  title: string;
  description: string;
  imageUrl: string;
}

// Example data; use real data or move to separate file
export const data: Item[] = [
  {
    date: '18.04.2023',
    title: 'პროფესიულ საგანმანათლებლო პროგრამებზე რეგისტრაციის მეორე ეტაპი დაიწყო',
    description: `2022 წელს, დარჩენილი თავისუფალი ადგილების შევსების მიზნით
                      გამოცხადებული მიღების ფარგლებში, შერჩევის პროცესში ჩართვის
                      შესაძლებლობა აქვს ნებისმიერ დაინტერესებულ პირს 14 - დან 18
                      ოქტომბრის ჩათვლით.`,
    imageUrl: 'https://bit.ly/2cJjYuB',
  },
  {
    date: '15.05.2023',
    title: 'Digital Skills for Modern Education',
    description: 'Empowering individuals with critical skills for modern challenges.',
    imageUrl: 'https://bit.ly/2cJjYuB',
  },
];

@Component({
  selector: 'vet-posts',
  standalone: true,
  imports: [KENDO_SCROLLVIEW],
  templateUrl: './posts.component.html',
  styleUrl: './posts.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PostsComponent implements AfterViewInit {
  readonly items = input<Item[]>(data);
  protected readonly width = '100%';
  protected readonly height = '370px';

  scrollViewComponent = viewChild<ScrollViewComponent>('scrollViewComponent');

  ngAfterViewInit() {
    const scrollViewComponent = this.scrollViewComponent();

    if (scrollViewComponent) {
      scrollViewComponent.chevronLeftIcon = vetIcons.previousLarge;
      scrollViewComponent.chevronRightIcon = vetIcons.nextLarge;
    }
  }
}
