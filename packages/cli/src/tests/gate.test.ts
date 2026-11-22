import { test, describe } from 'node:test';
import assert from 'node:assert';
import path from 'node:path';
import { gateCommand } from '../commands/gate.js';

describe('@chaff/cli gate Automated Budget Evaluation', () => {
  const rootDir = path.resolve(process.cwd());

  test('chaff gate fails with exitCode 1 on a deliberately bad fixture (portfolio)', async () => {
    const portfolioDir = path.join(rootDir, 'fixtures', 'portfolio');
    const passed = await gateCommand(portfolioDir, { level: '2', strict: false });
    assert.strictEqual(passed, false, 'Gate must FAIL on fixtures/portfolio due to 320px overflow');
  });

  test('chaff gate fails with exitCode 1 on a fixture with touch target violations', async () => {
    const shopDir = path.join(rootDir, 'fixtures', 'ecommerce-shop');
    const passed = await gateCommand(shopDir, { level: '2', strict: false });
    assert.strictEqual(passed, false, 'Gate must FAIL on fixtures/ecommerce-shop due to <44px touch targets');
  });

  test('chaff gate passes with exitCode 0 on reference L3 hero', async () => {
    const heroDir = path.join(rootDir, 'examples', 'l3-hero');
    const passed = await gateCommand(heroDir, { level: '3', strict: false });
    assert.strictEqual(passed, true, 'Gate must PASS on examples/l3-hero (satisfying 5-part Fallback Contract)');
  });
});
