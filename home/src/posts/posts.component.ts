import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { KENDO_SCROLLVIEW } from '@progress/kendo-angular-scrollview';

export interface Item {
  date: string;
  title: string;
  description: string;
  imageUrl: string;
}

// Example data; use real data or move to separate file
export const data = [
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
  styleUrls: ['./posts.component.scss'], // plural "styles" is typical in Angular
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PostsComponent {
  @Input() items: Item[] = data; // Optionally accept items via Input
  public width = '100%';
  public height = '370px';
}
