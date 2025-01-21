import { ChangeDetectionStrategy, Component, output } from '@angular/core';
import { interval, map, startWith, take } from 'rxjs';
import * as dayjs from 'dayjs';
import { default as duration } from 'dayjs/plugin/duration';

import { useAuthEnvironment } from '../../auth.injectors';
import { TranslocoPipe } from '@jsverse/transloco';
import { Reloader } from '@vet/shared';
import { RouterLink } from '@angular/router';
import { AsyncPipe } from '@angular/common';

dayjs.extend(duration);

@Component({
  selector: 'vet-registration-phone-timeout',
  imports: [TranslocoPipe, RouterLink, AsyncPipe],
  templateUrl: './registration-phone-timeout.component.html',
  styleUrl: './registration-phone-timeout.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true
})
export class RegistrationPhoneTimeoutComponent {
  resend = output();

  timeoutSeconds = useAuthEnvironment().phoneVerificationNumberTimeoutSeconds;
  verificationCodeReloader = new Reloader();
  countdown$ = this.createCountdown();

  createCountdown() {
    return this.verificationCodeReloader.reloadable(() => {
      return interval(1000).pipe(
        take(this.timeoutSeconds + 1),
        map((elapsed) => this.timeoutSeconds - elapsed - 1),
        map((remaining) => dayjs.duration(remaining, 'seconds').format('mm:ss')),
        startWith(dayjs.duration(this.timeoutSeconds, 'seconds').format('mm:ss')),
      );
    });
  }

  onResendClick() {
    this.resend.emit();
    this.verificationCodeReloader.reload();
  }
}
