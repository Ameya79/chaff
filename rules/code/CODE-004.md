---
id: CODE-004
title: Lingering development console statements
severity: medium
levels: [1, 2, 3]
detect: static
fix_class: cleanup
bad: "console.log(\"Loaded auth session:\", sessionData);"
good: "if (process.env.NODE_ENV !== \"production\") { logger.debug(\"Auth session initialized\"); }"
why: "Lingering console.log, console.debug, or console.dir statements leak internal state, API keys, or stack traces into the user's browser DevTools, pollute production runtime logs, and degrade thread execution performance in high-throughput loops."
exceptions: "Explicit production error boundaries using structured console.error logging, telemetry wrappers, or CLI utilities designed specifically for terminal output."
---

## Context & Problem
AI agents insert `console.log` statements for debugging during incremental code generation and frequently fail to remove them. When shipped to production, these statements expose sensitive internal object structures, API tokens, and variable state in browser developer consoles. Furthermore, invoking console logging in tight loops or during animation frames blocks the browser's execution thread and floods terminal output.

## Detection Logic
Static AST analysis identifies `CallExpression[callee.object.name="console"][callee.property.name=/^(log|debug|info|dir|table)$/]`. It checks whether calls are protected by development environment guards or are part of production error logging. Maps to ESLint rule `no-console` configured with `{ allow: ['warn', 'error'] }`.

## Remediation Steps
1. Remove lingering debugging console invocations from source code.
2. If diagnostic logging is required in development, guard calls with `if (process.env.NODE_ENV !== 'production')`.
3. Route necessary production operational events through a dedicated telemetry or logging utility.
4. Configure Next.js compiler options in `next.config.js` to strip console logs in production builds: `compiler: { removeConsole: { exclude: ['error', 'warn'] } }`.

## Verification
Run `npx eslint . --rule "no-console: [error, { allow: [warn, error] }]"`. Open production build in browser and verify DevTools Console remains completely clean on all primary routes.
