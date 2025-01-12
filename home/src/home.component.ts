import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HomeServicesComponent } from './home-services/home-services.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'vet-home',
  imports: [CommonModule, HomeServicesComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {}
