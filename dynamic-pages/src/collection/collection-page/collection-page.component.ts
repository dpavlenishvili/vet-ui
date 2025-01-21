import { ChangeDetectionStrategy, Component, effect, inject, input } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { Meta } from '@angular/platform-browser';
import { first, map, Observable, switchMap } from 'rxjs';

import { CollectionItemComponent } from '../collection-item/collection-item.component';
import { CollectionItem, Page, PagesService } from '@vet/backend';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'vet-collection-page',
  imports: [CollectionItemComponent, AsyncPipe],
  templateUrl: './collection-page.component.html',
  styleUrl: './collection-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true
})
export class CollectionPageComponent {
  page = input.required<Page>();
  collectionItems$: Observable<CollectionItem[]>;
  private pagesService = inject(PagesService);

  constructor(meta: Meta) {
    effect(() => {
      meta.updateTag({
        name: 'og-title',
        content: this.page().meta_title!,
      });
      meta.updateTag({
        name: 'og-description',
        content: this.page().meta_description!,
      });
    });
    this.collectionItems$ = toObservable(this.page).pipe(
      switchMap((page) => this.pagesService.collectionsItems(page.collection_id!)),
      map((response) => response.data!),
      first(),
    );
  }
}
