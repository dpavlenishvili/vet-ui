import { ChangeDetectionStrategy, Component } from '@angular/core';
import { useDashboardMenu } from '../menu/dashboard.items';
import { RouterExpandableSidebarComponent } from '@vet/shared';

@Component({
  selector: 'vet-dashboard-sidebar',
  imports: [RouterExpandableSidebarComponent],
  templateUrl: './dashboard-sidebar.component.html',
  styleUrl: './dashboard-sidebar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardSidebarComponent {
  items = useDashboardMenu();
}
