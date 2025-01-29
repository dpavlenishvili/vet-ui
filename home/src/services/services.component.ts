import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
  selector: 'vet-services',
  standalone: true,
  templateUrl: './services.component.html',
  styleUrl: './services.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgClass],
})
export class ServicesComponent {
  cards = [
    { text: 'პროფესიული პროგრამები', icon: 'professional-programs.png', color: 'blue' },
    { text: 'მომზადება/გადამზადების პროგრამები', icon: 'preparation-retraining-programs.png', color: 'yellow' },
    { text: 'არაფორმალური განათლების აღიარება', icon: 'training-programs.png', color: 'green' },
    { text: 'საორიენტაციო სერვისი', icon: 'orientation.png', color: 'teal' },
    { text: 'სახელმწიფო ენის მომზადების პროგრამები', icon: 'state-language.png', color: 'pink' },
    { text: 'მასწავლებელთა გადამზადების პროგრამები', icon: 'teacher-training.png', color: 'purple' },
    { text: 'კოლეჯში დასაქმება', icon: 'college-employment.png', color: 'blue' }
  ];
}
