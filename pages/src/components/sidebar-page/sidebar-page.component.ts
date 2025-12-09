import { ChangeDetectionStrategy, Component, computed, effect, input, signal } from '@angular/core';
import { Page } from '@vet/backend';
import { usePageCollection } from '@vet/pages';
import {
  ExpandableSidebarComponent,
  ExpandableSidebarMenuComponent,
  SidebarMenuItem,
  useQueryParam,
  useQueryUpdater,
  VetIcon,
  vetIcons,
} from '@vet/shared';
import { PageContentComponent } from '../page-content/page-content.component';
import { FIELDS_PAGE_SLUG } from '../../pages.constants';

@Component({
  selector: 'vet-sidebar-page',
  imports: [PageContentComponent, ExpandableSidebarMenuComponent],
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
    const page = this.page();
    console.log('page', page)
    return (
      this.collection
        .value()
        ?.sort((a, b) => Number(a.slug) - Number(b.slug))
        .map<SidebarMenuItem>((item) => {
          let icon: VetIcon = 'qualifications';

          if (page.slug === FIELDS_PAGE_SLUG) {
            const slug = 'field_' + (item.title?.split(' ')[0].trim() ?? '');
            icon = Object.keys(vetIcons).includes(slug) ? slug as VetIcon : icon;
          }

          return {
            id: String(item.id),
            icon,
            text: `${String(item.title)}`,
            url: `/pages/${this.page()?.slug}?item=${item.id}`,
            isExpanded: signal(false),
          };
        }) ?? []
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
