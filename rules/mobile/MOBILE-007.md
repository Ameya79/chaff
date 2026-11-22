---
id: MOBILE-007
title: Manage touch gesture conflicts and prevent scroll trapping
severity: medium
levels: [1, 2, 3]
detect: static
fix_class: interaction
bad: "<div onPointerDown={handleDragStart} className=\"h-64 overflow-x-scroll w-full\">{slides.map(slide => <SlideCard key={slide.id} {...slide} />)}</div>"
good: "<div onPointerDown={handleDragStart} className=\"h-64 overflow-x-auto w-full touch-pan-y overscroll-x-contain\" style={{ touchAction: 'pan-y' }}>{slides.map(slide => <SlideCard key={slide.id} {...slide} />)}</div>"
why: "Horizontally draggable elements, sliders, and interactive maps that listen to pointer or touch events without explicit touch-action declarations inadvertently intercept vertical page scrolling, trapping users and freezing page movement."
exceptions: "Full-screen canvas tools, drawing pads, or interactive games where multi-axis gesture hijacking is the deliberate user experience."
---

## Context & Problem
Custom interactive widgets—such as swipeable image carousels, draggable timeline sliders, data visualization sparklines, or embedded mini-maps—routinely attach pointer or touch event handlers (`onPointerDown`, `onTouchStart`). Without explicit `touch-action` configuration, the browser cannot determine whether a touch gesture is intended for custom horizontal manipulation or native vertical document scrolling. When users drag their finger vertically across these surfaces, the event listener intercepts the gesture, freezing document scroll and trapping the user on the screen.

## Detection Logic
Static AST analysis searches for JSX components or HTML elements that attach `onTouchStart`, `onTouchMove`, or `onPointerDown` listeners, or declare horizontal scrolling (`overflow-x-scroll`, `overflow-x-auto`), but lack an explicit `touch-action` style property or equivalent Tailwind utility (`touch-pan-y`, `touch-pan-x`, `touch-manipulation`).

## Remediation Steps
1. Declare explicit CSS `touch-action: pan-y;` (or Tailwind `touch-pan-y`) on horizontally swipeable containers, signaling to the browser engine that vertical finger movement must pass through to native page scroll.
2. Apply `overscroll-behavior-x: contain;` to swipeable lists and modal drawers to prevent horizontal drag momentum from triggering browser navigation history swipes (back/forward page navigation).
3. If using pointer capture (`setPointerCapture`), only capture the pointer after confirming that horizontal displacement exceeds a 10px threshold and horizontal delta exceeds vertical delta.
4. Release pointer capture immediately upon `pointerup` or `pointercancel`.

## Verification
Inspect AST scan output to confirm all components with touch or pointer event handlers declare appropriate `touch-action` rules. In mobile touch simulation, drag vertically across the interactive surface; verify page scrolling proceeds smoothly without hitching, delays, or event trapping.
