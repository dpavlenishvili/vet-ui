import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { Observable, switchMap } from 'rxjs';
import { CollectionItem, PagesService } from '@vet/backend';

@Component({
  selector: 'vet-collection-item-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './collection-item-page.component.html',
  styleUrl: './collection-item-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CollectionItemPageComponent {
  itemSlug = input.required<`${string}---${number}`>();
  collectionId = computed(() => parseInt(this.itemSlug().split('---')[1]));

  protected collectionItem$: Observable<CollectionItem>;

  private pagesService = inject(PagesService);

  constructor() {
    this.collectionItem$ = toObservable(this.collectionId).pipe(
      switchMap((collectionId) =>
        this.pagesService.getSingleCollectionItem(collectionId)
      )
    );
  }
}
