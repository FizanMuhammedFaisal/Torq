# Torq Design System

> A living design document for the Torq web application.
> Principles drawn from [Emil Kowalski's](https://emilkowal.ski) motion and interaction design philosophy.

---

## 1. Design Philosophy

Torq is a tool for people who move fast. The UI should feel **immediate, precise, and calm** — never flashy, never in the way. Every pixel and every millisecond of animation should earn its place.

Three words to design by: **Clarity. Speed. Control.**

---

## 2. Motion Principles

Adapted from Emil Kowalski's animation guidelines at [emilkowal.ski](https://emilkowal.ski) / [animations.dev](https://animations.dev).

### 2.1 Purposeful Motion
> *Animations should explain, not decorate.*

Every animation must have a reason:
- **Feedback** — confirm an action happened (button press, form submit)
- **Orientation** — show where something came from / went to
- **Focus** — draw the eye to what matters

If you can't articulate why an animation exists, remove it.

### 2.2 Speed First
> *UI animations should be under 300ms. Most should be under 200ms.*

| Type | Duration |
|---|---|
| Micro (button press, hover) | 80–120ms |
| Element entrance (fade/slide) | 150–250ms |
| Page-level transitions | 250–350ms |
| Long-running (spinners, progress) | Unlimited |

Fast animations make the app feel more responsive, even when it isn't.

### 2.3 Natural Easing
> *Avoid linear. Use springs or physics-based curves.*

- **Entrances** — ease out (starts fast, slows to rest)
- **Exits** — ease in (accelerates out of view)
- **Interactive** — spring (slightly overshoots, settles naturally)

```ts
// Preferred spring config for interactive elements
{ type: 'spring', stiffness: 400, damping: 30 }

// Standard ease for entrances
{ ease: [0.25, 1, 0.5, 1], duration: 0.2 }
```

### 2.4 Restraint
> *Animate actions users do rarely. Never animate things they do constantly.*

- ✅ Page entrance, modal open, toast notification
- ✅ Destructive action confirmation
- ❌ Every keystroke, every hover, every scroll step
- ❌ Anything with a keyboard shortcut

Overuse erodes trust. Users notice when the UI feels slow because of animations.

### 2.5 Immediate Feedback
> *The UI should feel like it's listening.*

- Button press → scale down to `0.97` instantly (no delay)
- Form submit → disable + show spinner within one frame
- Error → shake or highlight, not a toast that appears 300ms later

### 2.6 Performance Rules
> *Animate only `transform` and `opacity`. Everything else is expensive.*

```ts
// ✅ GPU-accelerated, smooth
animate={{ opacity: 1, y: 0 }}

// ❌ Triggers layout, causes jank
animate={{ height: 'auto', marginTop: 16 }}
```

Use `motion` from `motion/react`. Prefer CSS transitions for hover states.

### 2.7 Scale from Near-Zero, Not Zero
> *`scale(0)` makes elements appear from nothing — it looks like a glitch.*

```ts
// ✅ Natural
initial={{ opacity: 0, scale: 0.95 }}

// ❌ Abrupt
initial={{ opacity: 0, scale: 0 }}
```

### 2.8 Origin-Aware Animations
Popovers, dropdowns, and tooltips should animate **from their trigger point**, not from the center of the screen. This creates spatial continuity — the user's eye naturally follows the connection.

---

## 3. Visual Foundations

### 3.1 Color

The palette is based on OKLCH for perceptual uniformity.

| Token | Value | Usage |
|---|---|---|
| `--primary` | `oklch(0.60 0.13 163)` | Emerald green — CTAs, focus rings, active state |
| `--foreground` | `oklch(0.141 0.005 285.82)` | Body text, dark panels |
| `--muted-foreground` | `oklch(0.552 0.016 285.94)` | Secondary text, labels |
| `--border` | `oklch(0.92 0.004 286.32)` | Dividers, input borders |
| `--background` | `oklch(1 0 0)` | Page background |

**Brand panel background:** `var(--foreground)` (near-black), with the primary glow at 20% opacity for depth.

### 3.2 Typography

- **Font:** DM Sans Variable (`@fontsource-variable/dm-sans`)
- **Scale:**

| Role | Size | Weight |
|---|---|---|
| Page heading (`h1`) | `text-xl` / 20px | 700 |
| Section heading | `text-base` / 16px | 600 |
| Body | `text-sm` / 14px | 400 |
| Label / caption | `text-xs` / 12px | 500 |

- **Tracking:** Default for body. `tracking-tight` for wordmarks and large headings.
- **Line-height:** `leading-snug` for headings, `leading-relaxed` for body copy.

### 3.3 Spacing

Tailwind's default 4px base unit. Key values:

| Token | px | Usage |
|---|---|---|
| `gap-2` | 8px | Tight — icon + label |
| `gap-4` | 16px | Between form fields |
| `gap-6` | 24px | Between form sections |
| `p-6` | 24px | Card / panel inner padding |
| `p-12` | 48px | Page-level padding (desktop) |

### 3.4 Radius

`--radius: 0.875rem` (14px) — rounded but not bubbly. Use `rounded-lg` on cards and panels, `rounded-md` on inputs and buttons.

---

## 4. Component Conventions

### Buttons
- Primary: solid `bg-primary text-primary-foreground`
- Press: `scale(0.97)` immediately on `mousedown` / `touchstart`
- Disabled: `opacity-50 cursor-not-allowed` — no animation

### Inputs
- Focus ring: `ring-2 ring-primary/40` — subtle, not aggressive
- Error state: red border + shake animation (one cycle, 150ms)
- Always use `<label>` / `FieldLabel` — never `placeholder` as a label substitute

### Forms
- Fields animate in staggered on page load (`delay: index * 0.04s`)
- Submit: button → spinner transition within 1 frame
- Validation: inline error beneath field, fades in over 150ms

---

## 5. Auth Pages

### Layout
Split-panel, 45/55:

```
[ Brand panel (dark)  ] [ Form panel (light) ]
  Wordmark                Title + subtitle
  Animated tagline        Fields
  Navigation dots         CTA button
                          Social auth
                          Legal
```

Mobile: brand panel collapses to a small header wordmark above the form.

### Brand Panel
- Background: `var(--foreground)`
- Grid overlay: 1px lines, 40px spacing, 4% white opacity
- Glow: `var(--primary)` radial gradient, 20% opacity, `blur-[120px]`
- Taglines rotate every 4s with `AnimatePresence` fade + slide

### Form Panel
- Background: `var(--background)`
- Form card: no explicit card — the panel IS the surface
- Entrance: `y: 24 → 0`, `opacity: 0 → 1`, 500ms, 100ms delay

---

## 6. File Structure Reference

```
src/
  features/
    auth/
      login-form.tsx     — Form UI component
      signup-form.tsx    — Form UI component
      index.ts           — Barrel export
  pages/
    login.tsx            — Route page, split-panel layout
    signup.tsx           — Route page, split-panel layout
  components/
    ui/                  — Shared UI primitives (button, input, field…)
  App.tsx                — Router setup
```

---

*Last updated: Feb 2026*
