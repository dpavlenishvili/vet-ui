import { ChangeDetectionStrategy, Component } from '@angular/core';
import { useDashboardMenu } from '../menu/dashboard.items';
import { RouterExpandableSidebarMenuComponent } from '@vet/shared/ui-components';

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
