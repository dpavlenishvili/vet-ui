import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { Observable, switchMap } from 'rxjs';
import { CollectionItem, PagesService } from '@vet/backend';
import { AsyncPipe, JsonPipe } from '@angular/common';

@Component({
  selector: 'vet-collection-item-page',
  templateUrl: './collection-item-page.component.html',
  styleUrl: './collection-item-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AsyncPipe, JsonPipe],
})
export class CollectionItemPageComponent {
  itemSlug = input.required<`${string}---${number}`>();
  collectionId = computed(() => parseInt(this.itemSlug().split('---')[1]));

  protected collectionItem$: Observable<CollectionItem>;

  private pagesService = inject(PagesService);

  constructor() {
    this.collectionItem$ = toObservable(this.collectionId).pipe(
      switchMap((collectionId) => this.pagesService.getSingleCollectionItem(collectionId)),
    );
  }
}
