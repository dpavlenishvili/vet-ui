import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LongTermProgramsSidebarComponent } from '../long-term-programs-sidebar/long-term-programs-sidebar.component';

@Component({
  selector: 'vet-long-term-programs-sidebar-layout',
  imports: [RouterOutlet, LongTermProgramsSidebarComponent],
  templateUrl: './long-term-programs-sidebar-layout.component.html',
  styleUrl: './long-term-programs-sidebar-layout.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class LongTermProgramsSidebarLayoutComponent {}
