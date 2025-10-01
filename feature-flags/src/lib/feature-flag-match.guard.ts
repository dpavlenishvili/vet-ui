import { ActivatedRouteSnapshot, CanActivateFn } from '@angular/router';
import { AppFeatureFlagKey } from './feature-flags.type';
import { inject } from '@angular/core';
import { FeatureFlagsService } from './feature-flags.service';

export function featureFlagMatch(): CanActivateFn {
  return (route: ActivatedRouteSnapshot) => {
    return inject(FeatureFlagsService).matches(
      // At this point assuming that it's going be just a key, nothing more
      route.data['featureFlags'] as AppFeatureFlagKey,
    );
  };
}
