/**
 * @vet/shared/utils - Lightweight utilities for routing and common helpers
 *
 * This secondary entry point provides essential utilities without pulling
 * in heavy UI components from the main @vet/shared library.
 *
 * Use this for:
 * - Route configuration (breadcrumb helper)
 * - Common utility functions
 * - Type definitions
 * - Injection tokens and helpers
 */

// ============================================
// Breadcrumb Helper (commonly used in routes)
// ============================================
export { breadcrumb } from '../shared.utils';
export type {
  AppBreadCrumbItem,
  AppBreadCrumbItemObject,
  AppBreadCrumbItemFactory,
  ResolvedBreadCrumbItem,
} from '../shared.types';

// ============================================
// Core Utilities
// ============================================
export * from '../shared.utils';
export * from '../shared.types';
export * from '../shared.constants';
export * from '../shared.enums';

// ============================================
// Injection Helpers
// ============================================
export * from '../shared.injectors';
export * from '../shared.signals';
export * from '../shared.tokens';

// ============================================
// Configuration & Providers
// ============================================
export * from '../shared.providers';
export * from '../shared.interceptors';
export * from '../shared.guards';
export * from '../shared.validators';
export * from '../vet-provide';

// ============================================
// HTTP & API Utilities
// ============================================
export * from '../http-request-options';
export * from '../use-http-contexts';
export * from '../api-error-handling/api-error-ctx';
export * from '../api-error-handling/api-error.interceptor';

// ============================================
// Theme & UI Utilities
// ============================================
export * from '../theme.service';
export * from '../coercion/number-property';
