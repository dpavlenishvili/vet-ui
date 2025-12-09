import { ChangeDetectionStrategy, Component, computed, inject, input, output } from '@angular/core';
import { Router } from '@angular/router';
import { ExpandableSidebarMenuComponent } from '../expandable-sidebar-menu/expandable-sidebar-menu.component';
import { SidebarMenuItem } from '../../shared.types';
import { useCurrentUrl } from '../../shared.injectors';

@Component({
  selector: 'vet-router-expandable-sidebar-menu',
  imports: [ExpandableSidebarMenuComponent],
  templateUrl: './router-expandable-sidebar-menu.component.html',
  styleUrl: './router-expandable-sidebar-menu.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RouterExpandableSidebarMenuComponent<T extends SidebarMenuItem> {
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
