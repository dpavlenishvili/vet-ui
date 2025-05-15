import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'vet-authorization',
  imports: [RouterOutlet, TranslocoPipe],
  templateUrl: './authorization-page.component.html',
  styleUrl: './authorization-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthorizationPageComponent {}
