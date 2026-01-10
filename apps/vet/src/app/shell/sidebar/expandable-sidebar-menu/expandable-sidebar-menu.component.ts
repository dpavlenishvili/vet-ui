import { ChangeDetectionStrategy, Component, inject, input, model, output } from '@angular/core';
import { Router } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';
import { TooltipDirective } from '@progress/kendo-angular-tooltip';
import { HasAccessPipe, useAccessControl } from '@vet/auth';
import { IconComponent, ExpandableSidebarComponent } from '@vet/shared';
import { SidebarMenuItem } from '../sidebar-menu-item.type';

@Component({
  selector: 'vet-expandable-sidebar-menu',
  imports: [TranslocoPipe, TooltipDirective, IconComponent, HasAccessPipe, ExpandableSidebarComponent],
  templateUrl: './expandable-sidebar-menu.component.html',
  styleUrl: './expandable-sidebar-menu.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExpandableSidebarMenuComponent<T extends SidebarMenuItem> {
  items = input.required<T[]>();
  activeItemId = input<string | number | null | undefined>(null);
  menuCollapsible = input(true);
  itemClick = output<T>();

  router = inject(Router);
  isExpanded = model(true);
  hasAccess = useAccessControl();

  isItemHighlighted(item: T) {
    return !this.isExpanded() || item.isExpanded?.();
  }

  isActive(item: T) {
    return item.id === this.activeItemId();
  }

  onToggleExpansion() {
    this.isExpanded.update((value) => !value);

    if (!this.isExpanded()) {
      this.items().forEach((item) => {
        item.isExpanded?.set(false);
      });
    }
  }

  onItemClick(target: T) {
    const availableItems = target.children?.filter((child) => this.hasAccess(child.accessControl)());

    if (availableItems?.length) {
      if (!target.isExpanded?.() && !this.isExpanded()) {
        this.onToggleExpansion();
      }

      this.items().forEach((item) => {
        if (item.id === target.id) {
          item.isExpanded?.update((value) => !value);
        } else {
          item.isExpanded?.set(false);
        }
      });
    }

    this.handleClick(target);
  }

  onChildItemClick(target: T) {
    this.handleClick(target);
  }

  private handleClick(item: T) {
    this.itemClick.emit(item);

    if (item.url) {
      void this.router.navigateByUrl(item.url);
    }
  }
}
