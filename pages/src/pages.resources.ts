import { inject, ResourceRef, Signal } from '@angular/core';
import { CollectionItem, Page, PagesService } from '@vet/backend';
import { rxResource } from '@angular/core/rxjs-interop';
import { map, Observable, of } from 'rxjs';

export function usePages() {
  const pagesService = inject(PagesService);

  return rxResource({
    defaultValue: [] as Page[],
    loader: (): Observable<Page[]> =>
      pagesService.getPagesList().pipe(
        map((response) => response?.data ?? []),
        map((pages) => {
          return pages.slice(0).sort((a, b) => {
            return (a.position ?? Infinity) - (b.position ?? Infinity);
          });
        }),
      ),
  });
}

export function usePageCollection(collectionId: Signal<number | undefined>): ResourceRef<CollectionItem[]> {
  const pagesService = inject(PagesService);

  return rxResource({
    request: () => ({ collectionId: collectionId() }),
    defaultValue: [] as CollectionItem[],
    loader: ({ request: { collectionId } }): Observable<CollectionItem[]> => {
      if (!collectionId) {
        return of([]);
      }

      return pagesService.collectionsItems(collectionId).pipe(map((response) => response.data ?? []));
    },
  });
}

export function usePageCollectionItem(itemId: Signal<number | undefined>): ResourceRef<any | null> {
  const pagesService = inject(PagesService);

  return rxResource({
    request: () => ({ itemId: itemId() }),
    defaultValue: null as any | null,
    loader: ({ request: { itemId } }): Observable<any | null> => {
      if (!itemId) {
        return of(null);
      }

      return pagesService.getSingleCollectionItem(itemId).pipe(
        map((response) => (response as any).data)
      );
    },
  });
}
