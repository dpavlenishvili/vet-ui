import { CommissionResultsFiltersComponent } from './commission-results-filters/commission-results-filters.component';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CommonModule, JsonPipe } from '@angular/common';
import { TranslocoModule } from '@jsverse/transloco';
import { ActivatedRoute } from '@angular/router';
import { CommissionService, CommissionsReview, User } from '@vet/backend';
import { DividerComponent, vetIcons, kendoIcons, DictionaryType, filterNullValues } from '@vet/shared';
import { UserRolesService } from '@vet/auth';
import { rxResource } from '@angular/core/rxjs-interop';
import { KENDO_BUTTON } from '@progress/kendo-angular-buttons';
import { KENDO_GRID } from '@progress/kendo-angular-grid';
import { KENDO_CARD } from '@progress/kendo-angular-layout';
import { SVGIconModule } from '@progress/kendo-angular-icons';
import { KENDO_LOADER } from '@progress/kendo-angular-indicators';
import { KENDO_TOOLTIP } from '@progress/kendo-angular-tooltip';

export type CommissionReviewFilters = {
  filters: {
    program?: string | null;
    pid?: string | null;
    fullname?: string | null;
  };
};

export type ResultFilters = {
  key: string;
  type: string;
  values?: DictionaryType[];
};

@Component({
  selector: 'vet-commission-results',
  imports: [
    CommonModule,
    TranslocoModule,
    DividerComponent,
    KENDO_CARD,
    KENDO_GRID,
    KENDO_BUTTON,
    KENDO_LOADER,
    KENDO_TOOLTIP,
    SVGIconModule,
    CommissionResultsFiltersComponent,
    // JsonPipe
  ],
  templateUrl: './commission-results.component.html',
  styleUrl: './commission-results.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommissionResultsComponent {
  activatedRoute = inject(ActivatedRoute);
  selectedProgramCommissionMembers = signal<User[]>([]);
  vetIcons = vetIcons;

  kendoIcons = kendoIcons;

  isMembersDialogOpen = signal(false);
  userRolesService = inject(UserRolesService);
  commissionService = inject(CommissionService);

  protected filters = signal<string | undefined>(undefined);

  readonly filtersForComponent = computed(() => {
    const data = this.commissionResults$.value();
    return this.getFilters(data ?? {});
  });

  commissionResults$ = rxResource({
    request: () => ({
      organisation: this.userRolesService.getOrganisation(),
      filters: this.filters(),
    }),
    loader: ({ request: { organisation, filters } }) => {
      return this.commissionService.commissionResult({ organisation, filter: filters });
    },
  });

  getFilters(data: CommissionsReview) {
    return data.filters as ResultFilters[];
  }

  onFiltersChange(filters: CommissionReviewFilters) {
    const filterString = JSON.stringify(filterNullValues(filters.filters));
    this.filters.set(filterString);
  }
}
