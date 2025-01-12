import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HomeServicesComponent } from './home-services/home-services.component';

@Component({
  selector: 'vet-home',
  imports: [HomeServicesComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {}
