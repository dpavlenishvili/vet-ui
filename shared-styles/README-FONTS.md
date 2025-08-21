# VET Font System Documentation

## Overview

This document describes the optimized font system for the VET application. The system prioritizes HelveticaNeue as the primary font while implementing selective uppercase Georgian styling for specific components.

## Font Architecture

### Primary Font Stack
```scss
$font-family-primary: 'HelveticaNeue', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
```

**Why this stack?**
- `HelveticaNeue`: Custom font with optimized loading
- `-apple-system`, `BlinkMacSystemFont`: Native macOS fonts
- `'Segoe UI'`: Native Windows font
- `Roboto`: Android system font
- `'Helvetica Neue'`: System fallback
- `Arial`, `sans-serif`: Universal fallbacks

### System Font Stack
```scss
$font-family-system: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
```
Used for UI components that benefit from native system consistency.

### Monospace Font Stack
```scss
$font-family-mono: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace;
```
Used for code blocks and technical content.

## Font Loading Optimization

### 1. @font-face Declarations
Modern font declarations with performance optimizations:
```scss
@font-face {
  font-family: 'HelveticaNeue';
  src: url('../apps/vet/src/assets/fonts/HelveticaNeue-01.ttf') format('truetype');
  font-weight: 400;
  font-style: normal;
  font-display: swap; // Improves loading performance
}
```

**Key optimizations:**
- `font-display: swap`: Shows fallback text during font load
- Consolidated font family: All weights under one family name
- Modern font-weight values: 400, 500, 700 (instead of normal, medium, bold)

### 2. Performance Benefits
- **FOUT Prevention**: `font-display: swap` ensures text remains visible
- **Reduced Font Files**: Consolidated font family approach
- **System Font Fallbacks**: Immediate rendering with native fonts
- **Progressive Enhancement**: Graceful degradation when custom fonts fail

## Typography System

### Typography Mixins

#### Primary Text Mixin
```scss
@mixin text-shared-properties($bold: false, $important: false) {
  text-underline-position: from-font imp($important);
  text-decoration-skip-ink: none imp($important);
  font-family: $font-family-primary imp($important);
  
  @if ($bold) {
    font-weight: 500 imp($important);
  } @else {
    font-weight: 400 imp($important);
  }
}
```

#### System Text Mixin
```scss
@mixin text-system-properties($bold: false, $important: false) {
  // Uses system font stack for UI components
}
```

#### Monospace Text Mixin
```scss
@mixin text-mono-properties($important: false) {
  // Uses monospace font stack for code
}
```

### Typography Scale
- `text-xs()`: 0.6875rem / 11px
- `text-sm()`: 0.75rem / 12px
- `text-base()`: 0.875rem / 14px
- `text-md()`: 1rem / 16px
- `text-h3()`: 1rem / 16px (medium weight)
- `text-h2()`: 1.125rem / 18px (medium weight)
- `text-h1()`: 1.25rem / 20px (medium weight)
- `text-lg()`: 1.5rem / 24px (medium weight)
- `text-xxl()`: 1.875rem / 30px (medium weight)

## Selective Uppercase Implementation

### Components with Georgian Uppercase Styling

#### 1. Navbar Component
**Location**: `shared/src/ui/navbar/navbar.component.scss`

**Applied to:**
- `.v-ui-navbar-logo-text`: Logo text
- `.v-ui-navbar-menu-link`: Menu links (desktop)
- `.v-ui-navbar-menu-mobile-item a`: Menu links (mobile)

**Implementation:**
```scss
.v-ui-navbar-logo-text {
  text-transform: uppercase;
  font-family: 'BPG Mrgvlovani Caps', 'HelveticaNeue', Arial, sans-serif;
}
```

#### 2. Services Component
**Location**: `home/src/services/services.component.scss`

**Applied to:**
- `.vet-text-uppercase`: Service card text

**Implementation:**
```scss
.vet-text-uppercase,
::ng-deep .vet-text-uppercase {
  text-transform: uppercase;
  font-family: 'BPG Mrgvlovani Caps', 'HelveticaNeue', Arial, sans-serif;
}
```

## Utility Classes

### Font Family Utilities
```scss
.font-primary    // Uses primary font stack
.font-system     // Uses system font stack  
.font-mono       // Uses monospace font stack
```

### Text Transform Utilities
```scss
.text-transform-none  // Overrides uppercase styling
```

### Legacy Classes (Maintained for Compatibility)
```scss
.vet-text-uppercase  // Georgian uppercase text
.vet-text-base      // Base text styling
.vet-text-sm        // Small text styling
.vet-text-h2        // H2 heading styling
```

## Usage Guidelines

### 1. Default Behavior
By default, all text uses HelveticaNeue with system font fallbacks. No special classes needed for regular text.

### 2. Georgian Uppercase Text
Use only in navbar and vet-services components where specifically implemented.

### 3. System Font Usage
For UI components that need native system consistency:
```scss
@include text-system-properties();
// or
.font-system
```

### 4. Code and Technical Content
For code blocks and technical content:
```scss
@include text-mono-properties();
// or  
.font-mono
```

### 5. Overriding Uppercase
To override uppercase styling in special cases:
```html
<span class="vet-text-uppercase text-transform-none">Normal case text</span>
```

## Browser Support

### Font Support
- **Modern Browsers**: Full HelveticaNeue support with `font-display: swap`
- **Older Browsers**: Automatic fallback to system fonts
- **All Browsers**: Text remains visible during font loading

### Georgian Font Support
- **BPG Mrgvlovani Caps**: Loaded only for navbar and services components
- **Fallback Strategy**: HelveticaNeue → Arial → sans-serif

## Performance Metrics

### Font Loading
- **FOUT (Flash of Unstyled Text)**: Minimized with `font-display: swap`
- **Font Load Time**: Optimized with proper fallback chains
- **Render Blocking**: Eliminated with progressive enhancement

### File Sizes
- HelveticaNeue Regular: ~50KB
- HelveticaNeue Medium: ~52KB  
- HelveticaNeue Bold: ~54KB
- BPG Mrgvlovani Caps: ~45KB (loaded conditionally)

## Maintenance

### Adding New Font Weights
1. Add new `@font-face` declaration to `_helvetica-neue-font.scss`
2. Use consistent `font-family: 'HelveticaNeue'` name
3. Add appropriate `font-display: swap`
4. Update font variables if needed

### Modifying Typography Scale
1. Update mixins in `_mixins.scss`
2. Ensure consistent line-height ratios
3. Test with existing components
4. Update documentation

### Performance Monitoring
1. Monitor font loading metrics in browser devtools
2. Check Core Web Vitals impact
3. Test fallback font rendering
4. Validate text accessibility

## Migration Guide

### From Old Font System
1. **Remove** global Georgian font application
2. **Keep** selective uppercase in navbar/services only  
3. **Update** font-family references to use variables
4. **Test** existing components for consistency

### Breaking Changes
- Georgian fonts no longer applied globally
- Font family references consolidated
- Legacy font families (HelveticaNeueMedium, etc.) deprecated

## Troubleshooting

### Common Issues

#### 1. Fonts Not Loading
- Check font file paths in `@font-face` declarations
- Verify font files exist in `apps/vet/src/assets/fonts/`
- Check browser network tab for font loading errors

#### 2. Inconsistent Text Rendering
- Ensure components use proper typography mixins
- Check for competing CSS font-family declarations
- Verify system font fallbacks

#### 3. Georgian Fonts Not Appearing
- Confirm BPG Mrgvlovani Caps is imported in styles.scss
- Check component-specific uppercase styling
- Verify font loading in browser devtools

#### 4. Performance Issues
- Monitor font loading waterfall in devtools
- Check `font-display` declarations
- Consider font preloading for critical text