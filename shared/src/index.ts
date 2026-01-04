/**
 * @vet/shared - Main shared library barrel export
 *
 * ⚠️ DEPRECATED: Avoid importing from this barrel.
 * Use specific secondary entry points for better tree-shaking:
 * - @vet/shared/icons
 * - @vet/shared/ui-components
 * - @vet/shared/dialogs
 * - @vet/shared/services
 * - @vet/shared/pipes
 * - @vet/shared/validators
 * - @vet/shared/utils
 * - @vet/shared/api-error-handling
 */

// Re-export from secondary entry points for backward compatibility
export * from './ui-components';
export * from './dialogs';
export * from './pipes';
export * from './services';
export * from './validators';
export * from './utils';
export * from './api-error-handling';
export * from './shared.icons'; // Keep this here as it's not in utils
