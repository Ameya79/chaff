import { test, describe } from 'node:test';
import assert from 'node:assert';
import { tier, governor, dispose } from '../index.js';

describe('@chaff/tier Runtime Package', () => {
  test('classifies devices into deterministic tiers', () => {
    // 1. Constrained mobile phone -> poster
    const posterDevice = tier({ overrideMemory: 2, overrideConcurrency: 2 });
    assert.strictEqual(posterDevice, 'poster');

    // 2. Mid-range mobile phone (4GB RAM, 4 cores) -> lite
    const liteDevice = tier({ overrideMemory: 4, overrideConcurrency: 4 });
    assert.strictEqual(liteDevice, 'lite');

    // 3. High-performance desktop (16GB RAM, 8 cores) -> full
    const fullDevice = tier({ overrideMemory: 16, overrideConcurrency: 8 });
    assert.strictEqual(fullDevice, 'full');
  });

  test('prefers-reduced-motion forces poster tier regardless of hardware', () => {
    const reducedMotionDevice = tier({
      overrideMemory: 32,
      overrideConcurrency: 16,
      overrideReducedMotion: true,
    });
    assert.strictEqual(reducedMotionDevice, 'poster');
  });

  test('data-saver mode forces poster tier', () => {
    const saveDataDevice = tier({
      overrideMemory: 16,
      overrideConcurrency: 8,
      overrideSaveData: true,
    });
    assert.strictEqual(saveDataDevice, 'poster');
  });

  test('missing WebGL support forces poster tier', () => {
    const noWebGL = tier({
      overrideMemory: 16,
      overrideConcurrency: 8,
      overrideHasWebGL: false,
    });
    assert.strictEqual(noWebGL, 'poster');
  });

  test('frame governor caps device pixel ratio at 1.5 ceiling', () => {
    const gov = governor({ maxPixelRatio: 1.5 });
    // Retina 3x screen
    assert.strictEqual(gov.getEffectivePixelRatio(3.0), 1.5);
    // Ultra-dense 4x screen
    assert.strictEqual(gov.getEffectivePixelRatio(4.0), 1.5);
    // 1x standard screen remains 1.0
    assert.strictEqual(gov.getEffectivePixelRatio(1.0), 1.0);
  });

  test('dispose helper recursively cleans up geometries and materials without throwing', () => {
    let geometryDisposed = false;
    let materialDisposed = false;
    let textureDisposed = false;

    const fakeScene = {
      traverse: (callback: (obj: any) => void) => {
        callback({
          geometry: { dispose: () => { geometryDisposed = true; } },
          material: {
            map: { dispose: () => { textureDisposed = true; } },
            dispose: () => { materialDisposed = true; },
          },
        });
      },
    };

    dispose(fakeScene);
    assert.ok(geometryDisposed, 'Geometry must be disposed');
    assert.ok(materialDisposed, 'Material must be disposed');
    assert.ok(textureDisposed, 'Texture must be disposed');
  });
});
