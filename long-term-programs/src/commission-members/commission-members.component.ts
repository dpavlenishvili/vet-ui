import { KENDO_SVGICON } from '@progress/kendo-angular-icons';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';
import { KENDO_BUTTON } from '@progress/kendo-angular-buttons';
import { KENDO_GRID } from '@progress/kendo-angular-grid';
import { DividerComponent, useAlert, vetIcons } from '@vet/shared';
import { CommissionMembersDialogComponent } from './commission-members-dialog/commission-members-dialog.component';
import { UserRolesService } from '@vet/auth';
import { CommissionService, ProgramWithCommission, User } from '@vet/backend';
import { rxResource } from '@angular/core/rxjs-interop';

@Component({
  selector: 'vet-commission-members',
  imports: [KENDO_GRID, KENDO_BUTTON, KENDO_SVGICON, TranslocoPipe, CommissionMembersDialogComponent, DividerComponent],
  templateUrl: './commission-members.component.html',
  styleUrl: './commission-members.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommissionMembersComponent {
  activatedRoute = inject(ActivatedRoute);

  selectedProgramId = signal('');
  selectedProgramCode = signal('');
  selectedProgramName = signal('');
  selectedProgramCommissionMembers = signal<User[]>([]);
  vetIcons = vetIcons;

  isMembersDialogOpen = signal(false);
  userRolesService = inject(UserRolesService);
  commissionService = inject(CommissionService);

  private alert = useAlert();

  programsWithCommissionMembers$ = rxResource({
    request: () => ({ organisation: this.userRolesService.getOrganisation() }),
    loader: ({ request: organisation }) => this.commissionService.listOfOrganisationAndCommissionMemebers(organisation),
  });

  onMemberAddClick(item: ProgramWithCommission, commissionMembers: User[]) {
    this.selectedProgramId.set(String(item.program_id));
    this.selectedProgramCode.set(String(item.program_code));
    this.selectedProgramName.set(String(item.program_name));
    this.isMembersDialogOpen.set(true);
    this.selectedProgramCommissionMembers.set(commissionMembers);
  }

  reloadProgramsWithCommissionMembers() {
    this.programsWithCommissionMembers$.reload();
  }

  closeDialogWithWarning() {
    this.isMembersDialogOpen.set(false);
    this.alert.show({
      text: 'programs.commission_member_not_added',
      variant: 'warning',
    });
  }

  closeDialog() {
    this.isMembersDialogOpen.set(false);
  }
}
