---
id: CODE-006
title: Indiscriminate TypeScript any type escape hatches
severity: medium
levels: [1, 2, 3]
detect: static
fix_class: typesafety
bad: "function renderUserCard(profile: any) { return <div><h3>{profile.name.first}</h3><p>{profile.contact.email}</p></div>; }"
good: "interface UserProfile { name: { first: string; last: string }; contact: { email: string }; } function renderUserCard(profile: UserProfile) { return <div><h3>{profile.name.first}</h3><p>{profile.contact.email}</p></div>; }"
why: "Using any silences TypeScript compiler checks, hides undefined property access errors, defeats IDE autocomplete, and propagates untyped values throughout the component tree, leading to unhandled runtime TypeError crashes in production."
exceptions: "Low-level third-party library interop boundaries where library typings are demonstrably broken or during generic type argument constraints requiring ...args: any[]."
---

## Context & Problem
AI models frequently use `any` when synthesizing complex data structures, API responses, or event payloads to bypass TypeScript compilation errors. When `any` is introduced, it acts as a contagion across the codebase, turning off type checking for any downstream expression that consumes it. This results in runtime crashes (`Cannot read properties of undefined`) that TypeScript was created to prevent.

## Detection Logic
Static AST analysis searches for `TSAnyKeyword` within TypeScript type annotations, function parameters, return types, or type assertions (`as any`). It maps to ESLint rule `@typescript-eslint/no-explicit-any`. The check permits exceptions only when annotated with explicit waiver comments explaining upstream typing deficiencies.

## Remediation Steps
1. Define explicit TypeScript `interface` or `type` contracts representing the data schema.
2. If the external data structure is uncertain at compile time, use `unknown` instead of `any`.
3. Validate `unknown` inputs at runtime using TypeScript type narrowing (type guards) or validation libraries (Zod, Valibot).
4. For component props, define strict prop types covering optionality, unions, and callbacks.

## Verification
Run `npx tsc --noEmit` to verify type checking. Run `npx eslint . --rule "@typescript-eslint/no-explicit-any: error"` and confirm zero violations across application code.
