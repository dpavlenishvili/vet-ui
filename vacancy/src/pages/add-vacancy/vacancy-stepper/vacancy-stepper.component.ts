import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
interface StepperList {
  name: string;
  id: number;
}

@Component({
  selector: 'vet-vacancy-stepper',
  imports: [NgClass],
  templateUrl: './vacancy-stepper.component.html',
  styleUrl: './vacancy-stepper.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VacancyStepperComponent {
  stepsList = input<StepperList[]>([
    { name: 'პოზიციის დეტალები', id: 1 },
    { name: 'ხელშეკრულების დეტალები', id: 2 },
    { name: 'დამატებითი დეტალები', id: 3 },
    { name: 'გადახედვა', id: 5 },
  ]);

  activeIndex = input<number>(1);
  changeStep = output<number>();
}
