export interface AppFeatureFlags {
  vacancies: boolean;
}

export type AppFeatureFlagKey = keyof AppFeatureFlags;

export type AppFeatureFlagValue = AppFeatureFlags[AppFeatureFlagKey];
