---
name: Velocity Enterprise
colors:
  surface: '#f9f9f9'
  surface-dim: '#dadada'
  surface-bright: '#f9f9f9'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f3f3'
  surface-container: '#eeeeee'
  surface-container-high: '#e8e8e8'
  surface-container-highest: '#e2e2e2'
  on-surface: '#1a1c1c'
  on-surface-variant: '#444748'
  inverse-surface: '#2f3131'
  inverse-on-surface: '#f1f1f1'
  outline: '#747878'
  outline-variant: '#c4c7c7'
  surface-tint: '#5f5e5e'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#1c1b1b'
  on-primary-container: '#858383'
  inverse-primary: '#c8c6c5'
  secondary: '#bc000a'
  on-secondary: '#ffffff'
  secondary-container: '#e90812'
  on-secondary-container: '#fffbff'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#1f005f'
  on-tertiary-container: '#8c69ff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e5e2e1'
  primary-fixed-dim: '#c8c6c5'
  on-primary-fixed: '#1c1b1b'
  on-primary-fixed-variant: '#474746'
  secondary-fixed: '#ffdad5'
  secondary-fixed-dim: '#ffb4aa'
  on-secondary-fixed: '#410001'
  on-secondary-fixed-variant: '#930006'
  tertiary-fixed: '#e7deff'
  tertiary-fixed-dim: '#cdbdff'
  on-tertiary-fixed: '#1f005f'
  on-tertiary-fixed-variant: '#4e1ebe'
  background: '#f9f9f9'
  on-background: '#1a1c1c'
  surface-variant: '#e2e2e2'
  deep-navy: '#0A0A0F'
  vibrant-red: '#E5000F'
  electric-purple: '#4200B3'
  surface-gray: '#F5F5F5'
  pure-white: '#FFFFFF'
typography:
  display-lg:
    fontFamily: Hanken Grotesk
    fontSize: 64px
    fontWeight: '800'
    lineHeight: 72px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Hanken Grotesk
    fontSize: 40px
    fontWeight: '800'
    lineHeight: 48px
    letterSpacing: -0.01em
  headline-lg:
    fontFamily: Hanken Grotesk
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
  headline-md:
    fontFamily: Hanken Grotesk
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
  body-lg:
    fontFamily: Hanken Grotesk
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Hanken Grotesk
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-bold:
    fontFamily: Hanken Grotesk
    fontSize: 14px
    fontWeight: '700'
    lineHeight: 20px
    letterSpacing: 0.05em
  label-md:
    fontFamily: Hanken Grotesk
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 8px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 64px
  max-width: 1280px
---

## Brand & Style

The design system is engineered for a high-performance business ISP environment. It targets enterprise decision-makers and IT managers who value speed, uptime, and professional-grade infrastructure. 

The aesthetic is **Corporate / Modern** with a **High-Contrast** edge. It leverages deep saturations to convey the physical reality of fiber-optic technology—light traveling through dark cables. The interface must feel intentional, structured, and extremely fast. High-contrast transitions and vibrant accents move the user's eye toward critical conversion points like address validation and plan selection.

## Colors

The palette is built on a foundation of high-contrast professionalism. 

- **Primary (Deep Navy/Black):** Used for text, primary navigation backgrounds, and deep footer sections to establish authority.
- **Secondary (Vibrant Red):** Reserved for primary Action CTAs, urgent notifications, and "Check Address" submission states.
- **Tertiary (Electric Purple):** Used for product highlights, icons, and secondary CTAs to differentiate between commercial tiers and support functions.
- **Neutral (Surface Gray):** Provides a subtle backdrop for card components and section transitions to prevent visual fatigue.

## Typography

This design system utilizes **Hanken Grotesk** for its sharp, geometric precision which mirrors the cleanliness of modern tech infrastructure. 

- **Display text** should be set with tight tracking and heavy weights to command attention on hero sections.
- **Body text** maintains a generous line height (1.5x) to ensure technical specifications remain legible during long reading sessions.
- **Labels** use a bold, uppercase style to act as signposts for "Business Only" or "Enterprise Grade" status tags.

## Layout & Spacing

The layout follows a **Fixed Grid** system for desktop to maintain a professional, structured look, switching to a **Fluid Grid** for mobile.

- **Grid:** 12-column system on desktop, 4-column on mobile.
- **Rhythm:** An 8px base unit controls all internal padding and margins. 
- **Section Spacing:** Major content blocks should be separated by 80px or 120px to provide breathing room and emphasize the high-end nature of the service.
- **Reflow:** On tablet, 3-column card layouts for business plans should stack into a single column or a horizontal carousel to maintain readability of plan features.

## Elevation & Depth

To maintain a crisp, professional feel, the design system utilizes **Low-contrast outlines** and **Tonal Layers** rather than heavy shadows.

- **Surface Levels:** 
  - Level 0: Pure White (#FFFFFF) background.
  - Level 1: Surface Gray (#F5F5F5) for secondary content containers.
- **Outlines:** Card components use a 1px solid border in a subtle gray (#E0E0E0) to define edges.
- **Interactive Depth:** Only the primary "Check Address" tool and conversion buttons receive a subtle, high-diffusion shadow on hover to suggest clickability without breaking the flat, modern aesthetic.

## Shapes

The design system employs a **Soft** shape language. 

A 4px border radius (0.25rem) is applied to all standard components (buttons, input fields, and cards). This provides a slight hint of approachability while maintaining the rigid, professional structure expected in the B2B sector. Interactive elements like "Check Address" inputs use the same radius to ensure they feel part of a unified suite of tools.

## Components

### Buttons
- **Primary:** Solid Vibrant Red (#E5000F) with white text. High contrast, sharp edges.
- **Secondary:** Solid Electric Purple (#4200B3) for secondary business actions.
- **Ghost:** Deep Navy outline with transparent background for less urgent navigation.

### "Check Address" Tool
A prominent search bar component. It features a large text input with a 1px gray border and a high-contrast Red action button flush to the right (on desktop) or stacked (on mobile). Use a clear "Success" state in Purple when an address is validated.

### Plan Cards
Cards should be segmented clearly:
- **Header:** Plan name and Speed (e.g., 100/40 Mbps).
- **Body:** Bulleted list of business features (Static IP, 24/7 Support).
- **Footer:** Pricing and Primary CTA.
- **Highlight State:** Use a 2px Purple top-border for "Recommended" or "Best Value" plans.

### Input Fields
Inputs must have a minimum height of 48px for accessibility. Active states should use an Electric Purple border-glow to indicate focus.

### Chips & Tags
Used for "NBN Ready" or "SLA Guaranteed." Use the `label-bold` typography style with a light gray background and deep navy text.