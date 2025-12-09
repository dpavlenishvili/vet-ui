import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { IconButtonComponent } from '../icon-button';

@Component({
  selector: 'vet-expandable-sidebar',
  imports: [IconButtonComponent],
  templateUrl: './expandable-sidebar.component.html',
  styleUrl: './expandable-sidebar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExpandableSidebarComponent {
  menuCollapsible = input(true);
  isExpanded = input(true);
  isExpandedChange = output<boolean>();

  onToggleExpansion() {
    const isExpanded = this.isExpanded();
    this.isExpandedChange.emit(!isExpanded);
  }
}
