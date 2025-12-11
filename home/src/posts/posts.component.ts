import { AfterViewInit, ChangeDetectionStrategy, Component, computed, inject, viewChild } from '@angular/core';
import { KENDO_SCROLLVIEW, ScrollViewComponent } from '@progress/kendo-angular-scrollview';
import { vetIcons } from '@vet/shared/icons';
import { UploadedFileUriPipe } from '@vet/shared/pipes';
import { usePageCollection, usePages } from '@vet/pages';
import { DatePipe, SlicePipe } from '@angular/common';
import { PageContentComponent } from '../../../pages/src/components/page-content/page-content.component';
import { Router } from '@angular/router';
import { CollectionItem } from '@vet/backend';

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
  imports: [KENDO_SCROLLVIEW, UploadedFileUriPipe, DatePipe, PageContentComponent, SlicePipe],
  templateUrl: './posts.component.html',
  styleUrl: './posts.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PostsComponent implements AfterViewInit {
  protected readonly width = '100%';
  protected readonly height = '370px';

  private readonly _router = inject(Router);

  pages = usePages();
  collectionId = computed(
    () =>
      this.pages
        .value()
        .flatMap((page) => page.collection ?? [])
        .find((collection) => collection.type === 'articles')?.id,
  );
  items = usePageCollection(this.collectionId);
  pinnedItems = computed(() => this.items.value().filter((item) => !!item.pin));

  scrollViewComponent = viewChild<ScrollViewComponent>('scrollViewComponent');

  ngAfterViewInit() {
    const scrollViewComponent = this.scrollViewComponent();

    if (scrollViewComponent) {
      scrollViewComponent.chevronLeftIcon = vetIcons.previousLarge;
      scrollViewComponent.chevronRightIcon = vetIcons.nextLarge;
    }
  }

  navigateToArticle(item: CollectionItem): void {
    const parentPage = this.pages.value().find((page) => page.collection?.some((c) => c.type === 'articles'));

    this._router.navigate(['/article', item.id], {
      state: {
        parentPageSlug: parentPage?.slug,
        parentPageTitle: parentPage?.title,
      },
    });
  }
}
