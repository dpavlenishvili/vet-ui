import { computed, DestroyRef, Directive, inject, signal } from '@angular/core';
import { User, UsersService, UserUpdateReq } from '@vet/backend';
import { AuthenticationService } from '@vet/auth';
import { finalize, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { formatDateFn, FormatDateFn, ToastService } from '@vet/shared';

@Directive()
export class UserProfileSection {
  protected readonly userUpdating = computed(() => this._userUpdating());
  protected readonly usersService = inject(UsersService);
  protected readonly authService = inject(AuthenticationService);
  protected readonly destroyRef = inject(DestroyRef);
  private readonly toastService = inject(ToastService);
  private readonly _userUpdating = signal(false);
  private readonly _mandatoryFieldsFn = mandatoryFieldsFn(formatDateFn('YYYY-MM-DD'));

  protected updateUser(userReq: UserUpdateReq) {
    const user = this.authService.user();
    if (!user || !user.id) {
      return;
    }
    this._userUpdating.set(true);
    this.usersService
      .updateUser(user.id, {
        ...this._mandatoryFieldsFn(user),
        ...userReq,
      })
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        tap({
          next: () => this.toastService.success('profile.user_update_success'),
          error: () => this.toastService.error('profile.user_update_failed'),
        }),
        finalize(() => {
          this.authService.reloadUser();
          this._userUpdating.set(false);
        }),
      )
      .subscribe();
  }
}

export const mandatoryFieldsFn = (formatDate: FormatDateFn) => (user?: User | null) => ({
  pid: user?.pid ?? '',
  first_name: user?.firstName ?? '',
  last_name: user?.lastName ?? '',
  gender: user?.gender ?? '',
  residential: user?.residential ?? '',
  birth_date: user?.birthDate ? formatDate(user.birthDate) : '',
});
