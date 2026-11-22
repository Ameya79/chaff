---
id: MOTION-006
title: Prevent exit animations from blocking component unmount and trapping state
severity: high
levels: [1, 2, 3]
detect: static
fix_class: lifecycle_fix
bad: "function Notification({ isVisible, onClose }) { const [exiting, setExiting] = useState(false); const handleClose = () => { setExiting(true); }; return (<div onAnimationEnd={() => exiting && onClose()} className={exiting ? 'fade-out' : ''}>Alert message</div>); }"
good: "function Notification({ isVisible, onClose }) { useEffect(() => { if (!isVisible) return; const timer = setTimeout(onClose, 5000); return () => clearTimeout(timer); }, [isVisible, onClose]); return isVisible ? (<div className=\"animate-fade-in motion-reduce:animate-none\">Alert message<button onClick={onClose} aria-label=\"Dismiss alert\">Dismiss</button></div>) : null; }"
why: "Relying exclusively on animationend or transitionend DOM events to trigger component unmounting can lock components permanently in the DOM if tab focus changes, reduced-motion cancels animations, or CSS errors prevent the event from firing."
exceptions: "Framer Motion <AnimatePresence mode='wait'> components where internal lifecycle state handles synthetic timeouts automatically."
---

## Context & Problem
When implementing component exit animations (such as dismissable alerts, toast notifications, or dialog closures), developers frequently defer component unmounting until the browser fires an `animationend` or `transitionend` event. However, native transition and animation events are notoriously unreliable: if the browser tab is backgrounded, if the element has `display: none` applied by a parent, if `prefers-reduced-motion` suppresses the animation, or if a CSS class name is mistyped, the event will never fire. Consequently, the component remains permanently stuck in an "exiting" state, creating phantom DOM elements, zombie overlays, and trapped UI state that blocks further user interaction.

## Detection Logic
Static AST analysis detects React components that manage exit state (e.g., `isExiting`, `exiting`) by attaching unmount callbacks exclusively inside `onAnimationEnd` or `onTransitionEnd` props without an accompanying deterministic safety timer (`setTimeout`) or declarative exit orchestrator (such as `<AnimatePresence>`).

## Remediation Steps
1. Always pair `onAnimationEnd` / `onTransitionEnd` handlers with a fallback safety timeout (`setTimeout`) that triggers unmount if the DOM event fails to fire within the expected duration + 50ms padding.
2. In reduced-motion environments (`@media (prefers-reduced-motion: reduce)`), bypass exit animations entirely and unmount immediately.
3. If leveraging motion libraries, use declarative lifecycle exit components (such as Framer Motion's `<AnimatePresence>`) which internally guarantee unmounting even if animations are interrupted or cancelled.
4. Clean up all active timers in the `useEffect` cleanup return function to prevent state updates on unmounted components.

## Verification
Simulate rapid dismissal of notifications or modals while `prefers-reduced-motion: reduce` is enabled or while the browser tab is switched to background. Verify that the dismissed component is cleanly removed from the DOM tree with zero ghost elements or trapped overlays.
