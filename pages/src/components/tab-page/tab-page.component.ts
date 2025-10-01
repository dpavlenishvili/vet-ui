import { ChangeDetectionStrategy, Component, computed, effect, input } from '@angular/core';
import { CollectionItem, Page } from '@vet/backend';
import { usePageCollection } from '@vet/pages';
import { useQueryParam, useQueryUpdater } from '@vet/shared';
import { PageContentComponent } from '../page-content/page-content.component';

@Component({
  selector: 'vet-tab-page',
  imports: [PageContentComponent],
  templateUrl: './tab-page.component.html',
  styleUrl: './tab-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class TabPageComponent {
  page = input.required<Page>();

  activeTabId = useQueryParam('tab');
  updateQuery = useQueryUpdater();
  collectionId = computed(() => this.page()?.collection?.[0]?.id);
  collection = usePageCollection(this.collectionId);
  activeTabIndex = computed(() => {
    const activeTabId = this.activeTabId();
    return this.collection.value()?.findIndex((i) => String(i.id) === String(activeTabId)) ?? 0;
  });

  constructor() {
    effect(() => {
      const firstTabId = this.collection.value()?.[0].id;

      if (!this.activeTabId() && firstTabId) {
        this.updateQuery({
          tab: firstTabId,
        });
      }
    });
  }

  onTabClick(item: CollectionItem) {
    this.updateQuery({ tab: item.id });
  }
}
