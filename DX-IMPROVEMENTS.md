# Developer Experience (DX) Improvements

**Date:** January 4, 2026  
**Target Audience:** VET UI Development Team  
**Goal:** Enhance productivity with tools, snippets, and automation

---

## 1. VS Code Snippets for Layout System

### Installation

Create `.vscode/vet-layout.code-snippets` in project root:

```json
{
  "VET Container": {
    "prefix": "vet-container",
    "body": [
      "<div vet-container${1: gap-${2|dense,wide|}}>",
      "  $0",
      "</div>"
    ],
    "description": "VET vertical stack container"
  },
  "VET Row": {
    "prefix": "vet-row",
    "body": [
      "<div vet-row${1: ${2|space-between,content-center,content-right,align-center,align-start|}}>",
      "  $0",
      "</div>"
    ],
    "description": "VET horizontal flex row (wraps on mobile)"
  },
  "VET Line": {
    "prefix": "vet-line",
    "body": [
      "<div vet-line${1: gap-${2|dense,wide|}}${3: content-${4|left,center,right|}}>",
      "  $0",
      "</div>"
    ],
    "description": "VET horizontal flex line (stays horizontal on mobile)"
  },
  "VET Row with Self-Grow": {
    "prefix": "vet-row-grow",
    "body": [
      "<div vet-row space-between>",
      "  <div self-grow>$1</div>",
      "  <div width-fixed>$2</div>",
      "</div>"
    ],
    "description": "VET row with growing and fixed children"
  },
  "VET Button Group": {
    "prefix": "vet-buttons",
    "body": [
      "<div vet-line gap-dense content-${1|left,center,right|}>",
      "  <button>$2</button>",
      "  <button>$3</button>",
      "</div>"
    ],
    "description": "VET button group (horizontal line)"
  }
}
```

**Usage:**  
Type `vet-container` → Tab → Configure options → Tab through placeholders

---

## 2. Storybook for Layout Components

### Installation

```bash
npm install --save-dev @storybook/angular
npx storybook@latest init
```

### Story: Layout System Showcase

**File:** `.storybook/stories/layout-system.stories.ts`

```typescript
import { Meta, StoryObj } from '@storybook/angular';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'vet-layout-demo',
  template: `
    <div vet-container>
      <h2>VET Layout System Demo</h2>
      
      <!-- Container (Vertical Stack) -->
      <section>
        <h3>Container (Vertical Stack)</h3>
        <div vet-container gap-dense style="border: 2px dashed #4CAEE8; padding: 1rem;">
          <div style="background: #EAF0FF; padding: 0.5rem;">Item 1</div>
          <div style="background: #EAF0FF; padding: 0.5rem;">Item 2</div>
          <div style="background: #EAF0FF; padding: 0.5rem;">Item 3</div>
        </div>
      </section>

      <!-- Row (Horizontal, Wraps on Mobile) -->
      <section>
        <h3>Row (Wraps on Mobile < 768px)</h3>
        <div vet-row space-between style="border: 2px dashed #4CAEE8; padding: 1rem;">
          <div self-grow style="background: #EAF0FF; padding: 0.5rem;">Grows</div>
          <div width-fixed style="background: #EAF0FF; padding: 0.5rem;">Fixed</div>
        </div>
      </section>

      <!-- Line (Horizontal, Stays Horizontal on Mobile) -->
      <section>
        <h3>Line (Stays Horizontal on Mobile)</h3>
        <div vet-line gap-dense content-right style="border: 2px dashed #4CAEE8; padding: 1rem;">
          <button>Cancel</button>
          <button>Save</button>
        </div>
      </section>
    </div>
  `,
  standalone: true,
})
class LayoutDemoComponent {}

const meta: Meta<LayoutDemoComponent> = {
  title: 'VET/Layout System',
  component: LayoutDemoComponent,
};

export default meta;
type Story = StoryObj<LayoutDemoComponent>;

export const Default: Story = {};
```

**Run Storybook:**
```bash
npm run storybook
```

**Benefits:**
- ✅ Visual docs for layout system
- ✅ Interactive playground
- ✅ Regression testing for responsive behavior
- ✅ Onboarding tool for new developers

---

## 3. Common Kendo Override Patterns

### Documentation: `KENDO-OVERRIDES-GUIDE.md`

Create quick reference for common Kendo customizations:

```markdown
# Common Kendo UI Override Patterns

## Button Styles

### Primary Button with Custom Color

**File:** `shared-styles/_kendo-component-overrides.scss`

```scss
.k-button-primary {
  background-color: $tb-kendo-color-primary !important;
  border-color: $tb-kendo-color-primary !important;
  
  &:hover {
    background-color: $tb-kendo-color-primary-hover !important;
  }
}
```

## Grid Styles

### Striped Rows

**File:** `shared-styles/_kendo-grid-overrides.scss`

```scss
.k-grid tr.k-alt {
  background-color: $tb-kendo-color-surface;
}
```

## Form Styles

### Custom Form Field Spacing

**File:** `shared-styles/_kendo-form-overrides.scss`

```scss
.k-form-field {
  margin-bottom: 1.5rem;
}
```

## Icons

### Custom Icon Color

**File:** `shared-styles/_kendo-icon-overrides.scss`

```scss
.k-icon {
  color: $tb-kendo-color-primary;
}
```

## Finding the Right Override File

| Component Type | Override File |
|----------------|---------------|
| Buttons, Dialogs, Dropdowns | `_kendo-component-overrides.scss` |
| Form Fields, Inputs, Selects | `_kendo-form-overrides.scss` |
| Grids, Tables | `_kendo-grid-overrides.scss` |
| Icons | `_kendo-icon-overrides.scss` |
| General Utilities | `_custom-kendo-overrides.scss` |
```

**File Location:** `shared-styles/KENDO-OVERRIDES-GUIDE.md`

---

## 4. Documentation Quick Links

### Project README Update

Add DX section to `README.md`:

```markdown
## Developer Experience Tools

### Layout System

- 📚 **Documentation:** [shared-styles/_layout.scss](./shared-styles/_layout.scss)
- 🎨 **Storybook:** `npm run storybook`
- ⚡ **VS Code Snippets:** Type `vet-container`, `vet-row`, or `vet-line`
- 📖 **Migration Guide:** [CSS-MIGRATION-GUIDE.md](./CSS-MIGRATION-GUIDE.md)

### Code Quality

- 🔍 **Linting:** `npm run lint`
- 🧪 **Tests:** `npx nx test [project-name]`
- 📊 **Bundle Analysis:** `npm run build -- --stats-json`

### Architecture

- 🏗️ **Architecture Guide:** [ARCHITECTURE.md](./ARCHITECTURE.md)
- 🔒 **Security Audit:** [SECURITY-AUDIT.md](./SECURITY-AUDIT.md)
- 📦 **Bundle Optimization:** [BUNDLE-OPTIMIZATION.md](./BUNDLE-OPTIMIZATION.md)
- 🎨 **CSS Audit:** [CSS-AUDIT-REPORT.md](./CSS-AUDIT-REPORT.md)
```

---

## 5. Debugging Tools

### Angular DevTools

**Install:**  
[Chrome Extension](https://chrome.google.com/webstore/detail/angular-devtools/ienfalfjdbdpebioblfackkekamfmbnh)

**Features:**
- ✅ Component tree inspector
- ✅ Signal debugging
- ✅ Change detection profiler
- ✅ Dependency injection viewer

### Bundle Size Analysis

**Command:**
```bash
# Build with stats
npx nx run vet:build:production --stats-json

# Analyze
npx webpack-bundle-analyzer dist/apps/vet/stats.json
```

**Use Cases:**
- Identify large dependencies
- Detect duplicate modules
- Verify tree-shaking effectiveness

---

## 7. Team Onboarding Checklist

Create `.github/ONBOARDING.md`:

```markdown
# VET UI Developer Onboarding

Welcome to the VET UI team! 👋

## Setup (30 minutes)

- [ ] Clone repository
- [ ] Install dependencies: `npm install`
- [ ] Start dev server: `npm start`
- [ ] Verify app loads at `http://localhost:4200`

## Read Documentation (1 hour)

- [ ] [ARCHITECTURE.md](./ARCHITECTURE.md) - Routing, auth, shared library
- [ ] [shared-styles/_layout.scss](./shared-styles/_layout.scss) - Layout system
- [ ] [BUNDLE-OPTIMIZATION.md](./BUNDLE-OPTIMIZATION.md) - Tree-shaking best practices

## Install Dev Tools (15 minutes)

- [ ] Install [Angular DevTools](https://chrome.google.com/webstore/detail/angular-devtools/)
- [ ] Install VS Code snippets (see [DX-IMPROVEMENTS.md](./DX-IMPROVEMENTS.md))

## First Task (2 hours)

- [ ] Create a new component using `vet-container` / `vet-row`
- [ ] Add unit tests
- [ ] Submit PR for review

## Questions?

Ask in #vet-ui-dev Slack channel
```

---

## Summary of DX Improvements

| Improvement | Status | Effort | Benefit |
|-------------|--------|--------|---------|
| **VS Code Snippets** | ⚠️ Documented | 30 min | ⭐⭐⭐⭐⭐ High (daily use) |
| **Storybook Stories** | ⚠️ Documented | 2 hours | ⭐⭐⭐⭐ High (onboarding, docs) |
| **Kendo Override Patterns** | ⚠️ Documented | 1 hour | ⭐⭐⭐ Medium (reference) |
| **Pre-Commit Hook** | ⚠️ Documented | 1 hour | ⭐⭐⭐⭐ High (quality enforcement) |
| **Documentation Updates** | ⚠️ Documented | 30 min | ⭐⭐⭐⭐⭐ High (discoverability) |
| **Onboarding Checklist** | ⚠️ Documented | 30 min | ⭐⭐⭐⭐ High (team growth) |

**Total Implementation Time:** ~6 hours  
**Overall Impact:** ⭐⭐⭐⭐⭐ Very High

---

## Next Steps

1. **Immediate (this week):**
   - [ ] Create `.vscode/vet-layout.code-snippets`
   - [ ] Update `README.md` with DX links
   - [ ] Create `KENDO-OVERRIDES-GUIDE.md`

2. **Short-term (next sprint):**
   - [ ] Set up Storybook
   - [ ] Create `.github/ONBOARDING.md`

3. **Long-term (next quarter):**
   - [ ] Record video tutorials for layout system
   - [ ] Create interactive CodeSandbox examples
   - [ ] Set up automated visual regression testing

---

**Documentation Created:** January 4, 2026  
**Last Updated:** January 4, 2026
