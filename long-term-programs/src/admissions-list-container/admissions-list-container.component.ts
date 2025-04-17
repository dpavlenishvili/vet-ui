import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RolePipe, UserRolesService } from '@vet/auth';
import { AdmissionsListAdminComponent } from '../admissions-list-admin/admissions-list-admin.component';
import { AdmissionsListComponent } from '../admissions-list/admissions-list.component';

@Component({
  selector: 'vet-admissions-list-container',
  imports: [RolePipe, AdmissionsListAdminComponent, AdmissionsListComponent],
  templateUrl: './admissions-list-container.component.html',
  styleUrl: './admissions-list-container.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class AdmissionsListContainerComponent {
  selectedAccount = inject(UserRolesService).selectedAccount;
}
