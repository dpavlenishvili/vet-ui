# VET-UI Routing & RBAC Ecosystem: Deep-Dive Analysis and Refactoring Plan

> **Generated**: 2025-12-11
> **Version**: 1.0
> **Scope**: Comprehensive routing architecture refactoring, RBAC standardization, and bundle optimization

---

## Executive Summary

### Current State
- **All route modules eagerly loaded**: ~10 feature libraries imported statically in `app.routes.ts`
- **MainLayoutComponent eager**: Main layout loaded immediately on app startup
- **Inconsistent guard application**: Empty `canActivate: []` arrays, guards at wrong levels
- **No route-level RBAC**: Permission guards exist but unused in routing configuration
- **Monolithic shared library**: 564KB icons + heavy Kendo components in single barrel export
- **Estimated initial bundle**: 2-3MB+ (includes all feature modules even for login page)

### Target State
- **Lazy-loaded route modules**: Each feature loaded on-demand via `loadChildren`
- **Lazy-loaded layouts**: Both main and dashboard layouts loaded dynamically
- **Consistent guard patterns**: Guards applied at route boundaries with clear hierarchy
- **Declarative RBAC**: Permissions configured in `route.data`, guards read configuration
- **Optimized shared library**: Secondary entry points for icons, heavy components, services
- **Estimated initial bundle reduction**: 60-70% smaller (400-800KB for login flow)

---

## Part 1: The Deep-Dive Analysis

### 1. Routing Tree & Bundle Analysis

#### Current Route Hierarchy (Problematic Eager Loading)

```
AppRoutes (Root) - apps/vet/src/app/app.routes.ts
├── /dashboard                    [EAGER IMPORT] → dashboardRoutes
│   └── DashboardLayoutComponent  [LAZY within dashboard.routes.ts]
│       ├── /programs/long        [EAGER IMPORT] → longTermProgramsDashboardRoutes
│       ├── /programs/short       [EAGER IMPORT] → shortTermProgramsDashboardRoutes
│       └── /programs/non-formal  [EAGER IMPORT] → nonFormalProgramsDashboardRoutes
│
├── /pages/**                     [EAGER IMPORT] → pagesRoutes
│   └── PageLayoutComponent       [LAZY within pages.routes.ts]
│
└── MainLayoutComponent           [EAGER STATIC IMPORT]
    ├── /                         [EAGER IMPORT] → homeRoutes
    ├── /programs/short           [EAGER IMPORT] → shortTermProgramsRoutes
    ├── /programs/non-formal      [EAGER IMPORT] → nonFormalProgramsRoutes
    ├── /programs                 [EAGER IMPORT] → unauthorisedProgramsRoutes
    ├── /long-term-programs       [EAGER IMPORT] → longTermProgramsRoutes
    ├── /user-profile             [EAGER IMPORT] → userProfileRoutes
    ├── (empty path)              [EAGER IMPORT] → authRoutes
    ├── /vacancy                  [EAGER IMPORT] → vacancyRoutes
    └── /organisations            [EAGER IMPORT] → organisationsRoutes
```

#### Identified Eager Loading Issues

| Library | Import Type | Lines in app.routes.ts | Bundle Impact |
|---------|-------------|------------------------|---------------|
| `MainLayoutComponent` | Static import | Line 11 | CRITICAL - Layout in initial bundle |
| `@vet/dashboard` | Static import | Line 3 | HIGH - Entire dashboard module |
| `@vet/pages` | Static import | Line 12 | MEDIUM - Dynamic pages system |
| `@vet/long-term-programs` | Static import | Line 7 | VERY HIGH - Full wizard + application forms |
| `@vet/short-term-programs` | Static import | Line 10 | HIGH - Short program registration |
| `@vet/non-formal-programs` | Static import | Line 13 | HIGH - Non-formal registration |
| `@vet/auth` | Static import | Line 5 | MEDIUM - Registration wizard |
| `@vet/home` | Static import | Line 6 | LOW - Small home component |
| `@vet/user-profile` | Static import | Line 8 | MEDIUM - Profile forms |
| `@vet/organisations` | Static import | Line 2 | LOW - Organisation listing |
| `@vet/unauthorised-programs` | Static import | Line 4 | MEDIUM - Public program catalog |
| `@vet/vacancy` | Static import | Line 9 | MEDIUM - Vacancy system |

**Critical Finding**: Zero lazy-loaded routes at app.routes.ts level. All 12 feature libraries are in the initial bundle.

#### Component-Level Lazy Loading

**Positive Finding**: Individual components within feature routes use `loadComponent`:
- Auth: RegistrationComponent, LoginPageComponent
- Dashboard: All sub-components lazy
- Long-term programs: All wizard steps lazy
- Short-term programs: All views lazy
- Non-formal programs: All views lazy

**Result**: Hybrid approach where route metadata is eager but component implementations are lazy. This prevents optimal code splitting.

---

### 2. Layout & Guard Assessment

#### Layout Strategy Analysis

| Layout | Location | Current Loading | Usage | Issue |
|--------|----------|----------------|-------|-------|
| `MainLayoutComponent` | `app.routes.ts:11` | **EAGER** (static import) | Wraps public/mixed routes | Should be lazy-loaded |
| `DashboardLayoutComponent` | `dashboard.routes.ts` | **LAZY** (loadComponent) | Wraps dashboard routes | ✅ Correct pattern |
| `PageLayoutComponent` | `pages.routes.ts` | **LAZY** (loadComponent) | Wraps dynamic pages | ✅ Correct pattern |

**MainLayoutComponent Analysis**:
```typescript
// Current (app.routes.ts:11)
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';

export const appRoutes: Routes = [
  // ... other routes
  {
    path: '',
    component: MainLayoutComponent, // Eager loading
    children: [ /* ... */ ]
  }
];
```

**Dependencies Pulled Into Initial Bundle**:
- `NavbarComponent` → imports `@vet/auth` (UserService, AuthenticationService)
- `NavbarComponent` → imports `@vet/backend` (Page type)
- `BreadcrumbComponent` → imports entire Kendo navigation module
- `AppFooterComponent` → minimal dependencies

#### Guard Inconsistency Matrix

| Route Path | Current Guard | Level | Status | Issue |
|------------|---------------|-------|--------|-------|
| `/dashboard` | `canActivate: []` | Route (line 23) | ❌ CRITICAL | Empty guard array - no protection! |
| `/dashboard` children | `authenticatedGuard` | Layout component | ⚠️ WRONG LEVEL | Guard should be at route boundary |
| `/programs` | `unAuthenticatedGuard` | Route (line 51) | ✅ CORRECT | Properly protected |
| `/programs/short` | `canActivate: []` | Route (line 39) | ❌ CRITICAL | Empty guard - no protection |
| `/programs/short/registration` | `mandatoryFieldsGuard` | Child route | ⚠️ INCONSISTENT | Only registration protected |
| `/programs/non-formal` | `canActivate: []` | Route (line 45) | ❌ CRITICAL | Empty guard - no protection |
| `/programs/non-formal` children | Mixed guards | Individual routes | ⚠️ INCONSISTENT | Conflicting auth requirements |
| `/long-term-programs` | `authenticatedGuard` | Route (line 57) | ✅ CORRECT | Properly protected |
| `/long-term-programs/register-admission` | `mandatoryFieldsGuard` | Child route | ⚠️ REDUNDANT | Should cascade from parent |
| `/user-profile` | `authenticatedGuard` | Route (line 63) | ✅ CORRECT | Properly protected |
| `''` (auth routes) | `unAuthenticatedGuard` | Route (line 69) | ⚠️ PATH COLLISION | Empty path conflicts with home |
| `/vacancy` | None | Route | ❌ MISSING | No authentication decision |
| `/organisations` | None | Route | ❌ MISSING | No authentication decision |

#### Dashboard Route Guard Deep-Dive

**Critical Security Issue**:
```typescript
// app.routes.ts:23
{
  path: 'dashboard',
  children: dashboardRoutes,
  canActivate: [], // EMPTY ARRAY - NO PROTECTION
  data: breadcrumb([]),
}
```

**What Actually Protects Dashboard**:
```typescript
// dashboard/src/routing/dashboard.routes.ts:13
{
  path: '',
  loadComponent: () => import('../dashboard-layout/dashboard-layout.component'),
  canActivate: [authenticatedGuard], // Protection here instead
  children: [ /* ... */ ]
}
```

**Problem**: Guard is inside the lazy-loaded module, not at the route boundary. This means:
1. `/dashboard` route definition loads before guard executes
2. User could potentially navigate to `/dashboard` (though would see empty view)
3. Guard logic is split across files (hard to maintain)

#### Non-Formal Programs Auth Conflict

**Conflicting Requirements**:
```typescript
// Program list (PUBLIC)
{ path: '', canActivate: [unAuthenticatedGuard] }
{ path: ':programId', canActivate: [unAuthenticatedGuard] }

// Applications (AUTHENTICATED)
{ path: 'applications', canActivate: [authenticatedGuard] }
{ path: 'register-application', canActivate: [authenticatedGuard, mandatoryFieldsGuard] }
```

**Issue**: Public and authenticated routes at same level under `/programs/non-formal`. This creates:
- Confusion about route intent (is this for public or authenticated users?)
- Difficulty understanding access model
- Potential routing conflicts

**Recommended Structure**:
```
/programs/non-formal (public - list)
/programs/non-formal/:id (public - details)
/dashboard/programs/non-formal/applications (authenticated - my applications)
```

---

### 3. Shared Library Audit

#### Current Export Structure

**Main Export File**: `shared/src/index.ts` (82 lines of exports)

**Path Mapping**:
```json
{
  "@vet/shared": ["shared/src/index.ts"]
}
```

**No Secondary Entry Points**: Single monolithic barrel file exports everything.

#### Complete Export Inventory

##### UI Components (26 components)

**Heavy Components (High Bundle Cost)**:

1. **MapComponent** (`components/map/`)
   - Dependencies: `leaflet` library (~150KB)
   - Lazy loads map tiles
   - **Bundle Impact**: VERY HIGH

2. **DialogComponent** (`components/dialog/`)
   - Kendo imports: `GridModule`, `DialogsModule`, `ButtonsModule`, `PopoverModule`, `TooltipModule`, `IconModule`, `SVGIconModule`, `SwitchModule`
   - **Bundle Impact**: CRITICAL (~200KB+ with Kendo Grid)

3. **BreadcrumbComponent** (`components/breadcrumb/`)
   - Kendo: `BreadCrumbModule`, `TooltipModule`
   - **Imports entire `@progress/kendo-svg-icons` namespace**
   - Complex route data processing
   - **Bundle Impact**: VERY HIGH (~100KB+ with all Kendo icons)

4. **DatePickerComponent** (`components/date-picker/`)
   - Kendo: `KendoDatePickerComponent` from `@progress/kendo-angular-dateinputs`
   - Additional: `dayjs` with `customParseFormat` plugin
   - **Bundle Impact**: HIGH

5. **ResponsiveStepperComponent** (`components/responsive-stepper/`)
   - Kendo: `StepperComponent`, `TooltipDirective`
   - Complex Observable-based state management (32KB file size)
   - **Bundle Impact**: HIGH

6. **SelectorComponent** (`components/selector/`)
   - Kendo: `DropDownListComponent` + multiple directives
   - **Bundle Impact**: MEDIUM-HIGH

7. **EduactionStandartsComponent** (`components/education-standarts/`)
   - Kendo: `KENDO_TEXTBOX`, `KENDO_DIALOG`, `KENDO_LABEL`, `KENDO_SVGICON`, `KENDO_LOADER`
   - External dependency: `@vet/backend` (GeneralsService)
   - **Bundle Impact**: MEDIUM-HIGH

8. **NavbarComponent** (`ui/navbar/`)
   - Kendo: `KENDO_ICONS`, `KENDO_BUTTON`, full `kendoIcons` namespace
   - External: `@vet/backend` (Page, User), `@vet/auth`
   - **Bundle Impact**: MEDIUM

9. **FileUploadComponent** (`ui/file-upload/`)
   - Kendo: `SVGIconComponent`
   - **Bundle Impact**: LOW-MEDIUM

**Lighter Components** (17 components):
- ButtonComponent, InputComponent, CheckboxComponent, SwitchComponent
- IconComponent, IconButtonComponent, InfoComponent, DividerComponent
- AlertDialogOutletComponent, ConfirmationDialogOutletComponent
- DialogOutletComponent, SingleDialogOutletComponent
- ExpandableSidebarComponent, ExpandableSidebarMenuComponent
- RouterExpandableSidebarMenuComponent, ComponentOutletComponent

##### Icons (564KB Total, 86 Files)

**Location**: `shared/src/icons/`

**Exports**:
- 159 lines in `icons/index.ts`
- Custom `vetIcons` namespace (custom SVG icons)
- Vacancy-specific icons (separate export)
- Field icons (field_01 through field_10)
- ISCED icons (isced_01 through isced_08)
- **DEPRECATED**: Re-exports entire `@progress/kendo-svg-icons` as `kendoIcons`

**Bundle Impact**: CRITICAL (564KB for icons alone)

##### Services (13 services)

**Location**: `shared/src/services/`

1. ToastService - Notification system
2. ReloadService - Reload management
3. AlertDialogService - Alert dialogs
4. ConfirmationDialogService - Confirmation dialogs
5. AppDialogService - App-wide dialogs
6. RouteParamsService - Route parameter handling
7. LocalStorageService - Local storage wrapper
8. LocalStoredStateService - Local state persistence
9. SessionStorageService - Session storage wrapper
10. SessionStoredStateService - Session state persistence
11. BaseStoredStateService - Base class for stored state
12. NavigationService - Navigation helpers
13. Reloader utilities

**Bundle Impact**: LOW-MEDIUM (services are tree-shakeable)

##### Pipes (7 pipes)

**Location**: `shared/src/pipes/`

1. DateDiffPipe - Date difference formatting
2. FormatDatePipe - Date formatting
3. FormatDateTimePipe - DateTime formatting
4. FormatDateStringPipe - Date string formatting
5. UploadedFileUriPipe - File URI transformation
6. TransPipe - Translation
7. SanitizePipe - HTML sanitization

**Bundle Impact**: LOW (pipes are lightweight and tree-shakeable)

##### Validators (9 validators)

**Location**: `shared/src/validators/`

1. customPatternValidator - Custom regex
2. georgianLettersValidator - Georgian alphabet
3. englishLettersValidator - English alphabet
4. mobileNumberValidator - Phone validation
5. personalNumberValidator - Personal ID
6. scorePatternValidator - Score format
7. numericValidator - Numeric validation
8. withSignalValidation - Signal-based helper
9. conditionalValidator - Conditional validation helper

**Bundle Impact**: LOW (small utility functions)

##### Utilities

**Core Utility Files**:
- `shared.utils.ts` (13.8KB) - General utilities
- `shared.types.ts` (5.9KB) - TypeScript types
- `shared.constants.ts` (13.3KB) - Constants (BREAKPOINTS, countries list)
- `shared.injectors.ts` - Injection helpers
- `shared.signals.ts` - Signal utilities
- `shared.tokens.ts` - Injection tokens
- `shared.providers.ts` - Provider configs
- `shared.interceptors.ts` - HTTP interceptors
- `shared.guards.ts` - Route guards
- `shared.enums.ts` - Enumerations
- `shared.validators.ts` - Validation utilities
- `theme.service.ts` - Theme management
- `api-error-handling/` - Error handling system

**Bundle Impact**: LOW-MEDIUM (varies by utility)

#### Coupling Risk Assessment

**Critical Issues**:

1. **Single Import Pulls Everything**:
```typescript
// Developer writes this:
import { breadcrumb } from '@vet/shared';

// Webpack/Angular includes reference to ENTIRE shared library
// Including: Map, Dialog, all Kendo modules, 564KB icons
```

2. **Icon Import Disaster**:
```typescript
// BreadcrumbComponent imports:
import * as kendoIcons from '@progress/kendo-svg-icons';

// Result: ALL Kendo icons in bundle when breadcrumb is used
// Breadcrumb is used in nearly every route via breadcrumb() helper
```

3. **Component Cascades**:
```typescript
// DialogComponent imports:
import { GridModule } from '@progress/kendo-angular-grid';

// Even if you just want a simple dialog, you get full Kendo Grid
```

4. **Backend Coupling**:
```typescript
// NavbarComponent imports:
import { Page, User } from '@vet/backend';
import { AuthenticationService } from '@vet/auth';

// MainLayoutComponent includes NavbarComponent
// Result: MainLayoutComponent pulls in auth + backend libraries
```

#### Bundle Impact Tiers

**Tier 1 - Critical to Extract (Largest Impact)**:
1. **Icons** (564KB) - Must separate immediately
2. **DialogComponent** (~200KB+ with Kendo Grid)
3. **BreadcrumbComponent** (~100KB+ with Kendo icons)
4. **MapComponent** (~150KB with Leaflet)

**Estimated savings from Tier 1**: 500-800KB

**Tier 2 - High Impact**:
5. DatePickerComponent (Kendo DateInputs + dayjs)
6. ResponsiveStepperComponent (Kendo Layout + Tooltip)
7. SelectorComponent (Kendo Dropdowns)
8. EduactionStandartsComponent (Multiple Kendo + backend)
9. NavbarComponent (Auth/Backend coupling)

**Estimated savings from Tier 2**: 200-400KB

**Tier 3 - Organization Benefits**:
10. Dialog system (4 outlet components)
11. All other UI components
12. Services, pipes, validators (already tree-shakeable but better organization)

---

### 4. RBAC System Assessment

#### Available Guards

**Authentication Guards** (`authenticated.guard.ts`):
- `authenticatedGuard` - Ensures user has valid tokens
- `unAuthenticatedGuard` - Ensures user does NOT have tokens

**Role-Based Guards** (`guards/`):
- `hasRoleGuard(role: AuthRole)` - User has specific role
- `hasNotRoleGuard(role: AuthRole)` - User does NOT have role

**Permission-Based Guards** (`guards/`):
- `hasPermissionGuard(permission: AuthPermission)` - User has permission
- `hasNotPermissionGuard(permission: AuthPermission)` - User does NOT have permission

**Special Purpose**:
- `mandatoryFieldsGuard` - Profile completeness check
- `AccessControlGuard(control: AccessControl)` - Composable expressions

#### RBAC Types

**AuthRole** (3 roles):
```typescript
type AuthRole = 'Super Admin' | 'Default User' | 'Organisation';
```

**AuthPermission** (64 permissions) - Examples:
- Application: `viewAnyApplication`, `viewApplication`, `applyApplication`
- Profession Programs: `viewProfessionProgram`, `updateProfessionProgram`, `createProfessionProgram`, etc.
- Training/Retraining: `viewAnyTrainingRetraining`, `updateTrainingRetraining`, etc.
- Non-Formal: `viewAnyNonFormalEducation`, `updateNonFormalEducation`, etc.

**UserRolesService**:
```typescript
class UserRolesService {
  selectedAccount: Signal<UserAccount | null>
  hasRole(role: AuthRole): boolean
  can(permission: AuthPermission): boolean
  hasAccess(control: AccessControl): boolean
}
```

#### Critical Gap: No Route-Level RBAC

**Finding**: Permission and role guards **exist but are NEVER used in routes**.

**Current Route Guard Usage**:
```typescript
// Only uses basic authentication guards
canActivate: [authenticatedGuard]
canActivate: [mandatoryFieldsGuard]
canActivate: [unAuthenticatedGuard]

// NEVER USED in any route:
canActivate: [hasPermissionGuard('viewAnyApplication')]
canActivate: [hasRoleGuard('Super Admin')]
```

**Where RBAC Actually Happens**:
1. **In Templates** (via pipes):
```html
@if ('viewApplication' | can) { <button>View</button> }
@if ('Super Admin' | role) { <a>Admin Panel</a> }
@if (accessControl | hasAccess) { <div>Content</div> }
```

2. **In Components** (via service):
```typescript
isAdmin = computed(() => this.userRolesService.hasRole('Super Admin'));
canView = computed(() => this.userRolesService.can('viewAnyApplication'));
```

**Risk**: Direct URL navigation bypasses permission checks!

**Example Vulnerability**:
```typescript
// Dashboard route - ANY authenticated user can access
{ path: 'dashboard', canActivate: [authenticatedGuard] }

// Dashboard children have NO permission guards
children: [
  { path: 'programs/long/stats', loadComponent: ... }, // Should require 'viewAnyProfessionProgramStats'
  { path: 'programs/long/commission', loadComponent: ... }, // Should require commission permission
]
```

**Current Mitigation**: Components check permissions and show "Access Denied" UI. But component still loads and executes.

#### Guard Pattern Inconsistencies

**Issue 1: No Data-Driven Guards**

Guards don't read from `route.data`:
```typescript
// Current (factory pattern):
export function hasPermissionGuard(permission: AuthPermission): CanActivateFn {
  return () => { /* check permission */ }
}

// Usage:
canActivate: [hasPermissionGuard('viewApplication')]

// Cannot use declarative route data like:
data: { permission: 'viewApplication' },
canActivate: [permissionGuard] // doesn't exist
```

**Issue 2: Organisation Role Special Case**

'Organisation' role is magically added:
```typescript
// user-roles.service.ts
const roles = [
  ...(accountRoles ?? []),
  ...(selectedAccount()?.organisation ? ['Organisation'] as const : []),
];
```

Not in backend `roles` array, but added client-side. Inconsistent with other roles.

**Issue 3: No Guard Composition**

Must manually combine guards:
```typescript
canActivate: [authenticatedGuard, mandatoryFieldsGuard, hasPermissionGuard('viewApp')]
```

No helper for "require ANY role" or "require ALL permissions" at route level.

#### Access Control System

**Composable Functions** (`access-control/access-control.utils.ts`):
```typescript
isAuthenticated()        // User logged in
isGuest()                // User NOT logged in
can(permission)          // Has permission
canSome(...permissions)  // Has ANY permission
canEvery(...permissions) // Has ALL permissions
is(role)                 // Has role
isOneOf(...roles)        // Has ANY role
not(control)             // Negation
some(...controls)        // OR logic
every(...controls)       // AND logic
```

**Usage Example**:
```typescript
const control = every(
  isAuthenticated(),
  some(can('viewAnyApplication'), can('viewApplication'))
);
```

**AccessControlGuard** exists but **never used in routes**.

**Opportunity**: Use access control expressions in route data for complex authorization.

---

## Part 2: The Refactoring Plan

### Phase 1: Lazy Loading & Performance (PRIORITY)

**Goal**: Reduce initial bundle size by 60-70% through proper route-level code splitting.

**Estimated Impact**: Initial bundle drops from ~2-3MB to 400-800KB.

#### Step 1.1: Refactor `app.routes.ts` to Lazy Load All Features

**File**: `apps/vet/src/app/app.routes.ts`

**Changes**:
1. Remove all static route imports
2. Convert `children: importedRoutes` to `loadChildren: () => import(...)`
3. Make MainLayoutComponent lazy via `loadComponent`
4. Move guards to route boundaries (not inside lazy modules)
5. Change auth route path from `''` to `'auth'` to avoid collision

**Before**:
```typescript
import { organisationsRoutes } from '@vet/organisations';
import { dashboardRoutes } from '@vet/dashboard';
// ... 10+ more static imports
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';

export const appRoutes: Routes = [
  { path: 'dashboard', children: dashboardRoutes, canActivate: [] },
  {
    path: '',
    component: MainLayoutComponent, // Eager
    children: [
      { path: '', children: homeRoutes },
      { path: 'programs/short', children: shortTermProgramsRoutes },
      // ...
    ]
  }
];
```

**After**:
```typescript
import type { Routes } from '@angular/router';
// Only import guard functions and breadcrumb helper
import { authenticatedGuard, unAuthenticatedGuard } from '@vet/auth';
import { breadcrumb } from '@vet/shared/utils'; // From new entry point

export const appRoutes: Routes = [
  // ============================================
  // DASHBOARD - Authenticated Area
  // ============================================
  {
    path: 'dashboard',
    canActivate: [authenticatedGuard], // Guard at boundary
    data: breadcrumb([]),
    loadChildren: () =>
      import('@vet/dashboard').then(m => m.dashboardRoutes),
  },

  // ============================================
  // DYNAMIC PAGES - Public
  // ============================================
  {
    path: 'pages',
    loadChildren: () =>
      import('@vet/pages').then(m => m.pagesRoutes),
  },

  // ============================================
  // MAIN LAYOUT - Public/Mixed Routes
  // ============================================
  {
    path: '',
    loadComponent: () =>
      import('./layouts/main-layout/main-layout.component')
        .then(m => m.MainLayoutComponent), // Lazy loaded
    children: [
      // Home (Public)
      {
        path: '',
        pathMatch: 'full',
        loadChildren: () =>
          import('@vet/home').then(m => m.homeRoutes),
      },

      // Programs (Public catalog)
      {
        path: 'programs',
        children: [
          {
            path: '',
            pathMatch: 'full',
            loadChildren: () =>
              import('@vet/unauthorised-programs')
                .then(m => m.unauthorisedProgramsRoutes),
          },
          {
            path: 'short',
            data: breadcrumb([]),
            loadChildren: () =>
              import('@vet/short-term-programs')
                .then(m => m.shortTermProgramsRoutes),
          },
          {
            path: 'non-formal',
            data: breadcrumb([]),
            loadChildren: () =>
              import('@vet/non-formal-programs')
                .then(m => m.nonFormalProgramsRoutes),
          },
        ],
      },

      // Long-term Programs (Authenticated)
      {
        path: 'long-term-programs',
        canActivate: [authenticatedGuard],
        data: breadcrumb([]),
        loadChildren: () =>
          import('@vet/long-term-programs')
            .then(m => m.longTermProgramsRoutes),
      },

      // User Profile (Authenticated)
      {
        path: 'user-profile',
        canActivate: [authenticatedGuard],
        data: breadcrumb([]),
        loadChildren: () =>
          import('@vet/user-profile')
            .then(m => m.userProfileRoutes),
      },

      // Auth Routes (Unauthenticated)
      {
        path: 'auth', // Changed from '' to avoid collision
        canActivate: [unAuthenticatedGuard],
        data: breadcrumb([]),
        loadChildren: () =>
          import('@vet/auth').then(m => m.authRoutes),
      },

      // Vacancy (Public/Mixed)
      {
        path: 'vacancy',
        data: breadcrumb([]),
        loadChildren: () =>
          import('@vet/vacancy').then(m => m.vacancyRoutes),
      },

      // Organisations (Public)
      {
        path: 'organisations',
        data: breadcrumb([]),
        loadChildren: () =>
          import('@vet/organisations')
            .then(m => m.organisationsRoutes),
      },
    ],
  },
];
```

**Impact**:
- Initial bundle: Only auth library guards + breadcrumb helper
- MainLayoutComponent: Loads when user navigates to any route under `''`
- Each feature: Loads on-demand when route is accessed

#### Step 1.2: Update Dashboard Routes

**File**: `dashboard/src/routing/dashboard.routes.ts`

**Changes**:
1. Remove `authenticatedGuard` (now at app.routes.ts boundary)
2. Keep lazy loading for DashboardLayoutComponent
3. Remove empty `canActivate: []` arrays

**Before**:
```typescript
export const dashboardRoutes: Route[] = [
  {
    path: '',
    loadComponent: () => import('../dashboard-layout/dashboard-layout.component'),
    canActivate: [authenticatedGuard], // Redundant - now at parent
    // ...
  }
];
```

**After**:
```typescript
export const dashboardRoutes: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('../dashboard-layout/dashboard-layout.component')
        .then(m => m.DashboardLayoutComponent),
    // No guard needed - parent route has authenticatedGuard
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'programs/long',
      },
      {
        path: 'programs/long',
        loadChildren: () =>
          import('./long-term-programs-dashboard.routes')
            .then(m => m.longTermProgramsDashboardRoutes),
        data: breadcrumb([]),
      },
      {
        path: 'programs/short',
        loadChildren: () =>
          import('./short-term-programs-dashboard.routes')
            .then(m => m.shortTermProgramsDashboardRoutes),
        data: breadcrumb([]),
      },
      {
        path: 'programs/non-formal',
        loadChildren: () =>
          import('./non-formal-programs-dashboard.routes')
            .then(m => m.nonFormalProgramsDashboardRoutes),
        data: breadcrumb([]),
      },
    ],
  },
];
```

#### Step 1.3: Update Auth Routes for `/auth` Prefix

**File**: `auth/src/auth.routes.ts`

**Changes**:
1. Update path references from `/registration` to `/auth/registration` in breadcrumbs
2. No other changes needed (routes are already defined relatively)

**Before**:
```typescript
const baseBreadcrumbItems: AppBreadCrumbItem[] = [
  { path: '', text: 'shared.home' }
];

export const authRoutes: Route[] = [
  {
    path: 'registration',
    // breadcrumb: /registration/citizenship_selection
    children: [
      {
        path: 'citizenship_selection',
        data: breadcrumb([
          ...baseBreadcrumbItems,
          { path: '/registration/citizenship_selection', text: '...' },
        ]),
      },
    ]
  }
];
```

**After**:
```typescript
const baseBreadcrumbItems: AppBreadCrumbItem[] = [
  { path: '', text: 'shared.home' }
];

export const authRoutes: Route[] = [
  {
    path: 'registration', // Still relative
    // breadcrumb updated to reflect full path
    children: [
      {
        path: 'citizenship_selection',
        data: breadcrumb([
          ...baseBreadcrumbItems,
          {
            path: '/auth/registration/citizenship_selection',
            text: 'auth.citizenship_selection'
          },
        ]),
      },
      // Update all other breadcrumb paths similarly
    ]
  }
];
```

**Note**: Must update all navigation links in components:
```typescript
// Before
this.router.navigate(['/registration']);

// After
this.router.navigate(['/auth/registration']);
```

#### Step 1.4: Ensure Feature Libraries Export Routes Correctly

**Files**: All `**/src/index.ts` in feature libraries

**Requirement**: Routes must be exported for dynamic `import().then(m => m.routes)` to work.

**Check Each Library**:
- `dashboard/src/index.ts` → `export * from './routing/dashboard.routes';`
- `pages/src/index.ts` → `export * from './pages.routes';`
- `auth/src/index.ts` → `export * from './auth.routes';`
- etc.

**Example** (`long-term-programs/src/index.ts`):
```typescript
// Must export routes for lazy loading
export * from './long-term-program.routes';

// Other exports
export * from './long-term-programs.signals';
export * from './long-term-programs.resources';
// ...
```

#### Step 1.5: Update Navigation Links for `/auth` Path Change

**Files to Search**: All components with links to `/registration`

**Command**:
```bash
# Find all registration links
grep -r "'/registration" --include="*.ts" --include="*.html" libs/ apps/
```

**Update Pattern**:
```typescript
// Component TypeScript
this.router.navigate(['/auth/registration']);

// Template HTML
<a routerLink="/auth/registration">Register</a>

// RouterLink array syntax
[routerLink]="['/auth', 'registration']"
```

---

### Phase 2: Shared Library De-cluttering

**Goal**: Enable tree-shaking by splitting monolithic `@vet/shared` into secondary entry points.

**Estimated Impact**: Reduce shared library bundle overhead by 40-60% (500-800KB savings).

#### Step 2.1: Create Secondary Entry Point Structure

**New Directory Structure**:
```
shared/
├── src/
│   ├── index.ts (backward compatible)
│   ├── icons/
│   │   └── index.ts (already exists)
│   ├── heavy-components/
│   │   └── index.ts (new)
│   ├── ui-components/
│   │   └── index.ts (new)
│   ├── dialogs/
│   │   └── index.ts (new)
│   ├── navbar/
│   │   └── index.ts (new)
│   ├── services/
│   │   └── index.ts (new)
│   ├── pipes/
│   │   └── index.ts (new)
│   ├── validators/
│   │   └── index.ts (new)
│   └── utils/
│       └── index.ts (new)
```

#### Step 2.2: Update `tsconfig.base.json` with Path Mappings

**File**: `tsconfig.base.json`

**Add Secondary Entry Points**:
```json
{
  "compilerOptions": {
    "paths": {
      // Main entry (backward compatible - re-exports everything)
      "@vet/shared": ["shared/src/index.ts"],

      // Secondary Entry Points (Tier 1 - Critical)
      "@vet/shared/icons": ["shared/src/icons/index.ts"],
      "@vet/shared/heavy-components": ["shared/src/heavy-components/index.ts"],

      // Secondary Entry Points (Tier 2)
      "@vet/shared/ui-components": ["shared/src/ui-components/index.ts"],
      "@vet/shared/dialogs": ["shared/src/dialogs/index.ts"],
      "@vet/shared/navbar": ["shared/src/navbar/index.ts"],

      // Secondary Entry Points (Tier 3)
      "@vet/shared/services": ["shared/src/services/index.ts"],
      "@vet/shared/pipes": ["shared/src/pipes/index.ts"],
      "@vet/shared/validators": ["shared/src/validators/index.ts"],
      "@vet/shared/utils": ["shared/src/utils/index.ts"],

      // Existing paths...
      "@vet/auth": ["auth/src/index.ts"],
      // ...
    }
  }
}
```

#### Step 2.3: Create Entry Point Files

**Create `shared/src/icons/index.ts`** (already exists - just verify):
```typescript
// Existing exports
export * from '../icons/icons-module';
export { vetIcons } from '../icons';
export { vacancyIconsLibrary } from '../icons/vacancy-icons';

// REMOVE: Deprecated Kendo icons re-export
// export * as kendoIcons from '@progress/kendo-svg-icons'; // DELETE THIS
```

**Create `shared/src/heavy-components/index.ts`**:
```typescript
// High bundle cost components
export * from '../components/map/map.component';
export * from '../components/dialog/dialog.component';
export * from '../components/breadcrumb/breadcrumb.component';
export * from '../components/date-picker/date-picker.component';
export * from '../components/responsive-stepper/responsive-stepper.component';
export * from '../components/selector/selector.component';
export * from '../components/education-standarts/eduaction-standarts.component';
```

**Create `shared/src/ui-components/index.ts`**:
```typescript
// Lightweight, frequently-used components
export * from '../components/button/button.component';
export * from '../components/input/input.component';
export * from '../components/checkbox/checkbox.component';
export * from '../components/switch/switch.component';
export * from '../components/icon/icon.component';
export * from '../components/icon-button/icon-button.component';
export * from '../components/info/info.component';
export * from '../components/divider/divider.component';
export * from '../components/expandable-sidebar/expandable-sidebar.component';
export * from '../components/expandable-sidebar-menu/expandable-sidebar-menu.component';
export * from '../components/router-expandable-sidebar-menu/router-expandable-sidebar-menu.component';
```

**Create `shared/src/dialogs/index.ts`**:
```typescript
// Dialog system
export * from '../components/dialog-outlet/dialog-outlet.component';
export * from '../components/alert-dialog-outlet/alert-dialog-outlet.component';
export * from '../components/confirmation-dialog-outlet/confirmation-dialog-outlet.component';
export * from '../components/single-dialog-outlet/single-dialog-outlet.component';
export * from '../services/alert-dialog.service';
export * from '../services/confirmation-dialog.service';
export * from '../services/app-dialog.service';
```

**Create `shared/src/navbar/index.ts`**:
```typescript
// Navbar with external dependencies
export * from '../ui/navbar/navbar.component';
export * from '../ui/navbar/navbar-logo.directive';
export * from '../ui/file-upload/file-upload.component';
```

**Create `shared/src/services/index.ts`**:
```typescript
// Services
export * from '../services/toast.service';
export * from '../services/reload.service';
export * from '../services/route-params.service';
export * from '../services/local-storage.service';
export * from '../services/local-stored-state.service';
export * from '../services/session-storage.service';
export * from '../services/session-stored-state.service';
export * from '../services/navigation.service';
export * from '../services/reloader';
```

**Create `shared/src/pipes/index.ts`**:
```typescript
// Pipes
export * from '../pipes/date-diff.pipe';
export * from '../pipes/format-date.pipe';
export * from '../pipes/format-date-time.pipe';
export * from '../pipes/format-date-string.pipe';
export * from '../pipes/uploaded-file-uri.pipe';
export * from '../pipes/trans.pipe';
export * from '../pipes/sanitize.pipe';
```

**Create `shared/src/validators/index.ts`**:
```typescript
// Validators
export * from '../validators/custom-pattern-validator';
export * from '../validators/georgian-letters-validator';
export * from '../validators/english-letters-validator';
export * from '../validators/mobile-number-validator';
export * from '../validators/personal-number-validator';
export * from '../validators/score-pattern-validator';
export * from '../validators/numeric-validator';
export * from '../shared.validators'; // withSignalValidation, conditionalValidator
```

**Create `shared/src/utils/index.ts`**:
```typescript
// Utilities and routing helpers
export * from '../shared.utils';
export * from '../shared.types';
export * from '../shared.constants';
export * from '../shared.injectors';
export * from '../shared.signals';
export * from '../shared.tokens';
export * from '../shared.providers';
export * from '../shared.interceptors';
export * from '../shared.guards';
export * from '../shared.enums';
export * from '../theme.service';
export * from '../coercion/number-property';
export * from '../http-request-options';
export * from '../use-http-contexts';
export * from '../vet-provide';
export * from '../api-error-handling/api-error-ctx';
export * from '../api-error-handling/api-error.interceptor';

// Breadcrumb helper (frequently used in routes)
export { breadcrumb, type AppBreadCrumbItem } from '../components/breadcrumb/breadcrumb.component';
```

**Update `shared/src/index.ts`** (backward compatible):
```typescript
// Re-export all secondary entry points for backward compatibility
// Gradually migrate imports to specific entry points

export * from './icons/index';
export * from './heavy-components/index';
export * from './ui-components/index';
export * from './dialogs/index';
export * from './navbar/index';
export * from './services/index';
export * from './pipes/index';
export * from './validators/index';
export * from './utils/index';

// Other exports
export * from './toast.module';
export * from './component-outlet.component';
```

#### Step 2.4: Gradual Migration Strategy

**Priority Order** (migrate in phases):

**Phase 2A - Critical (Immediate 500KB+ savings)**:
1. Icons: `@vet/shared/icons`
2. Heavy components: `@vet/shared/heavy-components`

**Migration Script** (manual or automated):
```bash
# Find all MapComponent imports
grep -r "import.*MapComponent.*from '@vet/shared'" --include="*.ts" libs/ apps/

# Replace with:
# import { MapComponent } from '@vet/shared/heavy-components';
```

**Phase 2B - High Impact**:
3. Dialogs: `@vet/shared/dialogs`
4. UI components: `@vet/shared/ui-components`
5. Navbar: `@vet/shared/navbar`

**Phase 2C - Organization**:
6. Services: `@vet/shared/services`
7. Pipes: `@vet/shared/pipes`
8. Validators: `@vet/shared/validators`

**Migration Examples**:

```typescript
// BEFORE
import {
  MapComponent,
  ButtonComponent,
  ToastService,
  FormatDatePipe,
  breadcrumb
} from '@vet/shared';

// AFTER
import { MapComponent } from '@vet/shared/heavy-components';
import { ButtonComponent } from '@vet/shared/ui-components';
import { ToastService } from '@vet/shared/services';
import { FormatDatePipe } from '@vet/shared/pipes';
import { breadcrumb } from '@vet/shared/utils';
```

**Automated Migration** (codemod with regex):
```javascript
// Find: import \{ (.+MapComponent.+) \} from '@vet/shared';
// Replace: import { $1 } from '@vet/shared/heavy-components';
```

#### Step 2.5: Remove Deprecated Kendo Icons Re-export

**File**: `shared/src/icons/index.ts`

**Delete**:
```typescript
// REMOVE THIS LINE - DEPRECATED
export * as kendoIcons from '@progress/kendo-svg-icons';
```

**Migration**:
```bash
# Find all kendoIcons usages
grep -r "kendoIcons" --include="*.ts" libs/ apps/

# Replace with direct Kendo import:
import { arrowLeftIcon } from '@progress/kendo-svg-icons';
```

**Impact**: Prevents accidental import of all Kendo icons (~100KB).

---

### Phase 3: RBAC Standardization

**Goal**: Implement declarative, route-level RBAC using route data and guards.

**Impact**: Security hardening, consistent authorization pattern, easier to audit.

#### Step 3.1: Define Route Data Interface

**Create `shared/src/utils/route-data.types.ts`**:
```typescript
import { type AuthRole, type AuthPermission } from '@vet/auth';

/**
 * Standard route data interface for VET-UI routes.
 * Extends Angular's built-in Data interface.
 */
export interface VetRouteData {
  // ============================================
  // RBAC - Access Control
  // ============================================
  /**
   * Required roles for this route.
   * User must have ANY of these roles.
   * Use with permissionGuard.
   */
  roles?: AuthRole[];

  /**
   * Required permissions for this route.
   * User must have ALL of these permissions.
   * Use with permissionGuard.
   */
  permissions?: AuthPermission[];

  /**
   * Complex access control expression.
   * Use with AccessControlGuard for custom logic.
   * Example: every(isAuthenticated(), some(can('viewApp'), can('viewAnyApp')))
   */
  accessControl?: AccessControl;

  // ============================================
  // UI Metadata
  // ============================================
  /**
   * Hide this route from navigation menus.
   * Default: false
   */
  hideFromMenu?: boolean;

  /**
   * Icon for navigation menu item.
   */
  menuIcon?: string;

  /**
   * Display label for navigation menu item.
   * Falls back to route path if not provided.
   */
  menuLabel?: string;

  /**
   * Sort order in navigation menu (lower = higher).
   * Default: 999
   */
  menuOrder?: number;

  // ============================================
  // Breadcrumb (existing)
  // ============================================
  /**
   * Breadcrumb configuration.
   * Use breadcrumb() helper function.
   */
  breadcrumb?: any[];
}

/**
 * Type guard for VET route data.
 */
export function isVetRouteData(data: unknown): data is VetRouteData {
  return typeof data === 'object' && data !== null;
}
```

**Export from utils**:
```typescript
// shared/src/utils/index.ts
export * from './route-data.types';
```

#### Step 3.2: Create Generic Permission Guard

**Create `auth/src/guards/permission.guard.ts`**:
```typescript
import { inject } from '@angular/core';
import {
  type CanActivateFn,
  type ActivatedRouteSnapshot,
  Router,
  RedirectCommand
} from '@angular/router';
import { toObservable } from '@angular/core/rxjs-interop';
import { combineLatest, filter, map, take } from 'rxjs';
import { UserRolesService } from '../user-roles.service';
import { AuthenticationService } from '../authentication.service';
import type { AuthRole, AuthPermission } from '../auth.types';

/**
 * Generic permission guard that reads roles/permissions from route data.
 *
 * Use on routes that need role OR permission checks based on route configuration.
 *
 * @example
 * ```typescript
 * {
 *   path: 'admin',
 *   canActivate: [permissionGuard],
 *   data: {
 *     roles: ['Super Admin'],
 *     permissions: ['viewAnyApplication']
 *   }
 * }
 * ```
 *
 * Authorization Logic:
 * - If `roles` specified: User must have ANY of the roles
 * - If `permissions` specified: User must have ALL of the permissions
 * - If both specified: User must satisfy BOTH conditions (AND logic)
 * - If neither specified: Access granted (guard is a no-op)
 *
 * Redirect Behavior:
 * - No selected account: Redirect to home ('/')
 * - Missing required role/permission: Redirect to dashboard ('/dashboard')
 */
export const permissionGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const userRolesService = inject(UserRolesService);
  const authenticationService = inject(AuthenticationService);
  const router = inject(Router);

  const requiredRoles = route.data['roles'] as AuthRole[] | undefined;
  const requiredPermissions = route.data['permissions'] as AuthPermission[] | undefined;

  // If no requirements specified, allow access
  if (!requiredRoles?.length && !requiredPermissions?.length) {
    console.warn(
      `permissionGuard applied to route '${route.url}' but no roles/permissions configured.`
    );
    return true;
  }

  return combineLatest([
    toObservable(authenticationService.isReady),
    toObservable(userRolesService.isUserAccountsLoaded),
  ]).pipe(
    filter(([authReady, rolesLoaded]) => authReady && rolesLoaded),
    take(1),
    map(() => {
      const selectedAccount = userRolesService.selectedAccount();

      if (!selectedAccount) {
        console.warn('permissionGuard: No selected account, redirecting to home');
        return new RedirectCommand(router.parseUrl('/'));
      }

      // Check roles (user must have ANY of the required roles)
      if (requiredRoles?.length) {
        const hasRequiredRole = requiredRoles.some(role =>
          userRolesService.hasRole(role)
        );
        if (!hasRequiredRole) {
          console.warn(
            `permissionGuard: User lacks required role. Required: ${requiredRoles.join(' | ')}, Has: ${userRolesService.accountRoles.join(', ')}`
          );
          return new RedirectCommand(router.parseUrl('/dashboard'));
        }
      }

      // Check permissions (user must have ALL required permissions)
      if (requiredPermissions?.length) {
        const missingPermissions = requiredPermissions.filter(
          permission => !userRolesService.can(permission)
        );
        if (missingPermissions.length > 0) {
          console.warn(
            `permissionGuard: User lacks required permissions: ${missingPermissions.join(', ')}`
          );
          return new RedirectCommand(router.parseUrl('/dashboard'));
        }
      }

      return true;
    }),
  );
};
```

**Export from auth library**:
```typescript
// auth/src/index.ts
export * from './guards/permission.guard';
```

#### Step 3.3: Apply Guards to Dashboard Routes

**File**: `dashboard/src/routing/long-term-programs-dashboard.routes.ts`

**Before** (no permission guards):
```typescript
export const longTermProgramsDashboardRoutes: Route[] = [
  {
    path: 'stats',
    loadComponent: () => import('../views/stats/stats.component'),
  },
  {
    path: 'commission',
    loadComponent: () => import('../views/commission/commission.component'),
  },
  // ...
];
```

**After** (with permission guards):
```typescript
import { permissionGuard } from '@vet/auth';
import { breadcrumb } from '@vet/shared/utils';

export const longTermProgramsDashboardRoutes: Route[] = [
  {
    path: 'stats',
    loadComponent: () =>
      import('../views/stats/stats.component')
        .then(m => m.StatsComponent),
    canActivate: [permissionGuard],
    data: {
      permissions: ['viewAnyProfessionProgramStats'],
      ...breadcrumb([
        { path: '/dashboard', text: 'dashboard.title' },
        { path: '/dashboard/programs/long/stats', text: 'dashboard.stats' },
      ]),
    },
  },
  {
    path: 'commission',
    loadComponent: () =>
      import('../views/commission/commission.component')
        .then(m => m.CommissionComponent),
    canActivate: [permissionGuard],
    data: {
      permissions: ['viewProfessionProgramCommissionMember'], // Example permission
      ...breadcrumb([
        { path: '/dashboard', text: 'dashboard.title' },
        { path: '/dashboard/programs/long/commission', text: 'dashboard.commission' },
      ]),
    },
  },
  {
    path: 'exam-cards',
    loadComponent: () =>
      import('../views/exam-cards/exam-cards.component')
        .then(m => m.ExamCardsComponent),
    canActivate: [permissionGuard],
    data: {
      permissions: ['viewProfessionProgramExamCard'],
      ...breadcrumb([/* ... */]),
    },
  },
  // Apply to all sensitive routes...
];
```

**Repeat for**:
- `short-term-programs-dashboard.routes.ts`
- `non-formal-programs-dashboard.routes.ts`
- Any admin-specific routes

#### Step 3.4: Create Navigation Filter Service

**Create `shared/src/services/navigation-filter.service.ts`**:
```typescript
import { Injectable, inject, computed, type Signal } from '@angular/core';
import { Router, type Routes, type Route } from '@angular/router';
import { UserRolesService } from '@vet/auth';
import type { AuthRole, AuthPermission } from '@vet/auth';

export interface NavigationItem {
  path: string;
  label: string;
  icon?: string;
  order?: number;
  children?: NavigationItem[];
}

/**
 * Service for filtering navigation items based on user permissions.
 *
 * Usage:
 * - Automatically filters routes based on route.data.roles and route.data.permissions
 * - Hides routes with route.data.hideFromMenu = true
 * - Provides reactive navigation list that updates when user account changes
 */
@Injectable({ providedIn: 'root' })
export class NavigationFilterService {
  private router = inject(Router);
  private userRolesService = inject(UserRolesService);

  /**
   * Filtered navigation items based on current user's permissions.
   * Updates reactively when user switches accounts or roles change.
   */
  filteredNavigation: Signal<NavigationItem[]> = computed(() => {
    const selectedAccount = this.userRolesService.selectedAccount();
    if (!selectedAccount) return [];

    return this.filterRoutes(this.router.config);
  });

  /**
   * Filter routes based on user permissions.
   */
  private filterRoutes(routes: Routes): NavigationItem[] {
    return routes
      .filter(route => this.canAccessRoute(route))
      .map(route => this.routeToNavItem(route))
      .filter((item): item is NavigationItem => item !== null)
      .sort((a, b) => (a.order ?? 999) - (b.order ?? 999));
  }

  /**
   * Check if user can access a route based on route data.
   */
  private canAccessRoute(route: Route): boolean {
    const data = route.data;
    if (!data) return true;

    // Hide from menu explicitly
    if (data['hideFromMenu']) return false;

    // Check roles (user must have ANY of the required roles)
    const requiredRoles = data['roles'] as AuthRole[] | undefined;
    if (requiredRoles?.length) {
      const hasRole = requiredRoles.some(role =>
        this.userRolesService.hasRole(role)
      );
      if (!hasRole) return false;
    }

    // Check permissions (user must have ALL required permissions)
    const requiredPermissions = data['permissions'] as AuthPermission[] | undefined;
    if (requiredPermissions?.length) {
      const hasAllPermissions = requiredPermissions.every(permission =>
        this.userRolesService.can(permission)
      );
      if (!hasAllPermissions) return false;
    }

    return true;
  }

  /**
   * Convert route to navigation item.
   */
  private routeToNavItem(route: Route): NavigationItem | null {
    if (!route.path) return null;

    const data = route.data;
    const children = route.children
      ? this.filterRoutes(route.children)
      : undefined;

    return {
      path: `/${route.path}`,
      label: data?.['menuLabel'] ?? route.path,
      icon: data?.['menuIcon'],
      order: data?.['menuOrder'],
      children: children?.length ? children : undefined,
    };
  }
}
```

**Export from services**:
```typescript
// shared/src/services/index.ts
export * from './navigation-filter.service';
```

#### Step 3.5: Use Navigation Filter in Sidebar

**File**: `dashboard/src/dashboard-layout/sidebar/sidebar.component.ts`

**Before** (hardcoded navigation):
```typescript
@Component({
  selector: 'vet-sidebar',
  template: `
    <a routerLink="/dashboard/programs/long">Long Programs</a>
    <a routerLink="/dashboard/programs/short">Short Programs</a>
    <!-- ... -->
  `,
})
export class SidebarComponent {
  // Hardcoded menu items
}
```

**After** (filtered navigation):
```typescript
import { Component, inject, computed } from '@angular/core';
import { NavigationFilterService } from '@vet/shared/services';
import { Router } from '@angular/router';

@Component({
  selector: 'vet-sidebar',
  template: `
    @for (item of dashboardNavigation(); track item.path) {
      <a
        [routerLink]="item.path"
        [class.active]="isActive(item.path)">
        @if (item.icon) {
          <kendo-icon [name]="item.icon"></kendo-icon>
        }
        {{ item.label | trans }}
      </a>
    }
  `,
  standalone: true,
  // ...
})
export class SidebarComponent {
  private navigationService = inject(NavigationFilterService);
  private router = inject(Router);

  /**
   * Get navigation items under /dashboard route.
   */
  dashboardNavigation = computed(() => {
    const allNav = this.navigationService.filteredNavigation();
    const dashboardRoute = allNav.find(item => item.path === '/dashboard');
    return dashboardRoute?.children ?? [];
  });

  isActive(path: string): boolean {
    return this.router.url.startsWith(path);
  }
}
```

#### Step 3.6: Add Route Data to Dashboard Routes

**Example**: Add menu metadata to dashboard routes

**File**: `dashboard/src/routing/long-term-programs-dashboard.routes.ts`

```typescript
export const longTermProgramsDashboardRoutes: Route[] = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'stats', // or main dashboard view
  },
  {
    path: 'stats',
    loadComponent: () => import('../views/stats/stats.component'),
    canActivate: [permissionGuard],
    data: {
      permissions: ['viewAnyProfessionProgramStats'],
      menuLabel: 'dashboard.stats',
      menuIcon: 'chart-line-up',
      menuOrder: 1,
      ...breadcrumb([/* ... */]),
    },
  },
  {
    path: 'commission',
    loadComponent: () => import('../views/commission/commission.component'),
    canActivate: [permissionGuard],
    data: {
      permissions: ['viewProfessionProgramCommissionMember'],
      menuLabel: 'dashboard.commission',
      menuIcon: 'users',
      menuOrder: 2,
      ...breadcrumb([/* ... */]),
    },
  },
  {
    path: 'internal-admin-only',
    loadComponent: () => import('../views/admin/admin.component'),
    canActivate: [permissionGuard],
    data: {
      permissions: ['viewAnyApplication'],
      hideFromMenu: true, // Hidden from sidebar, but accessible by direct URL
      ...breadcrumb([/* ... */]),
    },
  },
];
```

---

## Part 3: Implementation Checklist

### Phase 1: Lazy Loading ✅

- [ ] **Step 1.1**: Refactor `app.routes.ts`
  - [ ] Remove all static route imports
  - [ ] Convert to `loadChildren` for all features
  - [ ] Convert MainLayoutComponent to `loadComponent`
  - [ ] Move guards to route boundaries
  - [ ] Change auth path from `''` to `'auth'`
  - [ ] Update breadcrumb imports to `@vet/shared/utils`

- [ ] **Step 1.2**: Update `dashboard/src/routing/dashboard.routes.ts`
  - [ ] Remove redundant `authenticatedGuard` from layout route
  - [ ] Remove empty `canActivate: []` arrays
  - [ ] Ensure dashboard child routes use `loadChildren`

- [ ] **Step 1.3**: Update `auth/src/auth.routes.ts`
  - [ ] Update breadcrumb paths from `/registration/*` to `/auth/registration/*`
  - [ ] Verify all relative paths still work

- [ ] **Step 1.4**: Verify feature library exports
  - [ ] Check `dashboard/src/index.ts` exports routes
  - [ ] Check `pages/src/index.ts` exports routes
  - [ ] Check `auth/src/index.ts` exports routes
  - [ ] Check all other feature libraries export routes

- [ ] **Step 1.5**: Update navigation links
  - [ ] Search for `'/registration'` in all files
  - [ ] Replace with `'/auth/registration'`
  - [ ] Search for `routerLink="/registration"`
  - [ ] Replace with `routerLink="/auth/registration"`
  - [ ] Update any programmatic navigation in components

- [ ] **Testing**:
  - [ ] Run build: `npx nx build vet --stats-json`
  - [ ] Analyze bundle: Check for separate chunk files
  - [ ] Test all routes load correctly
  - [ ] Verify guards still work at boundaries
  - [ ] Check that unauthenticated users can't access dashboard
  - [ ] Check breadcrumbs render correctly

### Phase 2: Shared Library De-cluttering ✅

- [ ] **Step 2.1**: Create directory structure
  - [ ] Create `shared/src/heavy-components/`
  - [ ] Create `shared/src/ui-components/`
  - [ ] Create `shared/src/dialogs/`
  - [ ] Create `shared/src/navbar/`
  - [ ] Create `shared/src/services/`
  - [ ] Create `shared/src/pipes/`
  - [ ] Create `shared/src/validators/`
  - [ ] Create `shared/src/utils/`

- [ ] **Step 2.2**: Update `tsconfig.base.json`
  - [ ] Add all secondary entry point paths
  - [ ] Verify syntax is correct

- [ ] **Step 2.3**: Create entry point files
  - [ ] Create `heavy-components/index.ts`
  - [ ] Create `ui-components/index.ts`
  - [ ] Create `dialogs/index.ts`
  - [ ] Create `navbar/index.ts`
  - [ ] Create `services/index.ts`
  - [ ] Create `pipes/index.ts`
  - [ ] Create `validators/index.ts`
  - [ ] Create `utils/index.ts` (include breadcrumb helper)
  - [ ] Update `shared/src/index.ts` to re-export all for backward compat

- [ ] **Step 2.4**: Migrate imports (gradual)
  - [ ] **Phase 2A** (Critical - Do First):
    - [ ] Migrate icon imports to `@vet/shared/icons`
    - [ ] Migrate MapComponent to `@vet/shared/heavy-components`
    - [ ] Migrate DialogComponent to `@vet/shared/heavy-components`
    - [ ] Migrate BreadcrumbComponent (check usage - might stay in utils)
  - [ ] **Phase 2B** (High Impact):
    - [ ] Migrate all dialog services to `@vet/shared/dialogs`
    - [ ] Migrate common UI components to `@vet/shared/ui-components`
    - [ ] Migrate NavbarComponent to `@vet/shared/navbar`
  - [ ] **Phase 2C** (Organization):
    - [ ] Migrate services to `@vet/shared/services`
    - [ ] Migrate pipes to `@vet/shared/pipes`
    - [ ] Migrate validators to `@vet/shared/validators`

- [ ] **Step 2.5**: Remove deprecated exports
  - [ ] Remove `kendoIcons` re-export from `icons/index.ts`
  - [ ] Update any components using `kendoIcons` to import directly from Kendo

- [ ] **Testing**:
  - [ ] Run build: `npx nx build vet`
  - [ ] Check bundle sizes before/after
  - [ ] Verify all imports resolve correctly
  - [ ] Test that app still works after each migration phase

### Phase 3: RBAC Standardization ✅

- [ ] **Step 3.1**: Define route data interface
  - [ ] Create `shared/src/utils/route-data.types.ts`
  - [ ] Define `VetRouteData` interface
  - [ ] Export from `@vet/shared/utils`

- [ ] **Step 3.2**: Create generic permission guard
  - [ ] Create `auth/src/guards/permission.guard.ts`
  - [ ] Implement `permissionGuard` with route data reading
  - [ ] Add logging for debugging
  - [ ] Export from `@vet/auth`

- [ ] **Step 3.3**: Apply guards to dashboard routes
  - [ ] Add `permissionGuard` to long-term dashboard routes
  - [ ] Add `permissionGuard` to short-term dashboard routes
  - [ ] Add `permissionGuard` to non-formal dashboard routes
  - [ ] Configure `roles` and `permissions` in route data

- [ ] **Step 3.4**: Create navigation filter service
  - [ ] Create `shared/src/services/navigation-filter.service.ts`
  - [ ] Implement route filtering based on permissions
  - [ ] Export from `@vet/shared/services`

- [ ] **Step 3.5**: Update sidebar to use navigation filter
  - [ ] Refactor `dashboard/src/dashboard-layout/sidebar/sidebar.component.ts`
  - [ ] Use `NavigationFilterService` for menu items
  - [ ] Remove hardcoded menu items

- [ ] **Step 3.6**: Add menu metadata to routes
  - [ ] Add `menuLabel`, `menuIcon`, `menuOrder` to dashboard routes
  - [ ] Use `hideFromMenu: true` for internal routes

- [ ] **Testing**:
  - [ ] Test with Super Admin account - should see all menu items
  - [ ] Test with Default User - should see limited menu
  - [ ] Test with Organisation role - verify correct access
  - [ ] Test direct URL navigation - guards should block unauthorized access
  - [ ] Verify console warnings when permission is missing

---

## Part 4: Refactoring Execution Prompts

### For Phase 1: Lazy Loading

**Prompt for Claude Code**:

```
Task: Implement Phase 1 - Lazy Loading Refactoring for VET-UI

Context:
- Currently all route modules are imported statically in app.routes.ts
- This causes the entire application bundle to load on initial page visit
- Goal is to convert to lazy-loaded route modules for 60-70% bundle reduction

Requirements:

1. Refactor apps/vet/src/app/app.routes.ts:
   - Convert all static route imports to dynamic loadChildren
   - Change MainLayoutComponent from static import to loadComponent
   - Move authenticatedGuard from dashboard internal routes to app route boundary
   - Change auth route path from '' to 'auth'
   - Update breadcrumb import to use @vet/shared/utils (to be created)

2. Update dashboard/src/routing/dashboard.routes.ts:
   - Remove authenticatedGuard from DashboardLayoutComponent route (now at parent)
   - Remove empty canActivate: [] arrays
   - Ensure child routes use loadChildren pattern

3. Update auth/src/auth.routes.ts:
   - Update breadcrumb paths from /registration/* to /auth/registration/*
   - No changes to route structure, just breadcrumb data

4. Verify feature library exports:
   - Ensure dashboard/src/index.ts exports dashboardRoutes
   - Ensure pages/src/index.ts exports pagesRoutes
   - Ensure auth/src/index.ts exports authRoutes
   - All other feature libraries export their routes

5. Update navigation links (search and replace):
   - Find all instances of '/registration' and replace with '/auth/registration'
   - Include TypeScript files and HTML templates

Files to modify:
- apps/vet/src/app/app.routes.ts (primary changes)
- dashboard/src/routing/dashboard.routes.ts
- auth/src/auth.routes.ts
- All components with registration links

Constraints:
- Preserve all existing route data (especially breadcrumb configurations)
- Do not modify vacancy library
- Keep all guards functional
- Maintain backward compatibility for all routes except /registration -> /auth/registration

After completion:
- Run: npx nx build vet --stats-json
- Verify separate chunk files are created for each feature library
- Test that all routes still work
```

### For Phase 2A: Shared Library Icons Split

**Prompt for Claude Code**:

```
Task: Implement Phase 2A - Extract Icons from Shared Library

Context:
- The @vet/shared library includes 564KB of icons in a single barrel export
- Every import from @vet/shared pulls in all icons
- Goal is to create @vet/shared/icons secondary entry point

Requirements:

1. Update tsconfig.base.json:
   - Add path mapping: "@vet/shared/icons": ["shared/src/icons/index.ts"]
   - Add path mapping: "@vet/shared/utils": ["shared/src/utils/index.ts"]

2. Create shared/src/utils/index.ts:
   - Export breadcrumb helper: export { breadcrumb, type AppBreadCrumbItem } from '../components/breadcrumb/breadcrumb.component';
   - Export all utility files (shared.utils, shared.types, etc.)

3. Verify shared/src/icons/index.ts exists and exports:
   - vetIcons namespace
   - vacancyIconsLibrary
   - REMOVE deprecated: export * as kendoIcons from '@progress/kendo-svg-icons'

4. Update all icon imports in codebase:
   - Find: import { vetIcons } from '@vet/shared'
   - Replace: import { vetIcons } from '@vet/shared/icons'

5. Update breadcrumb imports:
   - Find: import { breadcrumb } from '@vet/shared'
   - Replace: import { breadcrumb } from '@vet/shared/utils'

6. Update components using kendoIcons:
   - Find: import { kendoIcons } from '@vet/shared/icons'
   - Replace: import { arrowLeftIcon } from '@progress/kendo-svg-icons' (specific icon imports)

Files to search:
- All TypeScript files in libs/ and apps/

After completion:
- Run build and verify bundle size reduction
- Test that all icons still render correctly
```

### For Phase 2B: Heavy Components Extraction

**Prompt for Claude Code**:

```
Task: Implement Phase 2B - Extract Heavy Components from Shared Library

Context:
- MapComponent, DialogComponent, and other heavy components cause large bundle overhead
- Goal is to create @vet/shared/heavy-components entry point

Requirements:

1. Create shared/src/heavy-components/index.ts with exports:
   - MapComponent
   - DialogComponent
   - DatePickerComponent
   - ResponsiveStepperComponent
   - SelectorComponent
   - EduactionStandartsComponent

2. Update tsconfig.base.json:
   - Add: "@vet/shared/heavy-components": ["shared/src/heavy-components/index.ts"]

3. Migrate imports:
   - Find all imports of these components from @vet/shared
   - Replace with @vet/shared/heavy-components

4. Update shared/src/index.ts:
   - Add: export * from './heavy-components/index';

Files to modify:
- Create shared/src/heavy-components/index.ts
- Update tsconfig.base.json
- Update all components importing MapComponent, DialogComponent, etc.

After completion:
- Run build
- Verify bundle stats show separate chunks for heavy components
```

### For Phase 3: RBAC Standardization

**Prompt for Claude Code**:

```
Task: Implement Phase 3 - RBAC Standardization with Route-Level Guards

Context:
- Permission guards exist but are not used in routes
- All authorization happens at template/component level
- Goal is to add declarative route-level permission guards

Requirements:

1. Create shared/src/utils/route-data.types.ts:
   - Define VetRouteData interface with roles, permissions, accessControl fields
   - Export from shared/src/utils/index.ts

2. Create auth/src/guards/permission.guard.ts:
   - Implement permissionGuard that reads route.data['roles'] and route.data['permissions']
   - User must have ANY of the roles (OR logic)
   - User must have ALL of the permissions (AND logic)
   - Redirect to /dashboard if missing permissions
   - Export from auth/src/index.ts

3. Apply permissionGuard to dashboard routes:
   - Update dashboard/src/routing/long-term-programs-dashboard.routes.ts
   - Update dashboard/src/routing/short-term-programs-dashboard.routes.ts
   - Update dashboard/src/routing/non-formal-programs-dashboard.routes.ts
   - Add canActivate: [permissionGuard] to sensitive routes
   - Add data: { permissions: [...] } configuration

4. Create shared/src/services/navigation-filter.service.ts:
   - Service that filters navigation based on route data
   - Provides filteredNavigation signal
   - Export from shared/src/services/index.ts

5. Update dashboard sidebar:
   - Refactor dashboard/src/dashboard-layout/sidebar/sidebar.component.ts
   - Use NavigationFilterService instead of hardcoded menu items

Files to create:
- shared/src/utils/route-data.types.ts
- auth/src/guards/permission.guard.ts
- shared/src/services/navigation-filter.service.ts

Files to modify:
- Dashboard route files (add permission guards)
- Dashboard sidebar component

After completion:
- Test with different user roles
- Verify unauthorized users can't access protected routes via direct URL
- Verify navigation menu hides items based on permissions
```

---

## Part 5: Expected Outcomes

### Bundle Size Improvements

**Before Refactoring**:
```
main.js:           ~2.5MB (all route modules + shared library)
vendor.js:         ~1.2MB (Angular + Kendo UI)
polyfills.js:      ~150KB
Total Initial:     ~3.85MB
```

**After Phase 1 (Lazy Loading)**:
```
main.js:           ~800KB (core app + guards + routing config)
vendor.js:         ~1.2MB (no change)
polyfills.js:      ~150KB
dashboard.chunk.js: ~400KB (lazy loaded)
auth.chunk.js:     ~300KB (lazy loaded)
programs.chunk.js: ~500KB (lazy loaded)
... (other chunks)
Total Initial:     ~2.15MB (-44% reduction)
```

**After Phase 2 (Shared Library Split)**:
```
main.js:           ~400KB (no icons, no heavy components)
vendor.js:         ~1.2MB
polyfills.js:      ~150KB
icons.chunk.js:    ~250KB (lazy loaded when needed)
heavy-ui.chunk.js: ~600KB (lazy loaded when needed)
Total Initial:     ~1.75MB (-54% reduction from original)
```

**After Phase 3 (RBAC - No Bundle Impact, Security Improvement)**:
```
Same bundle sizes, but:
- Routes protected at boundary level
- Direct URL navigation blocked for unauthorized users
- Cleaner code architecture
```

### Security Improvements

**Before**:
- Dashboard accessible with empty guard arrays
- Permission checks only in templates
- Direct URL navigation bypasses authorization
- Hard to audit access control

**After**:
- All sensitive routes protected at boundary
- Declarative permission configuration
- URL navigation properly guarded
- Easy to audit: just read route data

### Developer Experience Improvements

**Before**:
```typescript
// Unclear where authorization happens
import { SomeComponent } from '@vet/shared'; // Pulls 3MB

@Component({
  template: `
    @if (userService.can('viewStats')) { ... }
  `
})
```

**After**:
```typescript
// Clear authorization at route level
import { SomeComponent } from '@vet/shared/ui-components'; // Pulls 50KB

// routes.ts
{
  path: 'stats',
  canActivate: [permissionGuard],
  data: { permissions: ['viewStats'] } // Declarative!
}
```

### Maintainability Improvements

1. **Route Security Audit**: Read route definitions to understand access control
2. **Bundle Analysis**: Clear separation of heavy vs light components
3. **Navigation Management**: Centralized in NavigationFilterService
4. **Consistent Patterns**: Guards at boundaries, data-driven configuration

---

## Part 6: Migration Timeline Recommendation

### Week 1: Foundation
- **Day 1-2**: Phase 1 implementation (lazy loading)
- **Day 3**: Testing and verification
- **Day 4-5**: Fix any routing issues, update navigation links

### Week 2: Optimization
- **Day 1-2**: Phase 2A (icons extraction)
- **Day 3-4**: Phase 2B (heavy components extraction)
- **Day 5**: Testing and bundle analysis

### Week 3: Security
- **Day 1-2**: Phase 3 implementation (RBAC guards)
- **Day 3-4**: Apply guards to all dashboard routes
- **Day 5**: Testing with different user roles

### Week 4: Cleanup & Documentation
- **Day 1-2**: Remove backward-compatible re-exports from shared/src/index.ts
- **Day 3**: Update developer documentation
- **Day 4**: Final testing and QA
- **Day 5**: Production deployment planning

---

## Appendix A: Quick Reference

### Import Patterns After Refactoring

```typescript
// Routing
import { Routes } from '@angular/router';
import { authenticatedGuard, permissionGuard } from '@vet/auth';
import { breadcrumb } from '@vet/shared/utils';

// Heavy Components
import { MapComponent, DialogComponent } from '@vet/shared/heavy-components';

// UI Components
import { ButtonComponent, InputComponent } from '@vet/shared/ui-components';

// Icons
import { vetIcons } from '@vet/shared/icons';
import { arrowLeftIcon } from '@progress/kendo-svg-icons';

// Services
import { ToastService } from '@vet/shared/services';

// Pipes & Validators
import { FormatDatePipe } from '@vet/shared/pipes';
import { georgianLettersValidator } from '@vet/shared/validators';
```

### Guard Application Patterns

```typescript
// Basic authentication
{
  path: 'dashboard',
  canActivate: [authenticatedGuard],
  loadChildren: ...
}

// Role-based (via permissionGuard)
{
  path: 'admin',
  canActivate: [permissionGuard],
  data: { roles: ['Super Admin'] }
}

// Permission-based (via permissionGuard)
{
  path: 'stats',
  canActivate: [permissionGuard],
  data: { permissions: ['viewAnyProfessionProgramStats'] }
}

// Combined (roles AND permissions)
{
  path: 'commission',
  canActivate: [permissionGuard],
  data: {
    roles: ['Super Admin', 'Organisation'],
    permissions: ['viewProfessionProgramCommissionMember']
  }
}

// Multiple guards (cascading)
{
  path: 'register',
  canActivate: [authenticatedGuard, mandatoryFieldsGuard, permissionGuard],
  data: { permissions: ['applyApplication'] }
}
```

### Route Data Pattern

```typescript
import type { VetRouteData } from '@vet/shared/utils';

const route: Route = {
  path: 'example',
  loadComponent: () => import('./example.component'),
  canActivate: [permissionGuard],
  data: {
    // RBAC
    roles: ['Super Admin'],
    permissions: ['viewAnyApplication'],

    // UI Metadata
    menuLabel: 'dashboard.example',
    menuIcon: 'chart-line',
    menuOrder: 1,
    hideFromMenu: false,

    // Breadcrumb
    ...breadcrumb([
      { path: '/dashboard', text: 'dashboard.title' },
      { path: '/dashboard/example', text: 'dashboard.example' },
    ]),
  } satisfies VetRouteData,
};
```

---

## Appendix B: Troubleshooting

### Common Issues After Refactoring

**Issue**: Route not loading, blank page
- **Cause**: Missing route export from library index.ts
- **Fix**: Add `export * from './your-feature.routes';` to library index.ts

**Issue**: Build error: "Cannot find module '@vet/shared/icons'"
- **Cause**: tsconfig.base.json not updated
- **Fix**: Add path mapping in tsconfig.base.json and rebuild

**Issue**: Icons not displaying
- **Cause**: Icon imports not updated
- **Fix**: Update imports from `@vet/shared` to `@vet/shared/icons`

**Issue**: Navigation links broken after auth path change
- **Cause**: Hardcoded `/registration` links
- **Fix**: Search codebase for `/registration` and update to `/auth/registration`

**Issue**: Dashboard accessible without authentication
- **Cause**: Guard not applied at route boundary
- **Fix**: Add `canActivate: [authenticatedGuard]` to dashboard route in app.routes.ts

**Issue**: User can access stats page without permission
- **Cause**: Missing `permissionGuard` on route
- **Fix**: Add `canActivate: [permissionGuard]` and `data: { permissions: [...] }`

**Issue**: Bundle size didn't decrease significantly
- **Cause**: Imports still using `@vet/shared` instead of secondary entry points
- **Fix**: Migrate imports to specific entry points (`@vet/shared/icons`, etc.)

---

**End of Refactoring Plan**
