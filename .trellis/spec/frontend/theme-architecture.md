# Theme Architecture — shadcn/ui CSS Variables

> How visual theming works in Site Factory: one `theme.css` file controls the entire site's appearance.

---

## Architecture Decision

### Context

Site Factory needs to support rapid multi-site deployment where each site has a unique visual identity (colors, radii, spacing). The original approach stored colors in `site.config.ts` and injected them via inline styles on `<html>`.

### Problem with Config-Driven Colors

- Colors defined in TypeScript → injected as inline styles → not cacheable by CSS
- Each component needed verbose `bg-[color:var(--color-accent)]` syntax
- Not compatible with external theme tools (tweakcn, shadcn/ui themes)
- No dark mode support
- Switching themes required changing TypeScript code and rebuilding

### Decision: CSS Variables + Semantic Tailwind Classes

Colors and design tokens live in `theme.css` as standard CSS custom properties. Components use semantic Tailwind classes (`bg-primary`, `text-muted-foreground`). Theme swapping = replacing `theme.css` only.

**Consequences**:
- (+) tweakcn.com export → paste to `theme.css` → instant theme swap, zero component changes
- (+) Dark mode via `.dark` class — native CSS cascade, no JS needed
- (+) Shorter, readable classes: `bg-primary` vs `bg-[color:var(--color-accent)]`
- (+) Standard shadcn/ui naming — any shadcn component drops in without color conflicts
- (-) Colors no longer in `site.config.ts` — two files define a site's identity (config for content, theme for visuals)

---

## File Structure

```
src/app/
├── theme.css      # :root + .dark variable definitions (tweakcn replacement target)
├── globals.css    # @import "tailwindcss", @import "./theme.css", @theme inline {...}
└── layout.tsx     # No inline styles — theme is pure CSS
```

---

## Token Mapping (Current Defaults — Solar Panel Pro)

| Variable | Role | Default Value |
|----------|------|--------------|
| `--background` | Page background | Warm white `hsl(40 78% 98%)` |
| `--foreground` | Main text | Dark green-tinted `hsl(153 30% 10%)` |
| `--primary` | CTA / action color | Gold `hsl(42 88% 60%)` |
| `--primary-foreground` | Text on primary | Near-black `hsl(42 80% 5%)` |
| `--secondary` | Surface / muted bg | Warm grey `hsl(40 26% 93%)` |
| `--secondary-foreground` | Text on secondary | Dark green `hsl(153 45% 19%)` |
| `--accent` | Brand color / dark sections | Dark green `hsl(153 45% 19%)` |
| `--accent-foreground` | Text on accent | White |
| `--muted` | Subtle backgrounds | Light warm |
| `--muted-foreground` | Subtle text | Medium green-grey |
| `--card` | Card surface | White |
| `--border` | All borders | `hsl(0 0% 0% / 0.08)` |
| `--input` | Input borders | Same as border |
| `--ring` | Focus rings | Same as primary |
| `--destructive` | Error states | Red |

---

## Theme Swap Workflow

1. Go to [tweakcn.com/editor/theme](https://tweakcn.com/editor/theme)
2. Pick a theme → Click **Code** → Select **Tailwind v4 + oklch**
3. Copy the `:root { ... }` and `.dark { ... }` blocks
4. Replace the contents of `theme.css`
5. Done — all components reflect new theme with zero code changes

---

## Forbidden Patterns

### Don't: Hardcode color values in components

```tsx
// BAD
<button className="bg-blue-500 text-white">
<footer className="bg-[#123124]">
```

### Don't: Reference raw CSS variables in className

```tsx
// BAD
<p className="text-(--color-accent)">
<div className="bg-(--color-surface)">
```

### Don't: Use inline styles for theming

```tsx
// BAD
<html style={getThemeStyle()}>
<section style={{ '--color-primary': siteConfig.colors.primary }}>
```

### Do: Use semantic Tailwind classes

```tsx
// GOOD
<button className="bg-primary text-primary-foreground">
<footer className="bg-accent text-accent-foreground">
<section className="bg-secondary">
```

---

## Common Mistakes

### Mistake: Adding colors back to site.config.ts

Colors were intentionally removed from config. The config file controls **business content** (name, nav, CTA type, hero text). The theme file controls **visual identity**. Mixing them defeats the theme-swap workflow.

### Mistake: Using Tailwind color palette for brand elements

`bg-blue-500`, `text-green-600`, etc. are fine for one-off utility styling but MUST NOT be used for brand-level elements (buttons, headers, footers, links). Those MUST use semantic tokens so they change with the theme.

### Mistake: Forgetting to update `.dark` when changing `:root`

Both blocks must be updated together. tweakcn exports include both, so use the full export.
