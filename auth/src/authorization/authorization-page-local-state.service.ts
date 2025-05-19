import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { UserLogin2FaResponseBody } from '@vet/backend';
import { AuthenticationService } from '@vet/auth';

// There is some sort of bug in Angular which causes route level providers to be recognised as undefined, so I have to make this root level provider
@Injectable({
  providedIn: 'root',
})
export class AuthorizationPageLocalStateService {
  private _router = inject(Router);
  private _2faResponseBody?: UserLogin2FaResponseBody;
  private _2faCredentials?: { pid: string; token: string };
  private _timeSent?: number;
  private readonly _authenticationService = inject(AuthenticationService);

  navigateTo2fa(
    responseBody: UserLogin2FaResponseBody,
    credentials: { pid: string; token: string },
    timeSent?: number,
  ) {
    this._2faResponseBody = responseBody;
    this._2faCredentials = credentials;
    this._timeSent = timeSent;
    this._router.navigate(['/authorization', '2fa'], {
      queryParams: {
        timeSent,
      },
    });
  }

  handleSuccessfulAuthentication() {
    // @todo add logic to navigate user to the previously requested page
    this._router.navigate(['/']).then(() => {
      this._2faResponseBody = undefined;
      this._2faCredentials = undefined;
    });
  }

  has2FaCredentials() {
    return !!this._2faCredentials && !!this._2faResponseBody;
  }

  validate2FaCode(code: string) {
    return this._authenticationService.validate2FaCode({
      token: this._2faResponseBody?.token as string,
      code: code,
    });
  }

  get2FaCredentials() {
    return this._2faResponseBody;
  }
}
