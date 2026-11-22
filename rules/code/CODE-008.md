---
id: CODE-008
title: Interactive elements missing accessible labels and roles
severity: high
levels: [1, 2, 3]
detect: static
fix_class: accessibility
bad: "<button onClick={toggleSidebar} className=\"p-2 rounded hover:bg-neutral-800\"><MenuIcon className=\"w-5 h-5\" /></button>"
good: "<button onClick={toggleSidebar} aria-label=\"Toggle navigation menu\" className=\"p-2 rounded hover:bg-neutral-800\"><MenuIcon className=\"w-5 h-5\" aria-hidden=\"true\" /></button>"
why: "Interactive buttons, icon-only controls, and custom toggles without accessible text (aria-label, aria-labelledby, or visible text) leave screen reader users completely unaware of the element's purpose or action."
exceptions: "Visual elements explicitly marked with aria-hidden=\"true\" accompanied by adjacent, visible text that fully describes the action to both visual and assistive technology users."
---

## Context & Problem
Modern minimalist UIs frequently feature icon-only action buttons (e.g. hamburger menus, search icons, close buttons, dark-mode toggles). AI agents generate `<button><Icon /></button>` without an accessible name. For sighted users, the icon communicates meaning; for screen reader users, the assistive software announces only "button", leaving the user unable to determine what action activating the button will perform.

## Detection Logic
Static AST analysis searches for `JSXOpeningElement[name.name="button"]` or `JSXOpeningElement[name.name="a"]` that contain no direct text children and lack `aria-label`, `aria-labelledby`, or `title` attributes. It maps to standard accessibility lint rules `jsx-a11y/control-has-associated-label`, `jsx-a11y/aria-props`, and `jsx-a11y/button-has-type`.

## Remediation Steps
1. Add an `aria-label` attribute providing a concise, verb-first action description: `aria-label="Close dialog"`.
2. Mark nested decorative SVG icons or glyphs with `aria-hidden="true"` so screen readers do not announce raw vector paths.
3. For expandable elements (such as accordions or popovers), add `aria-expanded={isOpen}` and `aria-controls="panel-id"`.
4. Ensure buttons have an explicit `type="button"` or `type="submit"` attribute.

## Verification
Run `npx eslint . --rule "jsx-a11y/control-has-associated-label: error"`. Execute automated axe-core audit: verify zero `button-name` accessibility violations.
