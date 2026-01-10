/* eslint-disable no-restricted-globals */
import { ChangeDetectionStrategy, Component, effect, signal, OnDestroy, inject } from '@angular/core';
import { SVGIconComponent } from '@progress/kendo-angular-icons';
import { useFilters, useFiltersUpdater } from '@vet/shared/utils';
import { vetIcons } from '@vet/shared/icons';
import { ButtonComponent, DividerComponent } from '@vet/shared';
import { Organisation, OrganisationFilters } from '../organisations.types';
import { useOrganisationsList } from '../organisations.resources';
import { LoaderComponent } from '@progress/kendo-angular-indicators';
import { OrganisationsListFiltersComponent } from '../organisations-list-filters/organisations-list-filters.component';
import { TranslocoPipe } from '@jsverse/transloco';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'vet-organisations-list',
  imports: [
    DividerComponent,
    SVGIconComponent,
    LoaderComponent,
    OrganisationsListFiltersComponent,
    TranslocoPipe,
    ButtonComponent,
  ],
  templateUrl: './organisations-list.component.html',
  styleUrl: './organisations-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrganisationsListComponent implements OnDestroy {
  filters = useFilters<OrganisationFilters>();
  updateFilters = useFiltersUpdater<OrganisationFilters>();

  page = signal(1);
  perPage = 5;
  vetIcons = vetIcons;
  defaultImage = '/assets/images/default-org.png';

  organisationsResource = useOrganisationsList(this.filters, this.page, this.perPage);
  allOrganisations = signal<Organisation[]>([]);
  totalOrganisations = signal<number>(0);

  private scrollHandler = () => this.onScroll();

  private router = inject(Router);

  constructor() {
    effect(() => {
      this.filters();
      this.page.set(1);
      this.allOrganisations.set([]);
    });

    effect(() => {
      const res = this.organisationsResource?.value?.();
      if (!res?.data) return;

      this.allOrganisations.update((prev) => {
        if (this.page() === 1) return res.data!;
        return [...prev, ...res.data!];
      });

      this.totalOrganisations.update(() => res.meta?.total ?? 0);
    });

    window.addEventListener('scroll', this.scrollHandler);
  }

  ngOnDestroy() {
    window.removeEventListener('scroll', this.scrollHandler);
  }

  private onScroll() {
    const scrollTop = window.scrollY;
    const innerHeight = window.innerHeight;
    const scrollHeight = document.documentElement.scrollHeight;

    if (scrollTop + innerHeight >= scrollHeight - 100) {
      this.loadNextPage();
    }
  }

  private loadNextPage() {
    const meta = this.organisationsResource?.value?.()?.meta;
    if (meta && meta.current_page! < meta.last_page!) {
      this.page.update((p) => p + 1);
    }
  }

  onOrganisationClick(id: number) {
    this.router.navigate(['/organisations', id]);
  }
}
