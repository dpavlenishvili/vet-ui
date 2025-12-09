import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';
import { CollectionItem, Page } from '@vet/backend';
import { ExpandableSidebarMenuComponent, SidebarMenuItem, useNumberQueryParam, useQueryUpdater } from '@vet/shared';
import { PageContentComponent } from '../page-content/page-content.component';
import { useNavigationPageState } from './navigation-page.resources';

@Component({
  selector: 'vet-navigation-page',
  imports: [PageContentComponent, ExpandableSidebarMenuComponent],
  templateUrl: './navigation-page.component.html',
  styleUrl: './navigation-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class NavigationPageComponent {
  page = input.required<Page>();

  state = useNavigationPageState({
    page: this.page,
    collectionId: useNumberQueryParam('collection'),
    itemId: useNumberQueryParam('item'),
    onUpdate: useQueryUpdater(),
  });
  sidebarItems = computed(() => {
    return (
      this.state.tabCollections().map<SidebarMenuItem>((item) => ({
        id: Number(item.id),
        icon: 'qualifications',
        text: String(item.name),
        url: `/pages/${this.page()?.slug}?collection=${item.id}`,
        isExpanded: signal(false),
      })) ?? []
    );
  });

  onSidebarItemClick(item: SidebarMenuItem) {
    this.state.update({ collection: item.id });
  }

  onTabClick(item: CollectionItem) {
    this.state.update({ item: item.id });
  }
}
