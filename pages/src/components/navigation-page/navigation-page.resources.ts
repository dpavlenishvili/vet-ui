import { computed, effect, Signal } from '@angular/core';
import { CollectionItem, Page } from '@vet/backend';
import { useCollectionsWithItems } from '@vet/pages';

export interface NavigationPageUpdateParams {
  collection?: string | number | null | undefined;
  tab?: string | number | null | undefined;
}

export interface UseNavigationPageStateParams {
  page: Signal<Page>;
  collectionId: Signal<number | null>;
  tabId: Signal<number | null>;
  onUpdate: (params: NavigationPageUpdateParams) => void;
}

export function useNavigationPageState(params: UseNavigationPageStateParams) {
  const { page, collectionId, tabId, onUpdate } = params;

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
    const _activeTabId = tabId();

    return activeTabItems().find(item => item.id === _activeTabId);
  });
  const update = (params: NavigationPageUpdateParams) => {
    let _collectionId = params.collection;
    let _tabId = params.tab;

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
      const shouldResetTab = !_tabId || !collectionTabIds?.includes(Number(_tabId));

      // If tabId is absent, or it's invalid, reset it to the first tab ID of the
      // selected collection
      if (shouldResetTab && collection && collection.items.length > 0) {
        _tabId = Number(collection.items[0].id);
      }
    }

    // Update only if final collectionId or tabId is different from the original ones
    if (_collectionId !== collectionId() || _tabId !== tabId()) {
      onUpdate({
        collection: _collectionId,
        tab: _tabId,
      });
    }
  };

  effect(() => {
    // Ensure initial collectionId and tabId are set
    // In other cases, ensure that the collectionId and tabId are correct,
    // if not, reset.
    update({
      collection: collectionId(),
      tab: tabId(),
    });
  });

  return {
    activeCollectionId: collectionId,
    activeTabId: tabId,
    isLoading: collections.isLoading,
    tabCollections,
    activeCollection,
    activeTabItems,
    activeTab,
    update,
  };
}
