import { inject, ResourceRef, Signal } from '@angular/core';
import { Collection, CollectionItem, Page, PagesService } from '@vet/backend';
import { rxResource } from '@angular/core/rxjs-interop';
import { combineLatest, map, Observable, of } from 'rxjs';
import { CollectionWithItems } from './pages.types';

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

export function useCollectionsWithItems(collections: Signal<Array<Collection | undefined> | undefined>): ResourceRef<CollectionWithItems[]> {
  const pagesService = inject(PagesService);

  return rxResource({
    request: () => ({ collections: collections() }),
    defaultValue: [] as CollectionWithItems[],
    loader: ({ request: { collections } }): Observable<CollectionWithItems[]> => {
      const filteredCollections = (collections?.filter(collection => collection != null) ?? []) as Collection[];

      if (filteredCollections.length === 0) {
        return of([]);
      }

      const observables = filteredCollections.map(collection => pagesService.collectionsItems(collection.id as number).pipe(
        map((response) => ({
          ...collection,
          items: response.data ?? [],
        })),
      ));

      return combineLatest(observables);
    },
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
