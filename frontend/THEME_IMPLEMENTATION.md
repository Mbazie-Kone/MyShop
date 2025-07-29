# Theme System Implementation

## Overview

The theme system has been completely redesigned to use a button-controlled toggle instead of automatic system preference detection. This provides users with explicit control over the dark/light mode appearance.

## Key Changes

### 1. ThemeService (`src/app/core/services/theme.service.ts`)

**Purpose**: Manages theme state and provides methods to toggle between light and dark modes.

**Key Features**:
- `BehaviorSubject` for reactive theme state management
- Local storage persistence for user preferences
- Methods: `toggleDarkMode()`, `setDarkMode()`, `getCurrentTheme()`
- Automatic theme application to document body

**Usage**:
```typescript
constructor(private themeService: ThemeService) {}

// Toggle theme
this.themeService.toggleDarkMode();

// Set specific theme
this.themeService.setDarkMode(true); // dark mode
this.themeService.setDarkMode(false); // light mode

// Subscribe to theme changes
this.themeService.theme$.subscribe(theme => {
  console.log('Current theme:', theme.isDarkMode);
});
```

### 2. ThemeToggleComponent (`src/app/shared/theme-toggle/theme-toggle.component.ts`)

**Purpose**: Reusable button component for switching between themes.

**Features**:
- Standalone component with built-in styling
- Responsive design with hover effects
- Accessibility support (ARIA attributes)
- Icon changes based on current theme (sun/moon)
- Automatic theme state subscription

**Template**:
```html
<app-theme-toggle></app-theme-toggle>
```

### 3. Global CSS Classes (`src/styles.css`)

**Replaced**: `@media (prefers-color-scheme: dark)` with explicit theme classes.

**New Classes**:
- `body.light-mode`: Light theme styles
- `body.dark-mode`: Dark theme styles

**Examples**:
```css
/* Light mode (default) */
body.light-mode {
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  color: #374151;
}

/* Dark mode */
body.dark-mode {
  background: linear-gradient(135deg, #1a202c 0%, #2d3748 100%);
  color: #e2e8f0;
}

/* Component-specific dark mode styles */
body.dark-mode .card {
  background-color: #2d3748;
  border-color: #4a5568;
  color: #e2e8f0;
}
```

### 4. Component Integration

**Header Integration**:
- Added to admin header-sidebar component
- Added to myshop header component
- Styled to match existing header design

**Product Form Updates**:
- Removed media query dark mode styles
- Updated to use `body.dark-mode` selectors
- Maintains all existing functionality

## Implementation Details

### Theme Persistence

The theme preference is automatically saved to localStorage using the key `myshop-theme-preference`:

```typescript
// Save theme
localStorage.setItem('myshop-theme-preference', JSON.stringify({ isDarkMode: true }));

// Load theme
const savedTheme = localStorage.getItem('myshop-theme-preference');
if (savedTheme) {
  const themeState = JSON.parse(savedTheme);
  // Apply theme...
}
```

### Body Class Management

The ThemeService automatically adds/removes CSS classes to the document body:

```typescript
private applyTheme(isDark: boolean): void {
  const body = document.body;
  if (isDark) {
    body.classList.add('dark-mode');
    body.classList.remove('light-mode');
  } else {
    body.classList.add('light-mode');
    body.classList.remove('dark-mode');
  }
}
```

### Component Styling

Components can now use explicit theme selectors:

```css
/* Component styles */
.my-component {
  background: white;
  color: black;
}

/* Dark mode override */
body.dark-mode .my-component {
  background: #2d3748;
  color: #e2e8f0;
}
```

## Usage Examples

### 1. Basic Theme Toggle

```html
<app-theme-toggle></app-theme-toggle>
```

### 2. Programmatic Theme Control

```typescript
import { ThemeService } from '../core/services/theme.service';

export class MyComponent {
  constructor(private themeService: ThemeService) {}

  enableDarkMode() {
    this.themeService.setDarkMode(true);
  }

  enableLightMode() {
    this.themeService.setDarkMode(false);
  }

  toggleTheme() {
    this.themeService.toggleDarkMode();
  }
}
```

### 3. Theme-Aware Styling

```css
.my-component {
  /* Light mode styles */
  background: #ffffff;
  color: #374151;
  border: 1px solid #d1d5db;
}

/* Dark mode styles */
body.dark-mode .my-component {
  background: #2d3748;
  color: #e2e8f0;
  border: 1px solid #4a5568;
}
```

## Benefits

1. **User Control**: Users can explicitly choose their preferred theme
2. **Consistency**: Theme persists across sessions and page reloads
3. **Performance**: No media query overhead
4. **Flexibility**: Easy to add new themes or modify existing ones
5. **Accessibility**: Proper ARIA attributes and keyboard navigation
6. **Maintainability**: Centralized theme management

## Migration from Media Queries

**Before**:
```css
@media (prefers-color-scheme: dark) {
  .my-component {
    background: #2d3748;
    color: #e2e8f0;
  }
}
```

**After**:
```css
body.dark-mode .my-component {
  background: #2d3748;
  color: #e2e8f0;
}
```

## Testing

1. **Dashboard Test**: Visit the dashboard to see the theme toggle test section
2. **Header Toggle**: Use the theme toggle button in the admin header
3. **Persistence**: Refresh the page to verify theme preference is saved
4. **Component Styling**: Navigate to different pages to see theme consistency

## Future Enhancements

1. **Multiple Themes**: Support for custom color schemes
2. **System Sync**: Option to sync with system preference
3. **Animation**: Smooth transitions between themes
4. **Per-Component**: Individual component theme overrides
5. **User Settings**: Theme preference in user profile 