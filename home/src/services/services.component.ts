import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { NgClass } from '@angular/common';
import { vetIcons } from '@vet/shared';
import { SVGIconComponent } from '@progress/kendo-angular-icons';
import { TranslocoPipe } from '@jsverse/transloco';
import {Router, RouterLink} from '@angular/router';

@Component({
  selector: 'vet-services',
  standalone: true,
  templateUrl: './services.component.html',
  styleUrl: './services.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgClass, SVGIconComponent, TranslocoPipe, RouterLink],
})
export class ServicesComponent {
  showTitle = input(true);
  vetIcons = vetIcons;
  cards = [
    {
      text: 'home.professionalPrograms',
      icon: vetIcons.professionalPrograms,
      color: 'blue',
      url: '/long-term-programs/list',
    },
    {
      text: 'home.trainingPrograms',
      icon: vetIcons.trainingPrograms,
      color: 'yellow',
      url: null,
    },
    {
      text: 'home.informalEducation',
      icon: vetIcons.informalEducation,
      color: 'green',
      url: null,
    },
    {
      text: 'home.orientationService',
      icon: vetIcons.orientationService,
      color: 'pink',
      url: null,
    },
    {
      text: 'home.governmentLanguageTrainingPrograms',
      icon: vetIcons.governmentLanguageTrainingPrograms,
      color: 'pink',
      url: null,
    },
    {
      text: 'home.teacherTrainingPrograms',
      icon: vetIcons.teacherTrainingPrograms,
      color: 'yellow',
      url: null,
    },
    {
      text: 'home.collegeEmployment',
      icon: vetIcons.collegeEmployment,
      color: 'blue',
      url: null,
    },
  ];
  router = inject(Router);
}
