import { ScrollViewComponent } from '@progress/kendo-angular-scrollview';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { useSingleOrganisation } from '../organisations.resources';
import { TranslocoPipe } from '@jsverse/transloco';
import { SVGIconComponent } from '@progress/kendo-angular-icons';
import { vetIcons } from '@vet/shared/icons';
import { FormatDatePipe } from '@vet/shared/pipes';
import { MapComponent } from '../ui/map/map.component';

@Component({
  selector: 'vet-organisation-page',
  imports: [ScrollViewComponent, TranslocoPipe, SVGIconComponent, RouterLink, MapComponent, FormatDatePipe],
  templateUrl: './organisation-page.component.html',
  styleUrl: './organisation-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrganisationPageComponent {
  private route = inject(ActivatedRoute);

  organisationId = this.route.snapshot.paramMap.get('institutionId');
  defaultImage = '/assets/images/default-org.png';

  organisation = useSingleOrganisation(Number(this.organisationId));

  longTermFilters = JSON.stringify({ organisation: Number(this.organisationId) });
  shortTermFilters = JSON.stringify({ organisation_name: Number(this.organisationId) });

  vetIcons = vetIcons;

  public width = '100%';
  public height = '500px';
}
