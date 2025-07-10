import { Component, inject, input, output, signal } from '@angular/core';
import { ActionMenuComponent } from '../action-menu/action-menu.component';
import { KENDO_SVGICON } from '@progress/kendo-angular-icons';
import { vetIcons } from '@vet/shared';
import { TranslocoPipe } from '@jsverse/transloco';
import { VacancyCollection } from '@vet/backend';
import { DatePipe } from '@angular/common';
import { headData } from '../../core/interfaces/vacancy.interface';
import { AddVacancyService } from '../../pages/add-vacancy/add-vacancy.service';
import { TextArrayFromIdsPipe } from '../../core/pipes/arraytostring.pipe';

@Component({
  selector: 'vet-vacancy-list-card',
  imports: [ActionMenuComponent, TranslocoPipe, DatePipe, TextArrayFromIdsPipe, KENDO_SVGICON],
  templateUrl: './vacancy-list-card.component.html',
  styleUrl: './vacancy-list-card.component.scss',
})
export class VacancyListCardComponent {
  deleteAction = output<number>();
  editAction = output<number>();
  headData = input<headData[]>([]);
  bodyData = input<VacancyCollection[]>();

  addService = inject(AddVacancyService);
  modulesList = signal(this.addService.modulslist);

  icons = vetIcons;
}
