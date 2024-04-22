/* eslint-disable @typescript-eslint/no-empty-function,@angular-eslint/no-host-metadata-property */
import {
    ChangeDetectionStrategy,
    Component,
    DestroyRef,
    EventEmitter,
    Input,
    OnInit,
    Output,
    ViewEncapsulation,
    inject,
    signal,
} from '@angular/core';
import { NgClass } from '@angular/common';
import { interval, Subscription } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

let quantity = 0;

@Component({
    selector: 'v-ui-timer',
    standalone: true,
    template: `
        <div class="d-flex justify-content-end align-items-center gap-4">
            <span>{{ timer() }}</span>

            @if (enableResendBtn) {
                <button
                    type="button"
                    class="resend-btn"
                    [class.resend-btn__disabled]="disabled()"
                    [disabled]="disabled()"
                    (click)="onResendBtn()"
                >
                    კოდის ხელახლა მიღება
                </button>
            }
        </div>
    `,
    styleUrls: ['timer.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [NgClass],
    encapsulation: ViewEncapsulation.None,
})
export class TimerComponent implements OnInit {
    private destroyRef$ = inject(DestroyRef);

    @Input() id = `v-ui-timer-${++quantity}`;
    @Input() enableResendBtn = true;

    @Output() resendBtnClicked = new EventEmitter();

    disabled = signal<boolean>(true);
    timer = signal<string>('02:00');
    timerSubscription: Subscription | null = null;

    ngOnInit(): void {
        this.startTimer();
    }

    startTimer() {
        let timer = 120;
        let minutes;
        let seconds;

        this.timerSubscription = interval(1000)
            .pipe(takeUntilDestroyed(this.destroyRef$))
            .subscribe(() => {
                minutes = Math.floor(timer / 60);
                seconds = Math.floor(timer % 60);

                minutes = minutes < 10 ? '0' + minutes : minutes;
                seconds = seconds < 10 ? '0' + seconds : seconds;

                if (minutes > '00') {
                    this.disabled.set(true);
                } else {
                    this.disabled.set(false);
                }

                this.timer.set(minutes + ':' + seconds);

                --timer;
                if (timer < 0) {
                    this.timerSubscription?.unsubscribe();
                }
            });
    }

    onResendBtn() {
        this.timerSubscription?.unsubscribe();
        this.startTimer();

        this.resendBtnClicked.emit();
    }
}
