import { Component, inject, input, output, signal } from '@angular/core';
import { ActionMenuComponent } from '../action-menu/action-menu.component';
import { TranslocoPipe } from '@jsverse/transloco';
import { VacancyCollection } from '@vet/backend';
import { DatePipe } from '@angular/common';
import { headData } from '../../core/interfaces/vacancy.interface';
import { TextArrayFromIdsPipe } from '../../core/pipes/arraytostring.pipe';
import { AddVacancyService } from '../../pages/add-vacancy/add-vacancy.service';

@Component({
  selector: 'vet-vacancy-table',
  imports: [ActionMenuComponent, TranslocoPipe, DatePipe, TextArrayFromIdsPipe],
  templateUrl: './vacancy-table.component.html',
  styleUrl: './vacancy-table.component.scss',
  providers: [AddVacancyService],
})
export class VacancyTableComponent {
  addService = inject(AddVacancyService);
  modulesList = signal(this.addService.modulslist);

  deleteAction = output<number>();
  editAction = output<number>();

  headData = input<headData[]>([]);
  bodyData = input<VacancyCollection[]>();
}
