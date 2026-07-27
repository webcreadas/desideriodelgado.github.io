# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is the portfolio website for **Desiderio Sevilla**, a Spanish artist. The site showcases artwork across categories (arquitectura, bodegones, carteles, dibujo, otras-miradas, pilones) with a hero carousel, filterable gallery, and lightbox viewer.

## Tech Stack

- **Vanilla HTML/CSS/JS** — No framework, no build system
- **Single page**: `index.html` contains all page content (sections for inicio, sobre-mi, obras, contacto)
- **CSS**: Modular stylesheets with CSS custom properties (variables)
- **JS**: IIFE module pattern, no bundler

## CSS Architecture

| File | Purpose |
|------|---------|
| `css/main.css` | Global styles, CSS variables, @font-face definitions |
| `css/home.css` | Hero/carousel section styles |
| `css/obras.css` | Gallery grid, filtering, lightbox |
| `css/sobre-mi.css` | About/contact section styles |
| `css/responsive.css` | Media queries and responsive adjustments |

CSS variables are defined in `main.css` under `:root` — color palette uses warm earth tones (`--color-bg: #c5bdb0`, `--color-text: #1a1a1a`).

## JavaScript Modules

| File | Purpose |
|------|---------|
| `js/main.js` | Smooth scrolling, lazy loading, debounce/throttle utilities |
| `js/navigation.js` | Mobile menu toggle, active nav state, header scroll behavior |
| `js/gallery.js` | Gallery filtering by category, lightbox open/close/navigate, keyboard + swipe navigation |
| `js/carousel.js` | Hero carousel autoplay (5s interval), indicators, prev/next, keyboard + swipe |

## Key Implementation Details

- **Gallery filtering**: Filter buttons use `data-filter` attribute; gallery items use `data-category`. Filtering animates opacity + scale with CSS transitions.
- **Lightbox**: Displays full image, caption from `.gallery-item-title`, navigates only through visible (non-hidden) items. Supports keyboard (Escape, Arrow keys) and swipe gestures.
- **Carousel**: Absolute positioning with opacity transitions; active slide toggled via `.active` class.
- **Mobile menu**: Toggles `.active` class, locks body scroll when open, closes on nav link click or Escape.
- **Lazy loading**: Uses IntersectionObserver to swap `data-src` to `src` when images enter viewport.

## Common Tasks

- **View site**: Open `index.html` directly in a browser (no server required)
- **Gallery images**: Stored in `assets/images/obras/{category}/` — add new images there, then add corresponding gallery markup in `index.html` section#obras
- **Add filter category**: Add button with `data-filter="category-name"` in filter bar, add `data-category="category-name"` to each item
- **Change carousel images**: Modify `.carousel-slide` elements in `index.html` section#inicio
- **Modify fonts**: Update `@font-face` declarations in `main.css` — font files live in `assets/fonts/`
