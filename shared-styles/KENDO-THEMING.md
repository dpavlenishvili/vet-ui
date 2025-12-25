# Kendo UI Theming Guide

## Architecture Overview
- Base: Kendo Bootstrap theme generated via ThemeBuilder.
- Tokens: Project tokens feed Kendo variables and CSS custom properties.
- Overrides: App-level styling layers on top of the base theme.

## File Structure
### Kendo ThemeBuilder Configuration (regenerated when theme changes)
- `_tokens.scss` - Kendo design tokens (`$tb-*` variables).
- `_overrides.scss` - Theme-level overrides (`tb-overrides` mixin).

### Custom Application Styling (maintained by developers)
- `_custom-kendo-overrides.scss` - Dialogs, tooltips, notifications, stepper tweaks, navigation buttons.
- `_kendo-component-overrides.scss` - Core component styling (labels, inputs, dropdowns, datepicker, popup lists).
- `_kendo-form-overrides.scss` - Form-specific styling (filter inputs, auth/registration forms, placeholders).
- `_kendo-grid-overrides.scss` - Grid headers, cells, pager.
- `_kendo-icon-overrides.scss` - Icon sizing helpers.
- `_custom-kendo-utilities.scss` - Utility classes for shared UI patterns.

### Entry Points
- `_styles.scss` - Kendo theme entry, followed by custom overrides (order matters).
- `_index.scss` - Shared exports for variables/mixins/utilities.

## When to Modify Each File
- Update `_tokens.scss` or `_overrides.scss` only when the ThemeBuilder configuration changes.
- Put Kendo component tweaks in `_kendo-component-overrides.scss`.
- Put form field layouts or shared form patterns in `_kendo-form-overrides.scss`.
- Put grid-related styling in `_kendo-grid-overrides.scss`.
- Put icon sizing helpers in `_kendo-icon-overrides.scss`.
- Keep dialogs/tooltips/notifications/stepper tweaks in `_custom-kendo-overrides.scss`.

## Notes
- `shared-styles/backup/` contains legacy ThemeBuilder outputs for reference only.
- Prefer CSS variables from `apps/vet/src/styles/_theme-light.scss` for colors and spacing.
