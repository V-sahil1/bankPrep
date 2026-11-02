---
name: Executive FinEd
colors:
  surface: '#f8f9ff'
  surface-dim: '#cbdbf5'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e5eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d3e4fe'
  on-surface: '#0b1c30'
  on-surface-variant: '#434655'
  inverse-surface: '#213145'
  inverse-on-surface: '#eaf1ff'
  outline: '#737686'
  outline-variant: '#c3c6d7'
  surface-tint: '#0053db'
  primary: '#004ac6'
  on-primary: '#ffffff'
  primary-container: '#2563eb'
  on-primary-container: '#eeefff'
  inverse-primary: '#b4c5ff'
  secondary: '#0058be'
  on-secondary: '#ffffff'
  secondary-container: '#2170e4'
  on-secondary-container: '#fefcff'
  tertiary: '#485573'
  on-tertiary: '#ffffff'
  tertiary-container: '#606d8d'
  on-tertiary-container: '#edf0ff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dbe1ff'
  primary-fixed-dim: '#b4c5ff'
  on-primary-fixed: '#00174b'
  on-primary-fixed-variant: '#003ea8'
  secondary-fixed: '#d8e2ff'
  secondary-fixed-dim: '#adc6ff'
  on-secondary-fixed: '#001a42'
  on-secondary-fixed-variant: '#004395'
  tertiary-fixed: '#d9e2ff'
  tertiary-fixed-dim: '#b9c6ea'
  on-tertiary-fixed: '#0d1b36'
  on-tertiary-fixed-variant: '#3a4664'
  background: '#f8f9ff'
  on-background: '#0b1c30'
  surface-variant: '#d3e4fe'
typography:
  display-lg:
    fontFamily: Manrope
    fontSize: 40px
    fontWeight: '800'
    lineHeight: 48px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Manrope
    fontSize: 30px
    fontWeight: '800'
    lineHeight: 38px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Manrope
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.015em
  headline-lg-mobile:
    fontFamily: Manrope
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Manrope
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Manrope
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.005em
  title-md:
    fontFamily: Manrope
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 24px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 26px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 22px
  body-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 18px
  label-lg:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
  label-sm:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 14px
    letterSpacing: 0.04em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1.5rem
  gutter-sm: 1rem
  gutter-lg: 2rem
  margin: 1.5rem
  margin-sm: 1rem
  margin-lg: 3rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
---

## Brand & Style

This design system embodies the rigor, precision, and high-stakes clarity demanded by elite banking and financial certification preparation. The brand personality balances institutional authority with modern software agility: disciplined, hyper-focused, supportive, and sophisticated. 

The aesthetic is anchored in **Corporate / Modern Minimalist SaaS**, heavily tuned for high-density academic and assessment environments. Visual complexity is eliminated in favor of pristine typographic scales, rhythmic whitespace, and clear status communication. The emotional goal is to reduce candidate cognitive friction, induce academic calm during timed tests, and instill confidence through tangible progress tracking.

## Colors

The palette establishes an authoritative financial tone balanced by crisp EdTech feedback cues.

- **Primary (`#2563EB`)**: Anchor for primary actions, current question highlights, and verified completion states.
- **Secondary (`#3B82F6`)**: Used for interactive focus rings, interactive toggles, active tab borders, and analytical charts.
- **Dark Neutral / Navy Dark (`#14213D`)**: The bedrock for headers, high-importance metric cards, and contrast-driven exam navigation chrome.
- **Accent Light (`#EFF6FF`)**: Applied across active question rows, selected answer choices, and table row selections.
- **Canvas & Surface**: Background sits on `#F8FAFC`, with core content containers resting on pure `#FFFFFF`.
- **Borders & Dividers**: Crisp structural lines mapped to `#E2E8F0`.
- **Text Tiers**: Deep high-contrast `#172033` for critical reading materials; `#64748B` for secondary meta-data and inactive metrics.
- **Functional Semantics**:
  - Success (`#16A34A`): Mastered topics, correct answers, positive score progression.
  - Warning (`#F59E0B`): Flagged for review questions, upcoming deadlines, time alerts.
  - Error (`#DC2626`): Incorrect submissions, critical errors, expired test sessions.

## Typography

The type system blends structural geometric display typography with ultra-legible utilitarian body typography:

- **Display & Headings (Manrope)**: Configured for exam sections, dashboard analytics headers, module titles, and prominent scores. It brings structural authority and a modern executive feel.
- **Body & Controls (Inter)**: Handles long-form questions, case study vignettes, data tables, code/formula notes, and navigation elements. Neutral proportions prevent eye fatigue over multi-hour simulated test sessions.
- **Tabular Figures**: Numeric statistics, question counters (`Question 42 of 100`), test timers, and percentage dials must strictly activate OpenType `tnum` (tabular numbers) to avoid horizontal layout shift during dynamic updates.

## Layout & Spacing

The layout utilizes a structured 12-column grid system paired with strict 4px/8px modular base rhythm.

### Grid & Breakpoints
- **Desktop (1280px+)**: 12-column layout, max-width `1440px`, centered. 32px (`gutter-lg`) gutters, 48px (`margin-lg`) margin. Optimized for split-view examination mode (60% reading vignette/question area, 40% tool/palette panel) and 3-column dashboard overviews.
- **Tablet (768px - 1279px)**: 8-column layout. 24px (`gutter`) gutters, 24px (`margin`) margins. Palette panels collapse into persistent drawer triggers.
- **Mobile (< 768px)**: 4-column layout. 16px (`gutter-sm`) gutters, 16px (`margin-sm`) margins. Full-width stacked questions with fixed sticky bottom exam controls.

### Density Strategy
Information-rich components (formula sheets, test question matrices) maintain tight internal cell spacing (`space-xs` and `space-sm`) surrounded by generous structural separation (`space-lg` to `space-xl`) to preserve readability without inducing visual clutter.

## Elevation & Depth

Visual hierarchy is constructed through structural surface stacking combined with ultra-soft, multi-layer ambient shadow layers and delicate borders.

- **Surface Base**: The app canvas uses `#F8FAFC`.
- **Tier 1 (Surface Cards & Exam Questions)**: Background `#FFFFFF`, 1px continuous border `#E2E8F0`, shadow: `0px 1px 2px rgba(20, 33, 61, 0.04), 0px 4px 12px rgba(20, 33, 61, 0.03)`.
- **Tier 2 (Hover States, Active Modules, Dropdowns)**: Background `#FFFFFF`, border `#CBD5E1`, shadow: `0px 4px 6px -1px rgba(20, 33, 61, 0.06), 0px 10px 24px -3px rgba(20, 33, 61, 0.05)`.
- **Tier 3 (Exam Status Modals, Drawer Palettes, Time Notices)**: Background `#FFFFFF`, border `transparent`, shadow: `0px 12px 32px -4px rgba(20, 33, 61, 0.12), 0px 4px 12px rgba(20, 33, 61, 0.04)`.
- **Focus Elevation**: Active or focused assessment elements employ a soft blue outer glow: `0px 0px 0px 3px rgba(37, 99, 235, 0.15)`.

## Shapes

The design system applies a refined curvature standard to convey high polish and modern software craftsmanship:

- **Cards, Panels, and Question Blocks**: 16px corner radius (`rounded-lg`), delivering a soft, non-aggressive modular visual unit.
- **Buttons, Text Inputs, and Select Boxes**: 10px to 12px corner radius, balancing finger touch targets with enterprise precision.
- **Exam Question Palette Indicators**: 10px to 12px squircle elements for clean visual grouping.
- **Pills, Progress Trackers, and SaaS Badges**: 9999px (full capsule radius) for distinct operational status indicators.

## Components

### Buttons
- **Primary**: Background `#2563EB`, text `#FFFFFF`, radius 10px, padding `10px 20px`, `label-lg`. Hover: `#1D4ED8`. Shadow: `0px 1px 2px rgba(37, 99, 235, 0.2)`.
- **Secondary / Ghost**: Background `#EFF6FF`, text `#2563EB`, border 1px solid `rgba(37, 99, 235, 0.2)`. Hover: Background `#DBEAFE`.
- **Outline**: Background `#FFFFFF`, border 1px solid `#E2E8F0`, text `#172033`. Hover: Background `#F8FAFC`, border `#CBD5E1`.

### Inputs & Select Fields
- Container height 44px, radius 10px, border 1px solid `#E2E8F0`, background `#FFFFFF`, text `#172033`.
- Placeholder `#64748B`. Focus: Border `#2563EB` with `0 0 0 3px rgba(37, 99, 235, 0.15)`.

### Checkboxes & Radios (Answer Option Selectors)
- Radio items for single-choice questions render as whole interactive card rows: 12px radius, 1px border `#E2E8F0`, padding `space-md`.
- Unselected: Background `#FFFFFF`. Hover: Border `#93C5FD`, background `#F8FAFC`.
- Selected: Border `#2563EB`, background `#EFF6FF`, text `#172033`. Radio indicator inside shows a filled `#2563EB` disc.

### Exam Question Palette
- Compact grid of numbers (1 to N) indicating progress. Size 38x38px, radius 10px, typography `label-md`.
  - **Answered**: Background `#2563EB`, text `#FFFFFF`.
  - **Flagged / Review**: Background `#FEF3C7`, text `#D97706`, border 1px solid `#F59E0B`.
  - **Unvisited**: Background `#F1F5F9`, text `#64748B`, border 1px solid `#E2E8F0`.
  - **Current**: 2px solid `#14213D` ring offset.

### SaaS Badges & Chips
- Capsule shaped (`rounded-full`), height 24px, padding `2px 10px`, typography `label-sm`.
  - **Mastery**: `#DCFCE7` background, `#15803D` text.
  - **Quantitative Reasoning / Tag**: `#EFF6FF` background, `#1D4ED8` text.
  - **High Difficulty**: `#FEE2E2` background, `#B91C1C` text.

### Student Progress Rings & Dials
- SVG circular gauges with track stroke width of 8px in `#E2E8F0` and fill stroke in `#2563EB` (or `#16A34A` for passing threshold).
- Center displays `headline-md` percentage with subtext in `body-sm` (`#64748B`).

### Metric & Analytics Cards
- Built on Tier 1 elevation with 16px radius. Contains a top row label (`label-md`, `#64748B`), large stat value (`headline-lg`, `#14213D`), and bottom directional indicator (e.g., green arrow pill "+4.2% vs peer benchmark").