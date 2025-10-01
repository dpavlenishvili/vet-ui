import { ChangeDetectionStrategy, Component } from '@angular/core';
import { OrganisationsListComponent } from './organisations-list/organisations-list.component';

@Component({
  selector: 'vet-organisations',
  imports: [OrganisationsListComponent],
  templateUrl: './organisations.component.html',
  styleUrl: './organisations.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrganisationsComponent {}
