/**
 * @vet/shared/dialogs - Dialog outlets and services
 *
 * All dialog-related components and services.
 * Import this when you need dialog functionality.
 */

// Dialog Outlet Components
export * from './alert-dialog-outlet/alert-dialog-outlet.component';
export * from './confirmation-dialog-outlet/confirmation-dialog-outlet.component';
export * from './dialog-outlet/dialog-outlet.component';
export * from './single-dialog-outlet/single-dialog-outlet.component';

// Dialog Services
export * from '../services/alert-dialog.service';
export * from '../services/confirmation-dialog.service';
export * from '../services/app-dialog.service';

// Dialog Injector Helpers
export { useAlert, useConfirm } from '../shared.injectors';
