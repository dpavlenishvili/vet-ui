import { Collection, CollectionItem } from '@vet/backend';

export interface CollectionWithItems extends Collection {
  items: CollectionItem[];
}
