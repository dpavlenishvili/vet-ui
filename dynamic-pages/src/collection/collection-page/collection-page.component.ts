import { ChangeDetectionStrategy, Component, effect, inject, input } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { Meta } from '@angular/platform-browser';
import { first, map, Observable, of, switchMap } from 'rxjs';

import { CollectionItemComponent } from '../collection-item/collection-item.component';
import { type CollectionItem, type Page, PagesService } from '@vet/backend';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'vet-collection-page',
  imports: [CollectionItemComponent, AsyncPipe],
  templateUrl: './collection-page.component.html',
  styleUrl: './collection-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class CollectionPageComponent {
  page = input.required<Page>();
  collectionItems$: Observable<CollectionItem[]>;
  private pagesService = inject(PagesService);

  constructor(meta: Meta) {
    effect(() => {
      const page = this.page();
      const metaTitle = page.meta_title?.trim();
      const metaDescription = page.meta_description?.trim();

      if (metaTitle) {
        meta.updateTag({
          name: 'og-title',
          content: metaTitle,
        });
      }

      if (metaDescription) {
        meta.updateTag({
          name: 'og-description',
          content: metaDescription,
        });
      }
    });
    this.collectionItems$ = toObservable(this.page).pipe(
      map((page) => page.collection?.[0]?.id),
      switchMap((collectionId) => {
        if (collectionId == null) {
          return of([]);
        }

        return this.pagesService.collectionsItems(collectionId).pipe(map((response) => response.data ?? []));
      }),
      first(),
    );
  }
}
