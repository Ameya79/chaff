import { test, describe } from 'node:test';
import assert from 'node:assert';
import path from 'node:path';
import { buildIdentity } from '@chaff/core';
import { runSourceChecks } from '../index.js';

describe('@chaff/checks', () => {
  const rootDir = path.resolve(process.cwd());

  test('detects UI tells in saas-landing fixture', async () => {
    const fixtureDir = path.join(rootDir, 'fixtures', 'saas-landing');
    const identity = await buildIdentity(fixtureDir);
    const findings = await runSourceChecks(fixtureDir, identity);

    // Should detect UI-004 (purple gradient) and UI-008 (min-h-screen)
    const ui004 = findings.find((f) => f.ruleId === 'UI-004');
    const ui008 = findings.find((f) => f.ruleId === 'UI-008');
    assert.ok(ui004, 'Must detect UI-004 purple gradient');
    assert.ok(ui008, 'Must detect UI-008 min-h-screen');
    assert.strictEqual(ui004.status, 'open');
  });

  test('waives intentional purple gradient when waiver present in identity', async () => {
    const fixtureDir = path.join(rootDir, 'fixtures', 'tailwind-v4');
    const identity = await buildIdentity(fixtureDir);
    const findings = await runSourceChecks(fixtureDir, identity);

    const ui004 = findings.find((f) => f.ruleId === 'UI-004');
    assert.ok(ui004, 'UI-004 finding exists in codebase');
    assert.strictEqual(ui004.status, 'waived', 'UI-004 must be marked WAIVED due to DESIGN.md brand waiver');
  });

  test('detects copy tells (buzzwords and synthetic metrics)', async () => {
    const fixtureDir = path.join(rootDir, 'fixtures', 'saas-landing');
    const findings = await runSourceChecks(fixtureDir, null);

    const copy001 = findings.find((f) => f.ruleId === 'COPY-001');
    const copy003 = findings.find((f) => f.ruleId === 'COPY-003');
    assert.ok(copy001, 'Must detect COPY-001 buzzwords (delve/cutting-edge)');
    assert.ok(copy003, 'Must detect COPY-003 synthetic metric (99.9% uptime)');
  });

  test('detects non-semantic div with onClick in dashboard', async () => {
    const fixtureDir = path.join(rootDir, 'fixtures', 'dashboard');
    const findings = await runSourceChecks(fixtureDir, null);

    const code001 = findings.find((f) => f.ruleId === 'CODE-001');
    const code007 = findings.find((f) => f.ruleId === 'CODE-007');
    assert.ok(code001, 'Must detect CODE-001 non-semantic clickable div');
    assert.ok(code007, 'Must detect CODE-007 console.log in component');
  });

  test('detects 320px mobile viewport overflow and user-scalable=no in portfolio', async () => {
    const fixtureDir = path.join(rootDir, 'fixtures', 'portfolio');
    const findings = await runSourceChecks(fixtureDir, null);

    const mob001 = findings.find((f) => f.ruleId === 'MOBILE-001');
    const mob004 = findings.find((f) => f.ruleId === 'MOBILE-004');
    assert.ok(mob001, 'Must detect MOBILE-001 fixed desktop width');
    assert.ok(mob004, 'Must detect MOBILE-004 user-scalable=no');
  });

  test('detects touch targets and unlabeled inputs in ecommerce-shop', async () => {
    const fixtureDir = path.join(rootDir, 'fixtures', 'ecommerce-shop');
    const findings = await runSourceChecks(fixtureDir, null);

    const mob002 = findings.find((f) => f.ruleId === 'MOBILE-002');
    const a11y003 = findings.find((f) => f.ruleId === 'A11Y-003');
    assert.ok(mob002, 'Must detect MOBILE-002 touch target under 44px');
    assert.ok(a11y003, 'Must detect A11Y-003 unlabeled input');
  });

  test('detects three.js synchronous import and uncapped DPR in vite-react', async () => {
    const fixtureDir = path.join(rootDir, 'fixtures', 'vite-react');
    const findings = await runSourceChecks(fixtureDir, null);

    const three004 = findings.find((f) => f.ruleId === 'THREE-004');
    assert.ok(three004, 'Must detect THREE-004 uncapped pixel ratio');
  });
});
