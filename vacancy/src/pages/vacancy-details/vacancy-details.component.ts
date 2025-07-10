import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { KENDO_SVGICON } from '@progress/kendo-angular-icons';
import { VacancyReq, VacancyResourceRes, VacancyService } from '@vet/backend';
import { vetIcons } from '@vet/shared';
import { VacancyDetailsInfoComponent } from '../../components/vacancy-detailed-info/vacancy-detailed-info.component';
import { AddVacancyService } from '../add-vacancy/add-vacancy.service';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'vet-vacancy-details',
  imports: [VacancyDetailsInfoComponent, KENDO_SVGICON, TranslocoPipe],
  templateUrl: './vacancy-details.component.html',
  styleUrl: './vacancy-details.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VacancyDetailsComponent implements OnInit {
  route = inject(ActivatedRoute);
  vacancyService = inject(VacancyService);
  addService = inject(AddVacancyService);

  readonly vetIcons = vetIcons;

  vacancyData = signal<VacancyReq | null>(null);
  contactInfo = signal({
    phone: '032 222 32 24',
    email: 'Britishgeorgianacademy@gmail.com',
    releaseDate: '15/02/1988',
    endDate: '15/02/1988',
    webLink: 'BGA.ge',
    adress: 'გლდანი-ნაძალადევი,ქ. თბილისი, ილია ვეკუას ქუჩა, №44',
    ownerPhone: '574 08 14 56',
    contactPersonPhone: '574 08 14 56',
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.vacancyService.getVacancy(Number(id)).subscribe((res: VacancyResourceRes) => {
      if (res.data) {
        const mappedData: VacancyReq = {
          ...res.data,
          hourly_pay_from: res.data.hourly_pay_from ? Number(res.data.hourly_pay_from) : undefined,
          hourly_pay_to: res.data.hourly_pay_to ? Number(res.data.hourly_pay_to) : undefined,
        };
        this.vacancyData.set(mappedData);
      }
    });
  }
}
