# Tree-Shaking & Bundle Optimization Guide

## Overview

This document outlines best practices for optimizing bundle size in the VET UI application through effective tree-shaking and lazy loading strategies.

---

## Bundle Size Budgets

### Current Configuration

**File:** `apps/vet/project.json`

```json
{
  "budgets": [
    {
      "type": "initial",
      "maximumWarning": "1mb",
      "maximumError": "2mb"
    },
    {
      "type": "anyComponentStyle",
      "maximumWarning": "50kb",
      "maximumError": "100kb"
    }
  ]
}
```

**What This Means:**
- **Initial Bundle:** Warning at 1MB, error at 2MB
- **Component Styles:** Warning at 50KB, error at 100KB per component

**CI/CD Impact:**
- Builds will **warn** when approaching limits
- Builds will **fail** if exceeding error thresholds

---

## Secondary Entry Points for Tree-Shaking

### The Problem: Barrel Imports

```typescript
// ❌ BAD: Imports entire @vet/shared library (~500KB+)
import { MyService, MyIcon, MyComponent } from '@vet/shared';

// Problem: Bundler includes ALL exports from @vet/shared,
// even if you only use MyService
```

### The Solution: Secondary Entry Points

```typescript
// ✅ GOOD: Imports only what's needed
import { MyService } from '@vet/shared/services';
import { MyIcon } from '@vet/shared/icons';
import { MyComponent } from '@vet/shared/ui-components';

// Benefit: Bundler only includes these specific modules
// Savings: ~400KB+ reduced from bundle
```

---

## Available Secondary Entry Points

### `@vet/shared` Library

| Entry Point | Size (Approx) | Use For |
|-------------|---------------|---------|
| `@vet/shared/services` | ~50KB | Core services (auth, theme, etc.) |
| `@vet/shared/icons` | **564KB** | SVG icon components |
| `@vet/shared/heavy-components` | ~200KB | Components with large dependencies |
| `@vet/shared/ui-components` | ~80KB | Lightweight UI components |
| `@vet/shared/dialogs` | ~30KB | Dialog outlets and services |
| `@vet/shared/pipes` | ~20KB | Template pipes |
| `@vet/shared/validators` | ~15KB | Form validators |
| `@vet/shared/utils` | ~40KB | Utility functions |

**Total if imported via barrel:** ~1MB+  
**Typical usage (selective imports):** ~150-300KB

---

## ESLint Enforcement

### Rule Configuration

**File:** `.eslintrc.json`

```json
{
  "rules": {
    "no-restricted-syntax": [
      "error",
      {
        "selector": "ImportDeclaration[source.value='@vet/shared']",
        "message": "Avoid barrel imports from '@vet/shared'. Use specific secondary entry points instead..."
      }
    ]
  }
}
```

### Fixing Violations

When ESLint reports a barrel import violation:

```bash
# Example error:
# has-mandatory-fields.guard.ts
#   6:1  error  Avoid barrel imports from '@vet/shared'...
```

**Fix:**
```typescript
// Before
import { AuthenticationService } from '@vet/shared';

// After
import { AuthenticationService } from '@vet/shared/services';
```

---

## Lazy Loading Best Practices

### Route-Level Lazy Loading

**Current Implementation:** ✅ Already implemented

```typescript
// apps/vet/src/app/app.routes.ts
{
  path: 'dashboard',
  loadChildren: () => import('@vet/dashboard').then(m => m.dashboardRoutes),
},
{
  path: 'user-profile',
  loadChildren: () => import('@vet/user-profile').then(m => m.userProfileRoutes),
}
```

**Benefits:**
- **Initial bundle reduced** by ~60%
- **Faster time-to-interactive** (TTI)
- **Progressive loading** as user navigates

### Component-Level Lazy Loading

For heavy components (e.g., charts, rich text editors):

```typescript
// heavy-components/index.ts
export const LazyChartComponent = () =>
  import('./chart/chart.component').then(m => m.ChartComponent);

export const LazyEditorComponent = () =>
  import('./rich-text-editor/editor.component').then(m => m.EditorComponent);
```

**Usage in templates:**
```html
<ng-container *ngIf="showChart">
  <vet-chart-component></vet-chart-component>
</ng-container>
```

---

## Analyzing Bundle Size

### Command

```bash
# Build with stats
npm run build -- --stats-json

# Or use Nx command
npx nx run vet:build:production --stats-json

# Analyze with webpack-bundle-analyzer
npx webpack-bundle-analyzer dist/apps/vet/stats.json
```

### What to Look For

1. **Large Third-Party Libraries**
   - Kendo UI components (~300KB)
   - Moment.js / dayjs (use Tree-shakeable date-fns?)
   - RxJS operators (ensure only importing what's needed)

2. **Duplicate Dependencies**
   - Multiple versions of the same library
   - Use `npm dedupe` or upgrade to compatible versions

3. **Heavy Components Not Lazy-Loaded**
   - Charts, maps, rich text editors
   - Consider moving to `heavy-components` with lazy loading

---

## Common Anti-Patterns to Avoid

### ❌ Anti-Pattern 1: Barrel Re-Exports

```typescript
// shared/index.ts
export * from './services';  // ❌ Re-exports everything
export * from './components';  // ❌ Re-exports everything
export * from './icons';  // ❌ Re-exports 564KB of icons!
```

**Fix:** Use secondary entry points instead (already implemented ✅)

### ❌ Anti-Pattern 2: Importing Entire Libraries

```typescript
// ❌ BAD
import * as _ from 'lodash';

// ✅ GOOD
import debounce from 'lodash-es/debounce';
import throttle from 'lodash-es/throttle';
```

### ❌ Anti-Pattern 3: Global SCSS Imports

```scss
// ❌ BAD: Imports all Kendo styles
@import '@progress/kendo-theme-bootstrap/dist/all.css';

// ✅ GOOD: Use modular imports
@use '@progress/kendo-theme-bootstrap/scss/index.scss';
```

---

## Monitoring & CI Integration

### GitHub Actions / GitLab CI

Add bundle size checks to CI pipeline:

```yaml
# .gitlab-ci.yml
build:
  script:
    - npm run build -- --configuration=production
    - npx bundlesize  # Fails if bundle exceeds limits

  # Or use budgets (already configured in project.json)
  # Angular CLI will fail build if budget exceeded
```

### Bundle Size Badge

Consider adding a bundle size badge to README:

```markdown
![Bundle Size](https://img.shields.io/bundlephobia/minzip/@vet/ui)
```

---

## Advanced Optimization Techniques

### 1. Preload Critical Routes

```typescript
// apps/vet/src/app/app.config.ts
export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(
      appRoutes,
      withPreloading(PreloadAllModules)  // Preload in background after init
    ),
  ],
};
```

### 2. Differential Loading

Angular automatically generates ES2015 and ES5 bundles:

```html
<!-- Modern browsers get smaller bundle -->
<script type="module" src="main-es2015.js"></script>

<!-- Legacy browsers get polyfilled bundle -->
<script nomodule src="main-es5.js"></script>
```

### 3. Web Workers for Heavy Computation

```typescript
// cpu-intensive.worker.ts
export class CpuIntensiveWorker {
  calculate(data: number[]): number[] {
    // Heavy computation off main thread
    return data.map(x => x * x);
  }
}
```

---

## Current Status

### Bundle Size Analysis (Estimated)

| Bundle | Size | Status |
|--------|------|--------|
| **Main (initial)** | ~800KB | ✅ Within budget |
| **Kendo UI** | ~300KB | 🟡 Monitor |
| **Icons** | ~100KB | ✅ Isolated via secondary entry points |
| **Dashboard (lazy)** | ~200KB | ✅ Lazy-loaded |
| **Auth (lazy)** | ~150KB | ✅ Lazy-loaded |

**Total (initial load):** ~800KB compressed  
**Total (full app):** ~1.5MB compressed

### Violations Detected

ESLint currently reports **4 barrel import violations** in auth module:
- `has-mandatory-fields.guard.ts`
- `registration-citizenship.component.ts`
- `registration-identity-citizen.component.ts`
- `registration-identity-foreigner.component.ts`

**Action Required:** Fix these imports to use secondary entry points.

---

## Resources

- [Angular Build Optimization](https://angular.dev/tools/cli/build)
- [Webpack Bundle Analyzer](https://github.com/webpack-contrib/webpack-bundle-analyzer)
- [Source Map Explorer](https://github.com/danvk/source-map-explorer)

---

**Last Updated:** January 4, 2026  
**Bundle Budget Status:** ✅ Configured and enforced
