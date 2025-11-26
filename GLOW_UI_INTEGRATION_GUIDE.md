# Glow UI Integration Guide

**Purpose:** Extract design tokens from your Glow UI Figma and integrate them into the VISION Platform Shell

---

## 🎨 What is Glow UI?

Glow UI is your premium Figma design system with:
- 6,500+ components
- 440+ variables for colors, spacing, typography
- Auto Layout 5.0
- Professional SaaS patterns
- Responsive templates

---

## 📋 Step-by-Step Integration Process

### Step 1: Open Your Glow UI Figma File (5 minutes)

1. Open Figma
2. Navigate to your Glow UI design system file
3. Go to the **Design Panel** (right sidebar)
4. Click on **Variables** tab

### Step 2: Extract Color Tokens (10 minutes)

**What to extract:**

Look for these color categories in Glow UI:

```
Primary Colors:
├── Primary 50-900 (usually blue/brand color)
├── Primary DEFAULT (main brand color)
└── Primary foreground (text on primary)

Neutral/Gray Scale:
├── Gray 50-900
├── Background
├── Foreground
├── Border
└── Input

Semantic Colors:
├── Success (green)
├── Warning (yellow/orange)
├── Error/Destructive (red)
└── Info (blue)

UI Colors:
├── Card
├── Popover
├── Muted
├── Accent
└── Secondary
```

**How to extract:**

1. In Figma, click on each color
2. Note the HSL values (Hue, Saturation, Lightness)
3. Or export as CSS variables

**Example from Glow UI:**
```
Primary: HSL(221, 83%, 53%)
Background: HSL(0, 0%, 100%)
Foreground: HSL(222, 84%, 5%)
```

### Step 3: Extract Typography (5 minutes)

**What to extract:**

```
Font Family:
├── Primary font (usually Inter, SF Pro, or custom)
├── Mono font (for code)
└── Font weights (400, 500, 600, 700)

Font Sizes:
├── xs: 0.75rem (12px)
├── sm: 0.875rem (14px)
├── base: 1rem (16px)
├── lg: 1.125rem (18px)
├── xl: 1.25rem (20px)
├── 2xl: 1.5rem (24px)
├── 3xl: 1.875rem (30px)
└── 4xl: 2.25rem (36px)

Line Heights:
├── tight: 1.25
├── normal: 1.5
└── relaxed: 1.75
```

### Step 4: Extract Spacing Scale (5 minutes)

**What to extract:**

```
Spacing:
├── 0: 0
├── 1: 0.25rem (4px)
├── 2: 0.5rem (8px)
├── 3: 0.75rem (12px)
├── 4: 1rem (16px)
├── 5: 1.25rem (20px)
├── 6: 1.5rem (24px)
├── 8: 2rem (32px)
├── 10: 2.5rem (40px)
├── 12: 3rem (48px)
└── 16: 4rem (64px)
```

### Step 5: Extract Border Radius (2 minutes)

**What to extract:**

```
Border Radius:
├── none: 0
├── sm: 0.125rem (2px)
├── default: 0.25rem (4px)
├── md: 0.375rem (6px)
├── lg: 0.5rem (8px)
├── xl: 0.75rem (12px)
├── 2xl: 1rem (16px)
└── full: 9999px
```

### Step 6: Extract Shadows (3 minutes)

**What to extract:**

```
Box Shadows:
├── sm: 0 1px 2px 0 rgb(0 0 0 / 0.05)
├── default: 0 1px 3px 0 rgb(0 0 0 / 0.1)
├── md: 0 4px 6px -1px rgb(0 0 0 / 0.1)
├── lg: 0 10px 15px -3px rgb(0 0 0 / 0.1)
└── xl: 0 20px 25px -5px rgb(0 0 0 / 0.1)
```

---

## 🔧 Applying Tokens to Your Project

### Update 1: Tailwind Config

**File:** [apps/shell/tailwind.config.ts](apps/shell/tailwind.config.ts)

**Replace the `extend` section with your Glow UI values:**

```typescript
extend: {
  colors: {
    // Extract from Glow UI - PRIMARY colors
    primary: {
      50: '#eff6ff',   // Extract from Glow UI
      100: '#dbeafe',
      200: '#bfdbfe',
      300: '#93c5fd',
      400: '#60a5fa',
      500: '#3b82f6',  // Your main brand color
      600: '#2563eb',
      700: '#1d4ed8',
      800: '#1e40af',
      900: '#1e3a8a',
      DEFAULT: '#3b82f6',
      foreground: '#ffffff',
    },

    // Extract from Glow UI - SEMANTIC colors
    destructive: {
      DEFAULT: 'hsl(0, 84%, 60%)',
      foreground: 'hsl(0, 0%, 98%)',
    },

    // Keep these as-is or customize
    border: 'hsl(var(--border))',
    input: 'hsl(var(--input))',
    ring: 'hsl(var(--ring))',
    background: 'hsl(var(--background))',
    foreground: 'hsl(var(--foreground))',

    // ... rest of colors
  },

  // Extract from Glow UI - TYPOGRAPHY
  fontFamily: {
    sans: ['Inter', 'system-ui', 'sans-serif'],  // Your Glow UI font
    mono: ['JetBrains Mono', 'monospace'],
  },

  // Extract from Glow UI - SPACING (if different from Tailwind defaults)
  spacing: {
    // Usually you can keep Tailwind defaults
    // Only add if Glow UI uses custom values
  },

  // Extract from Glow UI - BORDER RADIUS
  borderRadius: {
    lg: '0.5rem',    // Extract from Glow UI
    md: '0.375rem',
    sm: '0.25rem',
  },

  // Extract from Glow UI - SHADOWS
  boxShadow: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    DEFAULT: '0 1px 3px 0 rgb(0 0 0 / 0.1)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
  },
}
```

### Update 2: Global CSS Variables

**File:** [apps/shell/src/app/globals.css](apps/shell/src/app/globals.css)

**Replace CSS variables with Glow UI HSL values:**

```css
@layer base {
  :root {
    /* Extract these HSL values from Glow UI */
    --background: 0 0% 100%;          /* White - from Glow UI */
    --foreground: 222.2 84% 4.9%;     /* Dark text - from Glow UI */

    --primary: 221.2 83.2% 53.3%;     /* Your brand blue - from Glow UI */
    --primary-foreground: 210 40% 98%; /* Text on primary */

    --secondary: 210 40% 96.1%;       /* Light gray - from Glow UI */
    --secondary-foreground: 222.2 47.4% 11.2%;

    --muted: 210 40% 96.1%;           /* From Glow UI */
    --muted-foreground: 215.4 16.3% 46.9%;

    --accent: 210 40% 96.1%;          /* From Glow UI */
    --accent-foreground: 222.2 47.4% 11.2%;

    --destructive: 0 84.2% 60.2%;     /* Red - from Glow UI */
    --destructive-foreground: 210 40% 98%;

    --border: 214.3 31.8% 91.4%;      /* Border color - from Glow UI */
    --input: 214.3 31.8% 91.4%;       /* Input border - from Glow UI */
    --ring: 221.2 83.2% 53.3%;        /* Focus ring - usually primary */

    --radius: 0.5rem;                  /* Border radius - from Glow UI */

    --card: 0 0% 100%;                 /* Card background */
    --card-foreground: 222.2 84% 4.9%;

    --popover: 0 0% 100%;              /* Dropdown background */
    --popover-foreground: 222.2 84% 4.9%;
  }

  .dark {
    /* If Glow UI has dark mode, extract these values too */
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    /* ... etc */
  }
}
```

---

## 🎯 Component-Specific Figma Links

As you build each component, add Figma links to the component guides:

### Example: Navigation Header

1. Open [Component_03_Navigation_Header.md](Claude%20Documentation/files/Component_03_Navigation_Header.md)
2. Find your Navigation component in Glow UI Figma
3. Copy Figma link (Share → Copy link)
4. Replace `[TO BE ADDED]` in the guide with your link

**Before:**
```markdown
**Figma Design**: [TO BE ADDED]
```

**After:**
```markdown
**Figma Design**: [Navigation Header - Glow UI](https://figma.com/file/your-file-id/...)
```

---

## 📝 Quick Extraction Checklist

**Open your Glow UI Figma and extract:**

- [ ] Primary color (HSL values)
- [ ] Secondary/gray colors
- [ ] Semantic colors (success, warning, error)
- [ ] Background/foreground colors
- [ ] Border colors
- [ ] Font family
- [ ] Font sizes (if custom)
- [ ] Spacing scale (if custom)
- [ ] Border radius values
- [ ] Box shadow values
- [ ] Component-specific Figma links for:
  - [ ] Navigation Header
  - [ ] Dashboard
  - [ ] Cards
  - [ ] Buttons
  - [ ] Forms
  - [ ] Dropdowns

---

## 🔄 After Extraction

1. **Update** [tailwind.config.ts](apps/shell/tailwind.config.ts) with extracted values
2. **Update** [globals.css](apps/shell/src/app/globals.css) with HSL values
3. **Test** by running `pnpm dev` and checking the dashboard page
4. **Verify** colors look correct
5. **Start building** Component 03 (Navigation Header)

---

## 💡 Pro Tips

1. **HSL Format:** Glow UI likely uses HSL. Convert RGB to HSL if needed:
   - Online tool: https://www.rapidtables.com/convert/color/rgb-to-hsl.html

2. **CSS Variables:** Keep using `hsl(var(--primary))` format for easy theme switching

3. **Consistency:** Make sure your extracted values match across Figma and code

4. **Document:** Keep notes on which Glow UI components map to your components

5. **Dark Mode:** If Glow UI has dark mode, extract those values too

---

## 🚀 Ready to Build!

Once you've extracted and applied your Glow UI design tokens, you're ready to build:

1. **Component 03: Navigation Header** - Use Glow UI header components as reference
2. **Component 01: Dashboard** - Use Glow UI dashboard patterns
3. **Component 02: Document Library** - Use Glow UI list/card patterns

**Each component should:**
- Match Glow UI design exactly
- Use extracted design tokens
- Be responsive (mobile/tablet/desktop)
- Be accessible (keyboard navigation, ARIA labels)

---

**Need help?** Check the component guides for detailed implementation steps!
