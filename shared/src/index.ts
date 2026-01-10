/**
 * @vet/shared - Main shared library barrel export
 *
 * ⚠️ DEPRECATED: Avoid importing from this barrel.
 * Prefer secondary entry points for better tree-shaking:
 * - @vet/shared/icons
 * - @vet/shared/dialogs
 * - @vet/shared/services
 * - @vet/shared/pipes
 * - @vet/shared/validators
 * - @vet/shared/utils
 */

// Components
export * from './components/alert-dialog-outlet';
export * from './components/breadcrumb';
export * from './components/button';
export * from './components/checkbox';
export * from './components/component-outlet.component';
export * from './components/confirmation-dialog-outlet';
export * from './components/date-picker';
export * from './components/dialog';
export * from './components/dialog-outlet';
export * from './components/dialogs';
export * from './components/divider';
export * from './components/expandable-sidebar';
export * from './components/file-upload';
export * from './components/icon';
export * from './components/icon-button';
export * from './components/info';
export * from './components/input';
export * from './components/responsive-stepper';
export * from './components/selector';
export * from './components/single-dialog-outlet';
export * from './components/switch';

// UI Modules
export * from './toast.module';

// Secondary entry points
export * from './pipes';
export * from './services';
export * from './validators';
export * from './utils';

// Legacy icons export
export * from './shared.icons';
