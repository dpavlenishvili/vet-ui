import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { Page } from '@vet/backend';
import { usePageCollection } from '@vet/pages';
import { CollectionItemComponent } from '../collection-item/collection-item.component';

@Component({
  selector: 'vet-collection-page',
  imports: [CollectionItemComponent],
  templateUrl: './collection-page.component.html',
  styleUrl: './collection-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class CollectionPageComponent {
  page = input.required<Page>();
  collectionId = computed(() => this.page()?.collection?.[0]?.id);
  collection = usePageCollection(this.collectionId);
}
