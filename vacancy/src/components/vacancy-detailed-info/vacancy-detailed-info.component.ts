import { ChangeDetectionStrategy, Component, inject, input, output, signal } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { KENDO_BUTTON } from '@progress/kendo-angular-buttons';
import { AddVacancyService } from '../../pages/add-vacancy/add-vacancy.service';
import { VacancyReq } from '@vet/backend';
import { DatePipe } from '@angular/common';
import { KENDO_LOADER } from '@progress/kendo-angular-indicators';
import { TextArrayFromIdsPipe } from '../../core/pipes/arraytostring.pipe';
import { TextFromIdPipe } from '../../core/pipes/textFromId.pipe';

@Component({
  selector: 'vet-vacancy-detailed-info',
  imports: [KENDO_BUTTON, TranslocoPipe, DatePipe, KENDO_LOADER, TextArrayFromIdsPipe, TextFromIdPipe],
  templateUrl: './vacancy-detailed-info.component.html',
  styleUrl: './vacancy-detailed-info.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VacancyDetailsInfoComponent {
  clickNext = output();
  clickBack = output();
  actionStyle = input<boolean>(false);
  vacancyData = input<VacancyReq | null>(null);
  loader = input<boolean>();

  addService = inject(AddVacancyService);

  modulesList = signal(this.addService.modulslist);
  programList = signal(this.addService.programsList);
  positions = signal(this.addService.positions);
  positionTypes = signal(this.addService.positionTypes);
}
