import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'vet-vacancy',
  imports: [RouterOutlet],
  templateUrl: './vacancy.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VacancyComponent {}
