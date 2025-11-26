# Prioritized TODO List

## Priority 1: Missing Foundational Components (Critical)

### Theme
- [ ] **theme/zIndex.ts** - Z-index scale for layering (recommended)

### Primitives
- [ ] **primitives/Divider.tsx** - Horizontal/vertical divider component

**Impact:** These are foundational and used by many other components.

---

## Priority 2: Missing Core UI Components (High Value)

### Form Components
- [ ] **components/FormField.tsx** - Wrapper for label + helper + error
- [ ] **components/FormSection.tsx** - Grouped form fields container
- [ ] **components/FormActions.tsx** - Button group for forms
- [ ] **components/NumberInput.tsx** - Number input with increment/decrement
- [ ] **components/PasswordInput.tsx** - Password input with show/hide toggle
- [ ] **components/SearchInput.tsx** - Search input with icon
- [ ] **components/MultiSelect.tsx** - Multi-select dropdown
- [ ] **components/DatePicker.tsx** - Date picker component
- [ ] **components/Slider.tsx** - Range slider input
- [ ] **components/FileUpload.tsx** - File upload with preview
- [ ] **components/TagInput.tsx** - Tag/chip input component
- [ ] **components/AutocompleteInput.tsx** - Autocomplete input

**Impact:** Essential for building forms across the platform.

### Data Display
- [ ] **components/DataTable.tsx** - Sortable, selectable data table
- [ ] **components/SimpleTable.tsx** - Basic table component
- [ ] **components/List.tsx** - List component with ListItem
- [ ] **components/DescriptionList.tsx** - Label/value pairs
- [ ] **components/Avatar.tsx** - User avatar component
- [ ] **components/PageHeader.tsx** - Page title with breadcrumbs and actions
- [ ] **components/SectionHeader.tsx** - Section title with description

**Impact:** Critical for displaying data and content structure.

### Feedback
- [ ] **components/ToastProvider.tsx** - Toast notification system
- [ ] **components/InlineError.tsx** - Inline error display

**Impact:** Important for user feedback and error handling.

### Overlays
- [ ] **components/Drawer.tsx** - Side drawer/panel
- [ ] **components/DropdownMenu.tsx** - Dropdown menu component
- [ ] **components/Tooltip.tsx** - Tooltip component
- [ ] **components/Popover.tsx** - Popover component

**Impact:** Essential for advanced UI patterns.

### Navigation
- [ ] **layout/Pagination.tsx** - Page navigation
- [ ] **layout/Stepper.tsx** - Multi-step flow indicator

**Impact:** Important for navigation patterns.

---

## Priority 3: Layout Templates (Medium Priority)

- [ ] **layout/DashboardTemplate.tsx** - Dashboard page template
- [ ] **layout/FormPageTemplate.tsx** - Form page template
- [ ] **layout/DetailPageTemplate.tsx** - Detail page template
- [ ] **layout/WizardTemplate.tsx** - Multi-step wizard template

**Impact:** Provides consistent page-level layouts.

---

## Priority 4: Domain-Specific Components (Mission-Driven)

### Assessment (1/3 complete)
- [ ] **domain/assessment/AssessmentQuestionBlock.tsx**
- [ ] **domain/assessment/AssessmentProgressSidebar.tsx**

### Logic Model (0/5)
- [ ] **domain/logic/LogicCanvas.tsx**
- [ ] **domain/logic/LogicNode.tsx**
- [ ] **domain/logic/Connector.tsx**
- [ ] **domain/logic/NodePalette.tsx**
- [ ] **domain/logic/CanvasToolbar.tsx**

### Stakeholder Mapping (0/4)
- [ ] **domain/stakeholders/StakeholderMapCanvas.tsx**
- [ ] **domain/stakeholders/StakeholderBubble.tsx**
- [ ] **domain/stakeholders/StakeholderLegend.tsx**
- [ ] **domain/stakeholders/StakeholderFilters.tsx**

### Document & Grant Writing (0/5)
- [ ] **domain/document/DocumentEditorShell.tsx**
- [ ] **domain/document/SectionSummaryPanel.tsx**
- [ ] **domain/document/AISuggestionPanel.tsx**
- [ ] **domain/document/WordCountIndicator.tsx**
- [ ] **domain/document/TemplateSelector.tsx**

### Budget (0/4)
- [ ] **domain/budget/BudgetBuilder.tsx**
- [ ] **domain/budget/BudgetLineItemRow.tsx**
- [ ] **domain/budget/BudgetSummaryPanel.tsx**
- [ ] **domain/budget/IndirectCostCalculator.tsx**

### Compliance (0/3)
- [ ] **domain/compliance/RequirementChecklist.tsx**
- [ ] **domain/compliance/DeadlineList.tsx**
- [ ] **domain/compliance/DocumentVaultList.tsx**

### Impact / Charts (0/3)
- [ ] **domain/impact/OutcomeProgressChart.tsx**
- [ ] **domain/impact/FundingSourcesPieChart.tsx**
- [ ] **domain/impact/KpiSparkline.tsx**

**Impact:** These are mission-critical for the VISION platform's core functionality.

---

## Priority 5: Org/User Utilities (Lower Priority)

- [ ] **domain/org/OrgSwitcher.tsx** - Organization switcher component
- [ ] **domain/org/UserMenu.tsx** - User menu dropdown

**Impact:** Important for multi-org/user management.

---

## Priority 6: Storybook Stories (Documentation)

### High Priority Stories (Core Components)
- [x] Button.stories.tsx ✅
- [x] Card.stories.tsx ✅
- [x] TextInput.stories.tsx ✅
- [x] AppShell.stories.tsx ✅
- [ ] Alert.stories.tsx
- [ ] Select.stories.tsx
- [ ] Checkbox.stories.tsx
- [ ] Switch.stories.tsx
- [ ] Tabs.stories.tsx
- [ ] Breadcrumbs.stories.tsx
- [ ] Modal.stories.tsx
- [ ] ProgressBar.stories.tsx
- [ ] SidebarNav.stories.tsx
- [ ] TopBar.stories.tsx

### Medium Priority Stories (As Components Are Built)
- [ ] DataTable.stories.tsx (when implemented)
- [ ] FormField.stories.tsx (when implemented)
- [ ] ToastProvider.stories.tsx (when implemented)
- [ ] Drawer.stories.tsx (when implemented)
- [ ] Tooltip.stories.tsx (when implemented)

### Domain Component Stories
- [ ] AssessmentSection.stories.tsx (enhance existing)
- [ ] LogicCanvas.stories.tsx (when implemented)
- [ ] StakeholderMapCanvas.stories.tsx (when implemented)
- [ ] DocumentEditorShell.stories.tsx (when implemented)
- [ ] BudgetBuilder.stories.tsx (when implemented)

---

## Implementation Order Recommendation

### Week 1: Foundation
1. theme/zIndex.ts
2. primitives/Divider.tsx
3. components/FormField.tsx
4. components/FormSection.tsx
5. components/FormActions.tsx

### Week 2: Core Forms
1. components/NumberInput.tsx
2. components/PasswordInput.tsx
3. components/SearchInput.tsx
4. components/MultiSelect.tsx
5. components/DatePicker.tsx

### Week 3: Data Display
1. components/DataTable.tsx
2. components/SimpleTable.tsx
3. components/PageHeader.tsx
4. components/Avatar.tsx
5. components/List.tsx

### Week 4: Feedback & Overlays
1. components/ToastProvider.tsx
2. components/Drawer.tsx
3. components/DropdownMenu.tsx
4. components/Tooltip.tsx
5. components/Popover.tsx

### Week 5+: Domain Components
- Prioritize based on platform roadmap and user needs

---

## Current Status Summary

- **Completion:** ~39% (40/103 components)
- **Storybook:** ✅ Configured with 4 example stories
- **Theme System:** ✅ 100% complete
- **Core Components:** ⚠️ 60% complete
- **Domain Components:** ⚠️ 4% complete

**Next Immediate Actions:**
1. Install Storybook dependencies: `npm install`
2. Start Storybook: `npm run storybook`
3. Review existing stories
4. Begin implementing Priority 1 components

