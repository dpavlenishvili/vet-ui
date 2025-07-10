import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { VacancyFormComponent } from '../../components/vacancy-form/vacancy-form.component';
import { VacancyTableComponent } from '../../components/vacancy-table/vacancy-table.component';
import { VacancyListCardComponent } from '../../components/vacancy-list-card/vacancy-list-card.component';
import { KENDO_ICONS, KENDO_SVGICON } from '@progress/kendo-angular-icons';
import { filterNullValues, ToastService, vetIcons } from '@vet/shared';
import { NgClass } from '@angular/common';
import { VacancyCollectionRes, VacancyService } from '@vet/backend';
import { headData, ListFilterFormInterface } from '../../core/interfaces/vacancy.interface';
import { AddVacancyService } from '../add-vacancy/add-vacancy.service';
import { rxResource } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';

@Component({
  selector: 'vet-vacancy',
  imports: [VacancyFormComponent, VacancyTableComponent, VacancyListCardComponent, KENDO_ICONS, KENDO_SVGICON, NgClass],
  templateUrl: './vacancy-list.component.html',
  styleUrl: './vacancy-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VacancyListComponent {
  vacancyService = inject(VacancyService);
  addService = inject(AddVacancyService);
  toastService = inject(ToastService);
  router = inject(Router);

  icons = vetIcons;
  gridMode = false;
  headData: headData[] = [
    {
      name: 'vacancy.list_id',
    },
    {
      name: 'vacancy.list_position',
    },
    {
      name: 'vacancy.list_modul',
    },
    {
      name: 'vacancy.list_municipality',
    },
    {
      name: 'vacancy.list_Institution',
    },
    {
      name: 'vacancy.list_releaseDate',
    },
    {
      name: 'vacancy.list_deadLine',
    },
    {
      name: 'vacancy.list_action',
    },
  ];

  vacancyList = rxResource<VacancyCollectionRes, { filters: ListFilterFormInterface }>({
    defaultValue: { data: [] },
    request: () => ({ filters: this.filters() }),
    loader: ({ request: { filters } }) => this.vacancyService.getVacancies(filters),
  });

  protected readonly filters = signal<ListFilterFormInterface>({
    region_id: null,
    district_id: null,
    institution: null,
    position: null,
    modules: null,
    page: 1,
    per_page: 50,
  });

  onFiltersChange(filters: ListFilterFormInterface) {
    this.filters.set(filterNullValues(filters));
  }

  onClickEdit(id: number) {
    this.router.navigate(['/vacancy/add-vacancy'], { queryParams: { id } });
  }

  deleteRow(rowId: number) {
    this.vacancyService.deleteVacancy(rowId).subscribe(() => {
      this.toastService.success('deleted succesfuly');
    });
  }
}
