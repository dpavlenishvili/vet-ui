import { ChangeDetectionStrategy, Component, inject, output } from '@angular/core';
import { ButtonComponent } from '@progress/kendo-angular-buttons';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslocoPipe } from '@jsverse/transloco';
import { AdmissionListFilter } from '../admissions-list.component';
import { TextBoxComponent, TextBoxSuffixTemplateDirective } from '@progress/kendo-angular-inputs';
import { LabelComponent } from '@progress/kendo-angular-label';
import { kendoIcons, vetIcons } from '@vet/shared';
import { GeneralsService } from '@vet/backend';
import { rxResource } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { DropDownListComponent } from '@progress/kendo-angular-dropdowns';
import { SVGIconComponent } from '@progress/kendo-angular-icons';
import { TooltipDirective } from '@progress/kendo-angular-tooltip';

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
    TextBoxComponent,
    LabelComponent,
    DropDownListComponent,
    TextBoxSuffixTemplateDirective,
    SVGIconComponent,
    TooltipDirective,
  ],
})
export class AdmissionsListFilterComponent {
  filterForm = this.createFormGroup();
  kendoIcons = kendoIcons;
  vetIcons = vetIcons;
  filtersChange = output<AdmissionListFilter>();
  generalsService = inject(GeneralsService);
  admissionStatus$ = rxResource({
    loader: () =>
      this.generalsService.getAllConfigs({ key: 'admission_status' }).pipe(
        map((res) => {
          // ტიპი არის დასამატებელი, აღსაწერია სვაგერი სწორად.
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
          return res['admission_status'];
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
