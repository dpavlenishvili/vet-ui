import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';
import { TooltipDirective } from '@progress/kendo-angular-tooltip';
import { DashboardSidebarMenuItem, DashboardSidebarMenuItemBase } from '../dashboard.types';
import { useDashboardMenu } from '../menu/dashboard.items';
import { IconButtonComponent, IconComponent, useCurrentUrl } from '@vet/shared';
import { HasAccessPipe, useAccessControl } from '@vet/auth';

@Component({
  selector: 'vet-dashboard-sidebar',
  imports: [RouterLink, TranslocoPipe, TooltipDirective, IconComponent, IconButtonComponent, HasAccessPipe],
  templateUrl: './dashboard-sidebar.component.html',
  styleUrl: './dashboard-sidebar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardSidebarComponent {
  router = inject(Router);
  isExpanded = signal(true);
  items = useDashboardMenu();
  currentUrl = useCurrentUrl();
  hasAccess = useAccessControl();

  isItemHighlighted(item: DashboardSidebarMenuItem) {
    return !this.isExpanded() || item.isExpanded();
  }

  isActive(item: DashboardSidebarMenuItemBase) {
    return item.url && this.currentUrl()?.split('?')[0]?.endsWith(item.url);
  }

  onToggleExpansion() {
    this.isExpanded.update((value) => !value);

    if (!this.isExpanded()) {
      this.items().forEach((item) => {
        item.isExpanded.set(false);
      });
    }
  }

  onItemClick(target: DashboardSidebarMenuItem) {
    const availableItems = target.children?.filter(child => this.hasAccess(child.accessControl)());

    if (availableItems?.length) {
      if (!target.isExpanded() && !this.isExpanded()) {
        this.onToggleExpansion();
      }

      this.items().forEach((item) => {
        if (item.id === target.id) {
          item.isExpanded.update((value) => !value);
        } else {
          item.isExpanded.set(false);
        }
      });
    }
  }
}
