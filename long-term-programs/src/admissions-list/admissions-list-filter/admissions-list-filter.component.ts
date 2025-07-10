import { ChangeDetectionStrategy, Component, inject, output } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslocoPipe } from '@jsverse/transloco';
import { AdmissionListFilter } from '../admissions-list.component';
import {
  ButtonComponent,
  IconButtonComponent,
  InputComponent,
  isValidIdValue,
  kendoIcons,
  mapIdValueToOption,
  SelectorComponent,
  vetIcons
} from '@vet/shared';
import { GeneralsService } from '@vet/backend';
import { rxResource } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';

@Component({
  selector: 'vet-admissions-list-filter',
  templateUrl: './admissions-list-filter.component.html',
  styleUrl: './admissions-list-filter.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    ButtonComponent,
    FormsModule,
    ReactiveFormsModule,
    TranslocoPipe,
    InputComponent,
    SelectorComponent,
    ButtonComponent,
    IconButtonComponent,
  ],
})
export class AdmissionsListFilterComponent {
  filterForm = this.createFormGroup();
  kendoIcons = kendoIcons;
  vetIcons = vetIcons;
  filtersChange = output<AdmissionListFilter>();
  generalsService = inject(GeneralsService);
  admissionStatus$ = rxResource({
    defaultValue: [],
    loader: () =>
      this.generalsService.getAllConfigs({ key: 'admission_status' }).pipe(
        map((res) => {
          // ტიპი არის დასამატებელი, აღსაწერია სვაგერი სწორად.
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
          return res['admission_status']?.filter(isValidIdValue).map(mapIdValueToOption) ?? [];
        }),
      ),
  });

  createFormGroup() {
    return new FormGroup({
      search: new FormControl(),
      status: new FormControl(),
    });
  }

  clearFilters() {
    this.filterForm.reset();
    this.onSubmit();
  }

  onSubmit() {
    const value = this.filterForm.value;

    const filterData: AdmissionListFilter = {
      search: value.search,
      status: value.status,
    };

    this.filtersChange.emit({ ...filterData });
  }
}
