import { computed, effect, Signal } from '@angular/core';
import { CollectionItem, Page } from '@vet/backend';
import { useCollectionsWithItems } from '@vet/pages';

export interface NavigationPageUpdateParams {
  collection?: string | number | null | undefined;
  item?: string | number | null | undefined;
}

export interface UseNavigationPageStateParams {
  page: Signal<Page>;
  collectionId: Signal<number | null>;
  itemId: Signal<number | null>;
  onUpdate: (params: NavigationPageUpdateParams) => void;
}

export function useNavigationPageState(params: UseNavigationPageStateParams) {
  const { page, collectionId, itemId, onUpdate } = params;

  const rawCollections = computed(() => page()?.collection);
  const collections = useCollectionsWithItems(rawCollections);
  const tabCollections = computed(() => {
    return collections.value()
      .filter(collection => collection.type === 'tabs' && collection.items.length > 0)
      .sort((a, b) => Number(a.id) - Number(b.id)) ?? [];
  });
  const activeCollection = computed(() => {
    const _activeCollectionId = collectionId();
    return tabCollections().find((i) => i.id === _activeCollectionId);
  });
  const activeTabItems = computed(() => {
    return (activeCollection()?.items ?? []) as CollectionItem[];
  });
  const activeTab = computed(() => {
    const _activeTabId = itemId();

    return activeTabItems().find(item => item.id === _activeTabId);
  });
  const update = (params: NavigationPageUpdateParams) => {
    let _collectionId = params.collection;
    let _itemId = params.item;

    // First, try to get existing collection ID
    if (!_collectionId) {
      _collectionId = collectionId();
    }

    // If not found, get ID of the first collection
    if (!_collectionId) {
      const firstCollection = tabCollections()?.[0];
      if (firstCollection) _collectionId = firstCollection.id;
    }

    // If collection found, validate tabID
    if (_collectionId) {
      const collection = tabCollections().find((i) => i.id === _collectionId);
      const collectionTabIds = collection?.items?.map((i) => i.id) ?? [];
      const shouldResetTab = !_itemId || !collectionTabIds?.includes(Number(_itemId));

      // If tabId is absent, or it's invalid, reset it to the first tab ID of the
      // selected collection
      if (shouldResetTab && collection && collection.items.length > 0) {
        _itemId = Number(collection.items[0].id);
      }
    }

    // Update only if final collectionId or tabId is different from the original ones
    if (_collectionId !== collectionId() || _itemId !== itemId()) {
      onUpdate({
        collection: _collectionId,
        item: _itemId,
      });
    }
  };

  effect(() => {
    // Ensure initial collectionId and tabId are set
    // In other cases, ensure that the collectionId and tabId are correct,
    // if not, reset.
    update({
      collection: collectionId(),
      item: itemId(),
    });
  });

  return {
    activeCollectionId: collectionId,
    activeTabId: itemId,
    isLoading: collections.isLoading,
    tabCollections,
    activeCollection,
    activeTabItems,
    activeTab,
    update,
  };
}
