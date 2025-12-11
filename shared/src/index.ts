/**
 * @vet/shared - Main shared library barrel export
 *
 * BACKWARD COMPATIBILITY: This file re-exports from secondary entry points
 * to maintain backward compatibility with existing code.
 *
 * For NEW code, prefer importing from specific secondary entry points:
 * - @vet/shared/icons - Icons (564KB)
 * - @vet/shared/heavy-components - Components with large dependencies
 * - @vet/shared/ui-components - Lightweight UI components
 * - @vet/shared/dialogs - Dialog outlets and services
 * - @vet/shared/services - Core services
 * - @vet/shared/pipes - Template pipes
 * - @vet/shared/validators - Form validators
 * - @vet/shared/utils - Utilities and helpers
 */

// Re-export from secondary entry points for backward compatibility
export * from './heavy-components';
export * from './ui-components';
export * from './dialogs';
export * from './pipes';
export * from './services';

export * from './api-error-handling';

// Validators
export * from './validators';

// Core shared utilities and configuration
export * from './shared.injectors';
export * from './shared.interceptors';
export * from './shared.providers';
export * from './shared.signals';
export * from './shared.types';
export * from './shared.enums';
export * from './shared.guards';
export * from './shared.utils';
export * from './shared.constants';
export * from './shared.validators';
export * from './shared.tokens';
export * from './shared.icons';
export * from './toast.module';

export * from './coercion/number-property';
export * from './http-request-options';
export * from './use-http-contexts';
export * from './vet-provide';
