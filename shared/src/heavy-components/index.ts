/**
 * @vet/shared/heavy-components - Components with large dependencies
 *
 * These components include heavy third-party dependencies:
 * - Map: Leaflet (~150KB)
 * - Dialog: Kendo Grid (~200KB)
 * - Breadcrumb: Kendo icons (~100KB)
 * - DatePicker: Kendo + dayjs
 * - ResponsiveStepper: Kendo Layout + Tooltip
 * - Selector: Kendo Dropdowns
 * - EducationStandarts: Multiple Kendo + backend integration
 * - FileUpload: Kendo Upload components
 *
 * Import from this entry point only when you need these specific components
 * to avoid loading heavy dependencies unnecessarily.
 */

// Heavy UI Components
export * from '../components/breadcrumb/breadcrumb.component';
export * from '../components/dialog/dialog.component';
export * from '../components/date-picker/date-picker.component';
export * from '../components/responsive-stepper/responsive-stepper.component';
export * from '../components/selector';
export * from '../components/education-standarts/eduaction-standarts.component';
export * from '../components/map/map.component';
export * from '../ui/file-upload/file-upload.component';
