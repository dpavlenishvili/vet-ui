import {ChangeDetectionStrategy, Component, inject, signal} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {TranslocoPipe} from '@jsverse/transloco';
import {KENDO_BUTTON} from '@progress/kendo-angular-buttons';
import {KENDO_GRID} from '@progress/kendo-angular-grid';
import {KENDO_CARD} from '@progress/kendo-angular-layout';
import {DividerComponent, vetIcons} from '@vet/shared';
import {CommissionMembersDialogComponent} from './commission-members-dialog/commission-members-dialog.component';
import {UserRolesService} from '@vet/auth';
import {CommissionService, ProgramWithCommission, User} from '@vet/backend';
import {rxResource} from '@angular/core/rxjs-interop';

@Component({
  selector: 'vet-commission-members',
  imports: [KENDO_CARD, KENDO_GRID, KENDO_BUTTON, TranslocoPipe, CommissionMembersDialogComponent, DividerComponent],
  templateUrl: './commission-members.component.html',
  styleUrl: './commission-members.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommissionMembersComponent {
  activatedRoute = inject(ActivatedRoute);

  selectedProgramCode = signal('');
  selectedProgramName = signal('');
  selectedProgramCommissionMembers = signal<User[]>([]);
  vetIcons = vetIcons;

  isMembersDialogOpen = signal(false);
  userRolesService = inject(UserRolesService);
  commissionService = inject(CommissionService);

  programsWithCommissionMembers$ = rxResource({
    request: () => ({ organisation: this.userRolesService.getOrganisation() }),
    loader: ({ request: organisation }) => this.commissionService.listOfOrganisationAndCommissionMemebers(organisation),
  });

  onMemberAddClick(item: ProgramWithCommission, commissionMembers: User[]) {
    this.selectedProgramCode.set(String(item.program_id));
    this.selectedProgramName.set(String(item.program_name));
    this.isMembersDialogOpen.set(true);
    this.selectedProgramCommissionMembers.set(commissionMembers);
  }

  reloadProgramsWithCommissionMembers() {
    this.programsWithCommissionMembers$.reload();
  }

  closeDialog() {
    this.isMembersDialogOpen.set(false);
  }
}
