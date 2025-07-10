import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { VacancyCollectionRes, VacancyService } from '@vet/backend';
import { filterNullValues, ToastService, vetIcons } from '@vet/shared';
import { VacancyFormComponent } from '../../components/vacancy-form/vacancy-form.component';
import { VacancyTableComponent } from '../../components/vacancy-table/vacancy-table.component';
import { headData, ListFilterFormInterface } from '../../core/interfaces/vacancy.interface';

@Component({
  selector: 'vet-vacancy',
  imports: [VacancyFormComponent, VacancyTableComponent],
  templateUrl: './favorite-vacancies.component.html',
  styleUrl: './favorite-vacancies.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FavoriteVacancyComponent {
  vacancyService = inject(VacancyService);
  toastService = inject(ToastService);

  icons = vetIcons;
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

  favoriteVacancies = rxResource({
    defaultValue: { data: [] },
    request: () => ({ filters: this.filters() }),
    loader: ({ request: { filters } }) => this.vacancyService.getFavoriteVacancies(filters),
  });

  protected readonly filters = signal<ListFilterFormInterface>({
    position: null,
    modules: null,
    institution: null,
    district_id: null,
    region_id: null,
    page: 1,
    per_page: 50,
  });

  onFiltersChange(filters: ListFilterFormInterface) {
    this.filters.set(filterNullValues(filters));
  }
  // not ready for dev yet
  // deleteRow(rowId: number) {
  //   this.vacancyService.deleteVacancy(rowId).subscribe(() => {
  //     this.toastService.success('deleted succesfuly');
  //   });
  // }
}
