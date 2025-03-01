import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgClass } from '@angular/common';
import { vetIcons } from '@vet/shared';
import { SVGIconComponent } from '@progress/kendo-angular-icons';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'vet-services',
  standalone: true,
  templateUrl: './services.component.html',
  styleUrl: './services.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgClass, SVGIconComponent, TranslocoPipe]
})
export class ServicesComponent {
  vetIcons = vetIcons;
  cards = [
    { text: 'პროფესიული პროგრამები', icon: vetIcons.professionalPrograms, color: 'blue' },
    { text: 'მომზადება/გადამზადების პროგრამები', icon: vetIcons.trainingPrograms, color: 'yellow' },
    { text: 'არაფორმალური განათლების აღიარება', icon: vetIcons.informalEducation, color: 'green' },
    { text: 'საორიენტაციო სერვისი', icon: vetIcons.orientationService, color: 'pink' },
    { text: 'სახელმწიფო ენის მომზადების პროგრამები', icon: vetIcons.governmentLanguageTrainingPrograms, color: 'pink' },
    { text: 'მასწავლებელთა გადამზადების პროგრამები', icon: vetIcons.teacherTrainingPrograms, color: 'yellow' },
    { text: 'კოლეჯში დასაქმება', icon: vetIcons.collegeEmployment, color: 'blue' }
  ];
}
