import { Injectable } from '@angular/core';
import { getFeatureFlags } from './feature-flags.provider';
import { AppFeatureFlags } from './feature-flags.type';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FeatureFlagsService {
  private readonly _featureFlags = getFeatureFlags();

  matches<K extends keyof AppFeatureFlags>(id: K) {
    return this._featureFlags.pipe(map((featureFlag: AppFeatureFlags) => featureFlag[id]));
  }
}
