import { inject, InjectionToken } from '@angular/core';
import { AppFeatureFlags } from './feature-flags.type';
import { Observable, of } from 'rxjs';

const FeatureFlagsToken = new InjectionToken<AppFeatureFlags>('Feature Flags Token');

export function provideFeatureFlags(featureFlags: Partial<AppFeatureFlags>) {
  return {
    provide: FeatureFlagsToken,
    useValue: featureFlags,
  };
}

// Signal for purposes of a future reactivity introduction
export function getFeatureFlags(): Observable<AppFeatureFlags> {
  const flags = inject(FeatureFlagsToken);
  return of(flags);
}
