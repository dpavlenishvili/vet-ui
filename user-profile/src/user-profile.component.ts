import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, signal } from '@angular/core';
import { UserOverviewComponent } from './user-overview/user-overview.component';
import { AuthService, UserReq, UserRes, UsersService } from '@vet/backend';
import { Observable, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormatDatePipe, ToastModule, ToastService } from '@vet/shared';
import { FormControl, FormGroup } from '@angular/forms';
import { UserPasswordChangeComponent } from './user-password-change/user-password-change.component';
import { SVGIconModule } from '@progress/kendo-angular-icons';
import * as kendoIcons from '@progress/kendo-svg-icons';
import { TranslocoModule } from '@jsverse/transloco';
import { NgClass } from '@angular/common';

@Component({
    selector: 'vet-user-profile',
    standalone: true,
    imports: [
        NgClass,
        UserOverviewComponent,
        UserPasswordChangeComponent,
        SVGIconModule,
        TranslocoModule,
        ToastModule,
    ],
    providers: [FormatDatePipe],
    templateUrl: './user-profile.component.html',
    styleUrl: './user-profile.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserProfileComponent implements OnInit {
    user$: Observable<UserRes>;
    userForm = signal(this.createFormGroup());
    kendoIcons = kendoIcons;
    selectedIndex = 0;
    currentUserId: number | null | undefined = null;

    menuItems = [
        { text: 'my_profile', icon: '/assets/images/my-profile.svg' },
        { text: 'password', icon: '/assets/images/password.svg' },
        { text: 'interest_areas', icon: '/assets/images/interest-areas.svg' },
        { text: 'terms_conditions', icon: '/assets/images/termsAndConditions.svg' },
        { text: 'my_messages', icon: '/assets/images/bell-icon.svg' },
    ];

    constructor(
        private usersService: UsersService,
        private authService: AuthService,
        private toastService: ToastService,
        private destroyRef: DestroyRef,
        private formatDatePipe: FormatDatePipe,
    ) {
        this.user$ = authService.getUser();
    }

    ngOnInit(): void {
        this.user$
            .pipe(
                takeUntilDestroyed(this.destroyRef),
                tap((user) => {
                    this.userForm.set(this.createFormGroup(user));
                    this.currentUserId = user.data?.id;
                }),
            )
            .subscribe();
    }

    createFormGroup(user?: UserRes) {
        return new FormGroup({
            mandatoryFields: new FormGroup({
                pid: new FormControl(user?.data?.pid ?? ''),
                phone: new FormControl(user?.data?.phone ?? ''),
                first_name: new FormControl(user?.data?.firstName ?? ''),
                last_name: new FormControl(user?.data?.lastName ?? ''),
                gender: new FormControl(user?.data?.gender ?? ''),
                residential: new FormControl(user?.data?.residential ?? ''),
                birth_date: new FormControl(
                    user?.data?.birthDate
                        ? this.formatDatePipe.transform(user.data.birthDate, { format: 'YYYY-MM-DD' })
                        : '',
                ),
            }),
            userOverview: new FormGroup({
                name: new FormControl(user?.data?.name ?? ''),
                region: new FormControl(user?.data?.region ?? ''),
                district: new FormControl(user?.data?.city ?? ''),
                address: new FormControl(user?.data?.address ?? ''),
                email: new FormControl(user?.data?.email ?? ''),
                phone: new FormControl(user?.data?.phone ?? ''),
                sms_code: new FormControl(''),
            }),
            passwordChange: new FormGroup({
                password: new FormControl(''),
                password_confirmation: new FormControl(''),
                new_password: new FormControl(''),
            }),
        });
    }

    getMandatoryFields() {
        const value = this.userForm().value;

        return {
            pid: String(value.mandatoryFields?.pid),
            phone: String(value.userOverview?.phone),
            first_name: String(value.mandatoryFields?.first_name),
            last_name: String(value.mandatoryFields?.last_name),
            gender: String(value.mandatoryFields?.gender),
            residential: String(value.mandatoryFields?.residential),
            birth_date: String(value.mandatoryFields?.birth_date),
        };
    }

    updateUser(userId: number, params: UserReq) {
        this.usersService
            .updateUser(userId, params)
            .pipe(
                takeUntilDestroyed(this.destroyRef),
                tap({
                    next: () => {
                        this.toastService.success('profile.user_update_success');
                    },
                    error: (error) => {
                        this.toastService.error(error?.error?.error?.message ?? 'profile.user_update_failed');
                    },
                }),
            )
            .subscribe();
    }

    saveUserOverview() {
        const value = this.userForm().value;
        const userId = Number(this.currentUserId);
        const params: UserReq = {
            ...this.getMandatoryFields(),
            region: String(value.userOverview?.region),
            city: String(value.userOverview?.district),
            address: String(value.userOverview?.address),
            email: String(value.userOverview?.email),
            sms_code: String(value.userOverview?.sms_code),
        };

        this.updateUser(userId, params);
    }

    savePassword() {
        const value = this.userForm().value;
        const userId = Number(this.currentUserId);
        const params: UserReq = {
            ...this.getMandatoryFields(),
            password: String(value.passwordChange?.password),
            password_confirmation: String(value.passwordChange?.password_confirmation),
        };

        this.updateUser(userId, params);
    }

    changeSelectedItemIndex(index: number) {
        this.selectedIndex = index;
    }
}
