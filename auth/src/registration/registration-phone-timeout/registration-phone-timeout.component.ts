import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { combineLatest, interval, map, of, startWith, switchMap, take } from 'rxjs';
import dayjs from 'dayjs/esm';
import { default as duration } from 'dayjs/esm/plugin/duration';

import { useAuthEnvironment } from '@vet/auth';
import { TranslocoPipe } from '@jsverse/transloco';
import { Reloader } from '@vet/shared';
import { RouterLink } from '@angular/router';
import { AsyncPipe, NgClass } from '@angular/common';
import { toObservable } from '@angular/core/rxjs-interop';

dayjs.extend(duration);

@Component({
  selector: 'vet-registration-phone-timeout',
  imports: [TranslocoPipe, RouterLink, AsyncPipe, NgClass],
  templateUrl: './registration-phone-timeout.component.html',
  styleUrl: './registration-phone-timeout.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class RegistrationPhoneTimeoutComponent {
  isPending = input<boolean>(false);
  startTime = input<number>(0);
  isPending$ = toObservable(this.isPending);
  startTime$ = toObservable(this.startTime);
  resend = output();

  timeoutSeconds = useAuthEnvironment().phoneVerificationNumberTimeoutSeconds;
  verificationCodeReloader = new Reloader();
  countdown$ = this.createCountdown();
  timeoutExpired = output<void>();

  createCountdown() {
    return this.verificationCodeReloader.reloadable(() => {
      return combineLatest([this.isPending$, this.startTime$]).pipe(
        switchMap(([isPending]) =>
          !isPending
            ? of(0)
            : interval(1000).pipe(
                take(this.getRemainingSeconds()),
                map(() => this.getRemainingSeconds()),
                startWith(this.getRemainingSeconds()),
              ),
        ),
        map((remaining) => ({ remaining })),
      );
    });
  }

  onResendClick() {
    this.resend.emit();
    this.verificationCodeReloader.reload();
  }

  format(remaining: number) {
    return dayjs.duration(remaining, 'seconds').format('mm:ss');
  }

  getRemainingSeconds() {
    return Math.max(this.timeoutSeconds - (Date.now() - this.startTime()) / 1000, 0);
  }
}
