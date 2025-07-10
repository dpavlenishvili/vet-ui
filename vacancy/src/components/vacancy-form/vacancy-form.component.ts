import { ChangeDetectionStrategy, Component, output, signal, ViewEncapsulation } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { vetIcons } from '@vet/shared';
import { KENDO_SVGICON } from '@progress/kendo-angular-icons';
import { KENDO_BUTTON } from '@progress/kendo-angular-buttons';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ListFilterFormInterface } from '../../core/interfaces/vacancy.interface';
import { KENDO_INPUTS } from '@progress/kendo-angular-inputs';
import { KENDO_DROPDOWNS } from '@progress/kendo-angular-dropdowns';

@Component({
  selector: 'vet-vacancy-form',
  imports: [KENDO_INPUTS, KENDO_DROPDOWNS, TranslocoPipe, KENDO_BUTTON, KENDO_SVGICON, ReactiveFormsModule],
  templateUrl: './vacancy-form.component.html',
  styleUrl: './vacancy-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class VacancyFormComponent {
  emitForm = output<ListFilterFormInterface>();
  readonly filterForm = signal(this.createFormGroup());

  icons = vetIcons;

  listItems = [
    { id: 0, text: 'პროფესორი' },
    { id: 1, text: 'მასწავლებელი' },
  ];

  createFormGroup() {
    return new FormGroup({
      region_id: new FormControl<number | null>(null),
      district_id: new FormControl<number | null>(null),
      institution: new FormControl<string | null>(null),
      position: new FormControl<number | null>(null),
      modules: new FormControl<number | null>(null),
    });
  }
}
