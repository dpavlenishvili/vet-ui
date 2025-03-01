import { ActivatedRoute } from '@angular/router';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { KENDO_ICONS } from '@progress/kendo-angular-icons';
import { useRouteParam, vetIcons } from '@vet/shared';
import { LongTerm, ProgramsService } from '@vet/backend';
import { Observable, map } from 'rxjs';
import { TranslocoPipe } from '@jsverse/transloco';
import { AsyncPipe, JsonPipe } from '@angular/common';
import * as kendoIcons from '@progress/kendo-svg-icons';

interface Organisation {
  name?: string;
}

@Component({
  selector: 'vet-program',
  imports: [KENDO_ICONS, AsyncPipe, TranslocoPipe],
  templateUrl: './program.component.html',
  styleUrl: './program.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class ProgramComponent {
  programsService = inject(ProgramsService);
  activatedRoute = inject(ActivatedRoute);
  programId$ = useRouteParam('programId');
  partners = [
    {
      id: 1,
      name: 'შპს სქაინეთი',
      size: 'მცირე',
      sector: 'სოფლის მეურნეობა და თევზჭერა',
    },
    {
      id: 2,
      name: 'შპს კომპიუტერული ტექნოლოგიების აკადემია სი თი ეი',
      size: 'დიდი',
      sector: 'ვაჭრობა',
    },
  ];

  kendoIcons = kendoIcons;

  vetIcons = vetIcons;
  admission = true;

  programId = this.activatedRoute.snapshot.paramMap.get('programId');
  program$ = this.programsService.program(Number(this.programId)).pipe(map((response) => response.data));

  getOrganisation(program: LongTerm): Organisation {
    return program?.organisation as Organisation;
  }
}
