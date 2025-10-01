import { ChangeDetectionStrategy, Component, inject, input, output, signal } from '@angular/core';
import { Router } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';
import { TooltipDirective } from '@progress/kendo-angular-tooltip';
import { IconButtonComponent, IconComponent, SidebarMenuItem } from '@vet/shared';
import { HasAccessPipe, useAccessControl } from '@vet/auth';

@Component({
  selector: 'vet-expandable-sidebar',
  imports: [TranslocoPipe, TooltipDirective, IconComponent, IconButtonComponent, HasAccessPipe],
  templateUrl: './expandable-sidebar.component.html',
  styleUrl: './expandable-sidebar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExpandableSidebarComponent<T extends SidebarMenuItem> {
  items = input.required<T[]>();
  activeItemId = input<string | null | undefined>(null);
  menuCollapsible = input(true);
  itemClick = output<T>();

  router = inject(Router);
  isExpanded = signal(true);
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
