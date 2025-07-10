import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RolePipe } from '@vet/auth';
import {
  ShortTermUserApplicationsComponent
} from '../short-term-user-applications/short-term-user-applications.component';
import {
  ShortTermRegisteredListenersComponent
} from '../short-term-registered-listeners/short-term-registered-listeners.component';

@Component({
  selector: 'vet-short-term-dashboard',
  imports: [RolePipe, ShortTermUserApplicationsComponent, ShortTermRegisteredListenersComponent],
  templateUrl: './short-term-dashboard.component.html',
  styleUrl: './short-term-dashboard.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShortTermDashboardComponent {}
