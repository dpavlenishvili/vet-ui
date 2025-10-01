import { ScrollViewComponent } from '@progress/kendo-angular-scrollview';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { useSingleOrganisation } from '../organisations.resources';
import { TranslocoPipe } from '@jsverse/transloco';
import { SVGIconComponent } from '@progress/kendo-angular-icons';
import { vetIcons } from '@vet/shared';

@Component({
  selector: 'vet-organisation-page',
  imports: [ScrollViewComponent, TranslocoPipe, SVGIconComponent, RouterLink],
  templateUrl: './organisation-page.component.html',
  styleUrl: './organisation-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrganisationPageComponent {
  private route = inject(ActivatedRoute);

  organisationId = this.route.snapshot.paramMap.get('institutionId');

  organisation = useSingleOrganisation(Number(this.organisationId));

  vetIcons = vetIcons;

  items = [
    { title: 'Flower', url: 'https://bit.ly/2cJjYuB' },
    { title: 'Mountain', url: 'https://bit.ly/2cTBNaL' },
    { title: 'Sky', url: 'https://bit.ly/2cJl3Cx' },
  ];
  public width = '100%';
  public height = '500px';
}
