# VISION Platform V2 - Accessibility Remediation

## Objective
Fix 484+ accessibility violations in shared components (app-catalog, dashboard, navigation) to achieve WCAG 2.1 Level AA compliance across the entire VISION Platform.

---

## 🎯 PRIORITY & IMPACT

**Priority**: CRITICAL
**Impact**: HIGH - Fixing shared components resolves violations across ALL pages
**Total Violations**: 484+
**Estimated Unique Issues**: ~50-75 (multiplied across pages/components)
**Target**: WCAG 2.1 Level AA compliance (minimum)

---

## 📍 VIOLATION LOCATIONS

### Primary Areas (Shared Components)
1. **app-catalog/** - App cards, filters, modals
2. **dashboard/** - Widgets, cards, charts, data displays
3. **navigation/** - Header, sidebar, mobile nav, breadcrumbs
4. **apps/** - App grid, app details, launchers
5. **glow-ui/** - Base UI components (buttons, inputs, cards)

### Secondary Areas
6. **settings/** - Forms, toggles, uploads
7. **admin/** - Tables, management interfaces
8. **funder/** - Charts, grantee displays
9. **auth/** - Login/signup forms
10. **onboarding/** - Wizard steps, progress

---

## 🔍 COMMON VIOLATION PATTERNS

### 1. **Color Contrast Issues** (WCAG 1.4.3)
**Problem**: Text/UI elements don't meet 4.5:1 (text) or 3:1 (UI) contrast ratio

**Common Violations:**
- Phase badge text on light backgrounds
- Muted text (vision-gray-500) on white
- Disabled button states
- Placeholder text in inputs
- Secondary/ghost button text
- Icon colors on backgrounds
- Chart labels and legends
- Status indicators

**Fix Strategy:**
```tsx
// BAD - Insufficient contrast
<span className="text-gray-400">Secondary text</span>

// GOOD - Meets WCAG AA (4.5:1)
<span className="text-gray-700">Secondary text</span>

// Phase badges - ensure sufficient contrast
<span className="text-vision-green-700 bg-vision-green-50">VOICE</span>
```

**Required Contrast Ratios:**
- Normal text: 4.5:1
- Large text (18px+ or 14px+ bold): 3:1
- UI components (buttons, inputs): 3:1
- Graphical objects: 3:1

---

### 2. **Missing ARIA Labels** (WCAG 4.1.2)
**Problem**: Interactive elements without accessible names

**Common Violations:**
- Icon-only buttons (favorite, menu, close)
- Search inputs without labels
- Select dropdowns without labels
- Filter buttons without descriptions
- Navigation toggles
- Chart data points
- Action buttons (edit, delete)

**Fix Strategy:**
```tsx
// BAD - No accessible name
<button onClick={handleFavorite}>
  <Star size={16} />
</button>

// GOOD - aria-label provides accessible name
<button
  onClick={handleFavorite}
  aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
  aria-pressed={isFavorite}
>
  <Star size={16} />
</button>

// Input fields
// BAD - No label
<input type="search" placeholder="Search apps..." />

// GOOD - Visible or aria-label
<label htmlFor="app-search" className="sr-only">Search applications</label>
<input
  id="app-search"
  type="search"
  placeholder="Search apps..."
  aria-label="Search applications"
/>
```

---

### 3. **Keyboard Navigation Issues** (WCAG 2.1.1)
**Problem**: Interactive elements not keyboard accessible

**Common Violations:**
- Div/span used as buttons (onClick on non-semantic elements)
- Missing focus indicators
- Focus trapped in modals without proper handling
- Skip links missing
- Tab order incorrect
- Custom dropdowns not keyboard accessible

**Fix Strategy:**
```tsx
// BAD - div as button
<div onClick={handleClick} className="cursor-pointer">
  Click me
</div>

// GOOD - semantic button
<button onClick={handleClick} className="cursor-pointer">
  Click me
</button>

// Focus indicators - ensure visible
<button className="focus:outline-none focus:ring-2 focus:ring-vision-blue-700 focus:ring-offset-2">
  Action
</button>

// Modal focus management
import { useEffect, useRef } from 'react';

function Modal({ isOpen, onClose }) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isOpen && closeButtonRef.current) {
      closeButtonRef.current.focus();
    }
  }, [isOpen]);

  return (
    <dialog open={isOpen} aria-modal="true" role="dialog">
      {/* Modal content */}
      <button ref={closeButtonRef} onClick={onClose} aria-label="Close modal">
        ×
      </button>
    </dialog>
  );
}
```

---

### 4. **Heading Hierarchy** (WCAG 1.3.1)
**Problem**: Improper heading levels or missing headings

**Common Violations:**
- Skipping heading levels (h1 → h3)
- Multiple h1s on a page
- Using headings for styling instead of structure
- Missing section headings
- Page titles not in h1

**Fix Strategy:**
```tsx
// BAD - Skipped levels
<h1>Dashboard</h1>
<h3>Recent Activity</h3>

// GOOD - Proper hierarchy
<h1>Dashboard</h1>
<h2>Recent Activity</h2>

// Use sr-only for visual design needs
<h2 className="sr-only">Navigation Menu</h2>
<nav aria-labelledby="nav-heading">
  {/* nav items */}
</nav>
```

---

### 5. **Form Accessibility** (WCAG 3.3.2)
**Problem**: Form inputs without proper labels or error messages

**Common Violations:**
- Inputs without associated labels
- Error messages not linked to inputs
- Required fields not indicated
- Submit buttons without names
- Fieldset/legend missing for radio/checkbox groups
- Validation messages not announced

**Fix Strategy:**
```tsx
// BAD - No label association
<input type="email" placeholder="Email" />

// GOOD - Proper label
<label htmlFor="email">Email address</label>
<input
  id="email"
  type="email"
  aria-required="true"
  aria-invalid={hasError}
  aria-describedby={hasError ? "email-error" : undefined}
/>
{hasError && (
  <span id="email-error" role="alert" className="text-error">
    Please enter a valid email
  </span>
)}

// Radio groups
<fieldset>
  <legend>Select your role</legend>
  <label>
    <input type="radio" name="role" value="admin" />
    Administrator
  </label>
  <label>
    <input type="radio" name="role" value="user" />
    User
  </label>
</fieldset>
```

---

### 6. **Landmark Regions** (WCAG 1.3.1)
**Problem**: Missing or improper landmark regions

**Common Violations:**
- No main landmark
- Multiple mains without labels
- Navigation without nav element
- Forms without proper regions
- Missing complementary/aside regions
- No skip links

**Fix Strategy:**
```tsx
// Page structure with landmarks
<>
  {/* Skip link */}
  <a href="#main-content" className="sr-only focus:not-sr-only">
    Skip to main content
  </a>

  <header role="banner">
    <nav aria-label="Main navigation">
      {/* nav items */}
    </nav>
  </header>

  <main id="main-content" role="main">
    {/* page content */}
  </main>

  <aside role="complementary" aria-label="Sidebar">
    {/* sidebar content */}
  </aside>

  <footer role="contentinfo">
    {/* footer content */}
  </footer>
</>
```

---

### 7. **Image & Icon Accessibility** (WCAG 1.1.1)
**Problem**: Images/icons without text alternatives

**Common Violations:**
- Icons without alt text or aria-label
- Decorative images not marked as such
- Complex images without descriptions
- SVGs without titles
- App icons without names
- Chart icons without context

**Fix Strategy:**
```tsx
// Decorative icons (no semantic meaning)
<Star size={16} aria-hidden="true" />

// Meaningful icons (convey information)
<Star size={16} aria-label="Favorite" />

// Images
// Decorative
<img src="decoration.png" alt="" role="presentation" />

// Meaningful
<img src="user-avatar.png" alt="John Doe profile picture" />

// App icons (use existing AppIcon component patterns)
<AppIcon app={app} aria-label={`${app.name} application icon`} />
```

---

### 8. **Interactive Element Roles** (WCAG 4.1.2)
**Problem**: Elements missing proper ARIA roles or states

**Common Violations:**
- Custom widgets without roles
- Tabs without tab/tabpanel/tablist
- Accordions without proper ARIA
- Dropdowns without menu role
- Dialogs without role/aria-modal
- Toggles without aria-pressed/checked

**Fix Strategy:**
```tsx
// Tabs
<div role="tablist" aria-label="Settings sections">
  <button
    role="tab"
    aria-selected={activeTab === 'profile'}
    aria-controls="profile-panel"
    id="profile-tab"
  >
    Profile
  </button>
</div>
<div
  role="tabpanel"
  id="profile-panel"
  aria-labelledby="profile-tab"
  hidden={activeTab !== 'profile'}
>
  {/* panel content */}
</div>

// Toggle button
<button
  role="switch"
  aria-checked={isEnabled}
  onClick={() => setIsEnabled(!isEnabled)}
>
  <span className="sr-only">Enable notifications</span>
  <div aria-hidden="true">{isEnabled ? 'On' : 'Off'}</div>
</button>
```

---

### 9. **Table Accessibility** (WCAG 1.3.1)
**Problem**: Data tables without proper structure

**Common Violations:**
- Missing table headers
- Headers without scope
- Complex tables without IDs
- No caption or summary
- Layout tables with role="presentation" missing

**Fix Strategy:**
```tsx
// Proper data table
<table>
  <caption>User activity for November 2025</caption>
  <thead>
    <tr>
      <th scope="col">User</th>
      <th scope="col">Actions</th>
      <th scope="col">Date</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row">John Doe</th>
      <td>12</td>
      <td>Nov 23, 2025</td>
    </tr>
  </tbody>
</table>

// Layout table (avoid, use CSS grid/flex instead)
<table role="presentation">
  {/* layout only */}
</table>
```

---

### 10. **Live Regions & Dynamic Content** (WCAG 4.1.3)
**Problem**: Dynamic updates not announced to screen readers

**Common Violations:**
- Toast notifications not announced
- Loading states not communicated
- Error messages not announced
- Success messages silent
- Live data updates (charts) not announced
- Filter results not announced

**Fix Strategy:**
```tsx
// Toast/notification
<div role="alert" aria-live="polite" aria-atomic="true">
  Settings saved successfully
</div>

// Loading state
<div role="status" aria-live="polite">
  {isLoading ? 'Loading applications...' :
   <span className="sr-only">Applications loaded</span>}
</div>

// Search results
<div role="status" aria-live="polite" aria-atomic="true">
  {filteredApps.length} apps found
</div>

// Form validation
<span role="alert" aria-live="assertive">
  {error}
</span>
```

---

## 🛠️ COMPONENT-SPECIFIC FIXES

### App Catalog Components

#### AppCardShell.tsx
- [ ] Add aria-label to favorite button with dynamic state
- [ ] Ensure launch button has proper accessible name
- [ ] Add aria-describedby for app description
- [ ] Ensure phase badge has sufficient contrast
- [ ] Add keyboard focus indicators
- [ ] Implement proper focus management

#### AppDetailDrawer.tsx
- [ ] Add aria-modal="true" to drawer
- [ ] Implement focus trap
- [ ] Add close button aria-label
- [ ] Ensure heading hierarchy
- [ ] Add role="dialog"
- [ ] Manage focus on open/close

#### FiltersBar.tsx
- [ ] Add labels to all filter inputs
- [ ] Ensure dropdown accessibility
- [ ] Add live region for filter count
- [ ] Add clear filters button with label
- [ ] Ensure keyboard navigation

### Dashboard Components

#### DashboardWidgets.tsx
- [ ] Add proper heading hierarchy
- [ ] Ensure chart accessibility (aria-label, role)
- [ ] Add data table headers where needed
- [ ] Implement skip links for widget navigation
- [ ] Add live regions for data updates

#### KpiTileRow.tsx
- [ ] Ensure metric contrast ratios
- [ ] Add aria-labels for trend indicators
- [ ] Add descriptions for icons
- [ ] Use semantic HTML (figure, figcaption)

#### TaskListCard.tsx
- [ ] Add checkbox labels
- [ ] Ensure list semantics (ul/li)
- [ ] Add aria-labels for action buttons
- [ ] Implement keyboard navigation

### Navigation Components

#### NavigationSidebar.tsx
- [ ] Add nav landmark with aria-label
- [ ] Ensure proper link semantics
- [ ] Add aria-current for active items
- [ ] Implement keyboard navigation
- [ ] Add skip link
- [ ] Ensure focus indicators

#### DashboardHeader.tsx
- [ ] Add header landmark
- [ ] Label search input
- [ ] Add aria-labels to icon buttons
- [ ] Ensure notification badge accessibility
- [ ] Add mobile menu button label

#### GlowMobileNavDrawer.tsx
- [ ] Add aria-modal and role="dialog"
- [ ] Implement focus trap
- [ ] Add close button label
- [ ] Manage focus on open/close
- [ ] Add aria-expanded to toggle

### Glow-UI Components

#### GlowButton.tsx
- [ ] Ensure all variants meet contrast
- [ ] Add loading state announcements
- [ ] Ensure disabled state contrast
- [ ] Add aria-disabled when needed
- [ ] Implement proper focus styles

#### GlowInput.tsx
- [ ] Ensure label association
- [ ] Add error message linkage (aria-describedby)
- [ ] Add required indicator (aria-required)
- [ ] Implement validation announcements
- [ ] Ensure focus indicators

#### GlowSelect.tsx
- [ ] Implement proper combobox pattern
- [ ] Add aria-expanded state
- [ ] Ensure keyboard navigation
- [ ] Add aria-activedescendant
- [ ] Announce selection changes

#### GlowCard.tsx
- [ ] Ensure sufficient contrast for all variants
- [ ] Add proper heading structure
- [ ] Implement landmark regions where appropriate
- [ ] Add focus indicators for interactive cards

---

## 🧪 TESTING REQUIREMENTS

### Automated Testing
```bash
# Run accessibility tests
pnpm test:a11y

# Test specific components
pnpm test:a11y --component=AppCardShell
```

### Manual Testing Checklist
- [ ] **Keyboard Navigation**: Tab through all interactive elements
- [ ] **Screen Reader**: Test with NVDA/JAWS (Windows) or VoiceOver (Mac)
- [ ] **Color Contrast**: Use browser devtools or Axe DevTools
- [ ] **Focus Indicators**: Ensure visible focus on all interactive elements
- [ ] **Zoom**: Test at 200% zoom
- [ ] **Touch Targets**: Ensure 44x44px minimum
- [ ] **Motion**: Test with prefers-reduced-motion
- [ ] **Dark Mode**: Ensure contrast in both modes (if applicable)

### Browser Testing
- Chrome + NVDA
- Firefox + NVDA
- Safari + VoiceOver
- Edge + Narrator

### Tools
- **axe DevTools** (browser extension)
- **WAVE** (browser extension)
- **Lighthouse** (Chrome DevTools)
- **Pa11y** (CI integration)

---

## 📋 IMPLEMENTATION CHECKLIST

### Phase 1: Critical Fixes (Week 1)
- [ ] Fix color contrast violations in phase badges
- [ ] Add aria-labels to all icon-only buttons
- [ ] Ensure all form inputs have labels
- [ ] Add keyboard focus indicators to all interactive elements
- [ ] Fix heading hierarchy across all pages
- [ ] Add skip links to main content

### Phase 2: Navigation & Layout (Week 2)
- [ ] Add proper landmark regions (nav, main, aside, footer)
- [ ] Implement focus management in modals/drawers
- [ ] Fix keyboard navigation in navigation components
- [ ] Add aria-current to active nav items
- [ ] Ensure mobile navigation accessibility

### Phase 3: Interactive Components (Week 3)
- [ ] Fix form field accessibility (labels, errors, validation)
- [ ] Implement proper ARIA roles for custom widgets
- [ ] Add live regions for dynamic content
- [ ] Fix table accessibility (headers, scope, captions)
- [ ] Ensure chart/graph accessibility

### Phase 4: Polish & Verification (Week 4)
- [ ] Run automated accessibility tests
- [ ] Manual testing with screen readers
- [ ] Fix any remaining violations
- [ ] Document accessibility patterns
- [ ] Create accessibility testing guidelines

---

## 🎯 SUCCESS CRITERIA

### Required
- [ ] **Zero critical violations** in automated tests
- [ ] **WCAG 2.1 Level AA compliance** across all shared components
- [ ] **Keyboard navigation** works for all interactive elements
- [ ] **Screen reader testing** passes on major combinations
- [ ] **Color contrast** meets 4.5:1 for text, 3:1 for UI
- [ ] **Focus indicators** visible on all interactive elements

### Recommended
- [ ] Aim for WCAG 2.1 Level AAA where feasible
- [ ] Document accessibility patterns for future development
- [ ] Create reusable accessible component patterns
- [ ] Set up automated accessibility testing in CI/CD
- [ ] Provide accessibility training for team

---

## 📚 RESOURCES

### WCAG 2.1 Guidelines
- [WCAG 2.1 Quick Reference](https://www.w3.org/WAI/WCAG21/quickref/)
- [Understanding WCAG 2.1](https://www.w3.org/WAI/WCAG21/Understanding/)
- [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)

### Tools
- [axe DevTools](https://www.deque.com/axe/devtools/)
- [WAVE Browser Extension](https://wave.webaim.org/extension/)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)
- [Color Contrast Analyzer](https://www.tpgi.com/color-contrast-checker/)

### React/Next.js Specific
- [React Accessibility](https://react.dev/learn/accessibility)
- [Next.js Accessibility](https://nextjs.org/docs/accessibility)
- [Radix UI Primitives](https://www.radix-ui.com/) (accessible component patterns)

---

## 🚀 GETTING STARTED

### Step 1: Run Automated Audit
```bash
# Install dependencies
pnpm install

# Run accessibility audit
pnpm test:a11y

# Generate report
pnpm test:a11y --reporter=html
```

### Step 2: Prioritize Violations
1. Review automated test results
2. Categorize by severity (critical, serious, moderate, minor)
3. Group by component (shared components first)
4. Create fix order (highest impact first)

### Step 3: Fix Systematically
1. Start with shared components (app-catalog, dashboard, navigation)
2. Fix one violation type at a time
3. Test after each fix
4. Document patterns for reuse
5. Update component library documentation

### Step 4: Verify & Document
1. Re-run automated tests
2. Manual testing with keyboard
3. Screen reader testing
4. Document fixes and patterns
5. Update component documentation

---

## 📝 NOTES

- **Focus on shared components first** - Maximum impact with minimum effort
- **Test early and often** - Don't wait until the end
- **Document patterns** - Create reusable accessibility patterns
- **Automate** - Set up CI/CD accessibility testing
- **Train team** - Share accessibility knowledge
- **Use semantic HTML** - Start with proper HTML elements
- **Progressive enhancement** - Ensure core functionality works without JS
- **Test with real users** - Include users with disabilities in testing

---

**Priority**: CRITICAL
**Timeline**: 4 weeks (phased approach)
**Impact**: Ensures VISION Platform is accessible to all users and meets legal compliance requirements
