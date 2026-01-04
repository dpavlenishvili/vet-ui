/**
 * @vet/shared/ui-components - Lightweight UI components
 *
 * These are basic UI components without heavy external dependencies.
 * Safe to import in route configurations and lightweight modules.
 *
 * Components included:
 * - Button, Input, Checkbox, Switch
 * - Icon, IconButton
 * - Info, Divider
 * - Expandable sidebar components
 * - Component outlet
 */

// Basic UI Components
export * from '../components/divider/divider.component';
export * from '../components/info/info.component';
export * from '../components/switch';
export * from '../components/input';
export * from '../components/button';
export * from '../components/icon';
export * from '../components/icon-button';
export * from '../components/checkbox';
export * from '../components/component-outlet.component';
// Heavy Components
export * from '../components/breadcrumb/breadcrumb.component';
export * from '../components/dialog/dialog.component';
export * from '../components/date-picker/date-picker.component';
export * from '../components/responsive-stepper/responsive-stepper.component';
export * from '../components/selector';
export * from '../components/education-standarts/eduaction-standarts.component';
export * from '../components/map/map.component';

// Sidebar Components
export * from '../components/expandable-sidebar-menu/expandable-sidebar-menu.component';
export * from '../components/expandable-sidebar/expandable-sidebar.component';
export * from '../components/router-expandable-sidebar-menu/router-expandable-sidebar-menu.component';

// Navbar Components
export * from '../ui/navbar/navbar-logo.directive';
export * from '../ui/navbar/navbar.component';
export * from '../ui/file-upload/file-upload.component';

// UI Modules
export * from '../toast.module';
