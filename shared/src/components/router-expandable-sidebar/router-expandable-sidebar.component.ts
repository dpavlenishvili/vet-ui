import { ChangeDetectionStrategy, Component, computed, inject, input, output } from '@angular/core';
import { Router } from '@angular/router';
import { ExpandableSidebarComponent, SidebarMenuItem, useCurrentUrl } from '@vet/shared';

@Component({
  selector: 'vet-router-expandable-sidebar',
  imports: [ExpandableSidebarComponent],
  templateUrl: './router-expandable-sidebar.component.html',
  styleUrl: './router-expandable-sidebar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RouterExpandableSidebarComponent<T extends SidebarMenuItem> {
  items = input.required<T[]>();
  itemClick = output<T>();

  router = inject(Router);
  currentUrl = useCurrentUrl();

  activeItemId = computed(() => {
    const currentUrl = this.currentUrl()?.split('?')[0];
    const items = this.items();

    return items.find((item) => item.url && currentUrl.endsWith(item.url))?.id;
  });
}
