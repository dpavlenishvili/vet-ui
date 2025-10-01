import { ChangeDetectionStrategy, Component, computed, effect, input, signal } from '@angular/core';
import { Page } from '@vet/backend';
import { usePageCollection } from '@vet/pages';
import { ExpandableSidebarComponent, SidebarMenuItem, useQueryParam, useQueryUpdater } from '@vet/shared';
import { PageContentComponent } from '../page-content/page-content.component';

@Component({
  selector: 'vet-sidebar-page',
  imports: [ExpandableSidebarComponent, PageContentComponent],
  templateUrl: './sidebar-page.component.html',
  styleUrl: './sidebar-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class SidebarPageComponent {
  page = input.required<Page>();

  activeItemId = useQueryParam('item');
  updateQuery = useQueryUpdater();
  collectionId = computed(() => this.page()?.collection?.[0]?.id);
  collection = usePageCollection(this.collectionId);
  sidebarItems = computed(() => {
    return (
      this.collection
        .value()
        ?.sort((a, b) => Number(a.slug) - Number(b.slug))
        .map<SidebarMenuItem>((item) => ({
          id: String(item.id),
          icon: 'qualifications',
          text: `${String(item.title)}`,
          url: `/pages/${this.page()?.slug}?item=${item.id}`,
          isExpanded: signal(false),
        })) ?? []
    );
  });
  activeItem = computed(() => {
    const activeItemId = this.activeItemId();
    return this.collection.value()?.find((item) => String(item.id) === activeItemId);
  });

  constructor() {
    effect(() => {
      const firstItemId = this.sidebarItems()?.[0]?.id;

      if (!this.activeItemId() && firstItemId) {
        this.updateQuery({
          item: firstItemId,
        });
      }
    });
  }

  onItemClick(item: SidebarMenuItem) {
    this.updateQuery({
      item: item.id,
    });
  }
}
