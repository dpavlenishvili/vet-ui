import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ShortTermUserApplicationsComponent } from '../short-term-user-applications/short-term-user-applications.component';

@Component({
  selector: 'vet-short-term-dashboard',
  imports: [ShortTermUserApplicationsComponent],
  templateUrl: './short-term-dashboard.component.html',
  styleUrl: './short-term-dashboard.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShortTermDashboardComponent {}
