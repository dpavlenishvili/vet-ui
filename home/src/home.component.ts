import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HomeServicesComponent } from './home-services/home-services.component';
import { PostsComponent } from './posts/posts.component';
import { PartnersComponent } from './partners/partners.component';

@Component({
  selector: 'vet-home',
  imports: [HomeServicesComponent, PostsComponent, PartnersComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true
})
export class HomeComponent {}
