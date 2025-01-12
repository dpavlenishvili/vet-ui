import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthorizationLoginComponent } from './authorization-login/authorization-login.component';

@Component({
  selector: 'vet-authorization',
  imports: [CommonModule, AuthorizationLoginComponent],
  templateUrl: './authorization.component.html',
  styleUrl: './authorization.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthorizationComponent {}
