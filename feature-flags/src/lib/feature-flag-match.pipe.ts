import { ChangeDetectorRef, DestroyRef, inject, Pipe, PipeTransform } from '@angular/core';
import { Subscription } from 'rxjs';
import { AppFeatureFlagKey, AppFeatureFlags, AppFeatureFlagValue } from './feature-flags.type';
import { FeatureFlagsService } from './feature-flags.service';

@Pipe({
  name: 'featureFlagMatch',
})
export class FeatureFlagMatchPipe implements PipeTransform {
  private readonly _flagsService = inject(FeatureFlagsService);
  private readonly _changeDetectorRef = inject(ChangeDetectorRef);

  private latestValue: AppFeatureFlagValue | null = null;
  private subscription: Subscription | null = null;

  constructor() {
    inject(DestroyRef).onDestroy(() => {
      if (this.subscription) {
        this.subscription.unsubscribe();
        this.subscription = null;
      }
    });
  }

  transform<K extends AppFeatureFlagKey>(value: K): AppFeatureFlags[K] | null {
    if (!this.subscription) {
      this.subscription = this._flagsService.matches(value).subscribe((newValue) => {
        this.latestValue = newValue;
        this._changeDetectorRef.markForCheck();
      });
    }
    return this.latestValue as AppFeatureFlags[K];
  }
}
