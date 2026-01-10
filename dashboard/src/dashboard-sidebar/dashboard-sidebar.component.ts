import { ChangeDetectionStrategy, Component } from '@angular/core';
import { useDashboardMenu } from '../menu/dashboard.items';
import { RouterExpandableSidebarMenuComponent } from '../../../apps/vet/src/app/shell/sidebar/router-expandable-sidebar-menu/router-expandable-sidebar-menu.component';

@Component({
  selector: 'vet-dashboard-sidebar',
  imports: [RouterExpandableSidebarMenuComponent],
  templateUrl: './dashboard-sidebar.component.html',
  styleUrl: './dashboard-sidebar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardSidebarComponent {
  items = useDashboardMenu();
}
