'use client';

import React, { useEffect, useRef } from 'react';
import {
  WebGLRenderer,
  Scene,
  PerspectiveCamera,
  AmbientLight,
  PointLight,
  DirectionalLight,
  InstancedMesh,
  IcosahedronGeometry,
  OctahedronGeometry,
  MeshStandardMaterial,
  Object3D,
  Color,
} from 'three';
import { governor, dispose, DeviceTier } from '@chaff/tier';

export interface WinnowThreeSceneProps {
  deviceTier: Exclude<DeviceTier, 'poster'>;
  windKnots: number;
  theme: 'dark' | 'light';
  onWebGLUnavailable?: () => void;
}

interface GrainSeed {
  isRing: boolean;
  ringTilt: number;
  radius: number;
  dirX: number;
  dirY: number;
  dirZ: number;
  angle: number;
  speed: number;
  scale: number;
  phase: number;
}

interface HuskSeed {
  lane: number;
  radial: number;
  angle: number;
  speed: number;
  spinX: number;
  spinY: number;
  sx: number;
  sy: number;
  sz: number;
  phase: number;
}

/**
 * Full-bleed Three.js 3D Winnowing Sculpture & Curl-Wind Field.
 * Strictly obeys all 5 parts of Chaff's Level 3 Fallback Contract:
 * lazy-imported with ssr:false, @chaff/tier profiling, 1.5 DPR cap,
 * IntersectionObserver + document.hidden pause, and recursive GPU disposal.
 */
export default function WinnowThreeScene({
  deviceTier,
  windKnots,
  theme,
  onWebGLUnavailable,
}: WinnowThreeSceneProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const windRef = useRef<number>(windKnots);
  const themeRef = useRef<'dark' | 'light'>(theme);
  const pointerRef = useRef<{ x: number; y: number; tx: number; ty: number }>({
    x: 0,
    y: 0,
    tx: 0,
    ty: 0,
  });

  const sceneRefs = useRef<{
    grainMat?: MeshStandardMaterial;
    huskMat?: MeshStandardMaterial;
    emberLight?: PointLight;
    rimLight?: PointLight;
    keyLight?: DirectionalLight;
    ambient?: AmbientLight;
    grainMesh?: InstancedMesh;
    huskMesh?: InstancedMesh;
    grainCount?: number;
    huskCount?: number;
  }>({});

  useEffect(() => {
    windRef.current = windKnots;
  }, [windKnots]);

  useEffect(() => {
    themeRef.current = theme;
    const refs = sceneRefs.current;
    if (!refs.grainMat || !refs.huskMat || !refs.grainMesh || !refs.huskMesh) return;

    const isDark = theme === 'dark';
    refs.grainMat.roughness = isDark ? 0.2 : 0.26;
    refs.grainMat.metalness = isDark ? 0.84 : 0.72;
    refs.huskMat.roughness = isDark ? 0.55 : 0.68;
    if (refs.ambient) refs.ambient.intensity = isDark ? 0.75 : 1.15;
    if (refs.emberLight) refs.emberLight.intensity = isDark ? 28 : 20;
    if (refs.rimLight) refs.rimLight.intensity = isDark ? 16 : 10;

    const c = new Color();
    const gCount = refs.grainCount ?? 0;
    for (let i = 0; i < gCount; i++) {
      if (isDark) {
        c.setHex(i % 4 === 0 ? 0xf7d78a : i % 2 === 0 ? 0xf2b84b : 0xe38a35);
      } else {
        c.setHex(i % 4 === 0 ? 0xc97c18 : i % 2 === 0 ? 0xa65e0e : 0x8a4b08);
      }
      refs.grainMesh.setColorAt(i, c);
    }
    if (refs.grainMesh.instanceColor) {
      refs.grainMesh.instanceColor.needsUpdate = true;
    }

    const hCount = refs.huskCount ?? 0;
    for (let i = 0; i < hCount; i++) {
      if (isDark) {
        c.setHex(i % 5 === 0 ? 0x4c3a6e : i % 3 === 0 ? 0x2c2c36 : 0x1a1a22);
      } else {
        c.setHex(i % 5 === 0 ? 0x6d28d9 : i % 3 === 0 ? 0x45413a : 0x292622);
      }
      refs.huskMesh.setColorAt(i, c);
    }
    if (refs.huskMesh.instanceColor) {
      refs.huskMesh.instanceColor.needsUpdate = true;
    }
  }, [theme]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const canvas = document.createElement('canvas');
    canvas.setAttribute('aria-hidden', 'true');
    canvas.className = 'w-full h-full block';
    container.appendChild(canvas);

    let renderer: WebGLRenderer;
    try {
      renderer = new WebGLRenderer({
        canvas,
        alpha: true,
        antialias: deviceTier === 'full',
        powerPreference: 'high-performance',
      });
    } catch {
      canvas.remove();
      onWebGLUnavailable?.();
      return;
    }

    const gl = renderer.getContext();
    if (!gl) {
      dispose(renderer);
      canvas.remove();
      onWebGLUnavailable?.();
      return;
    }

    const grainCount = deviceTier === 'full' ? 140 : 35;
    const huskCount = deviceTier === 'full' ? 220 : 55;

    let grainMesh: InstancedMesh | null = null;
    let huskMesh: InstancedMesh | null = null;

    const gov = governor({
      level: deviceTier,
      maxPixelRatio: 1.5,
      targetFps: 60,
      onDegrade: () => {
        if (grainMesh && huskMesh) {
          grainMesh.count = Math.max(24, Math.floor(grainCount * 0.45));
          huskMesh.count = Math.max(36, Math.floor(huskCount * 0.45));
        }
      },
    });

    const scene = new Scene();
    const camera = new PerspectiveCamera(42, 16 / 9, 0.1, 60);
    camera.position.set(0, 0.08, 8.8);

    const isDark = themeRef.current === 'dark';
    const ambient = new AmbientLight(0xffffff, isDark ? 0.75 : 1.15);
    const keyLight = new DirectionalLight(0xf4f1ea, 2.6);
    keyLight.position.set(-3.2, 5.2, 5.8);
    const emberLight = new PointLight(0xf2713a, isDark ? 28 : 20, 28);
    emberLight.position.set(0.8, 1.4, 3.8);
    const rimLight = new PointLight(0xa78bfa, isDark ? 16 : 10, 26);
    rimLight.position.set(4.8, -1.6, -2.2);
    scene.add(ambient, keyLight, emberLight, rimLight);

    const grainGeo = new IcosahedronGeometry(0.088, 0);
    const grainMat = new MeshStandardMaterial({
      metalness: isDark ? 0.84 : 0.72,
      roughness: isDark ? 0.2 : 0.26,
      flatShading: true,
    });
    grainMesh = new InstancedMesh(grainGeo, grainMat, grainCount);

    const huskGeo = new OctahedronGeometry(0.115, 0);
    const huskMat = new MeshStandardMaterial({
      metalness: 0.45,
      roughness: isDark ? 0.55 : 0.68,
      flatShading: true,
    });
    huskMesh = new InstancedMesh(huskGeo, huskMat, huskCount);

    sceneRefs.current = {
      grainMat,
      huskMat,
      emberLight,
      rimLight,
      keyLight,
      ambient,
      grainMesh,
      huskMesh,
      grainCount,
      huskCount,
    };

    const grainSeeds: GrainSeed[] = [];
    const tmpColor = new Color();
    const goldenAngle = Math.PI * (3 - Math.sqrt(5));
    const coreCount = Math.floor(grainCount * 0.62);

    for (let i = 0; i < grainCount; i++) {
      const isRing = i >= coreCount;
      if (!isRing) {
        // Fibonacci geodesic shell
        const t = (i + 0.5) / coreCount;
        const y = 1 - 2 * t;
        const radialAtY = Math.sqrt(Math.max(0, 1 - y * y));
        const phi = i * goldenAngle;
        const shellLayer = (i % 3) * 0.28;
        grainSeeds.push({
          isRing: false,
          ringTilt: 0,
          radius: 0.62 + shellLayer + (i % 5) * 0.05,
          dirX: Math.cos(phi) * radialAtY,
          dirY: y,
          dirZ: Math.sin(phi) * radialAtY,
          angle: phi,
          speed: 0.16 + (i % 5) * 0.025,
          scale: 0.72 + (1 - (i % 3) * 0.18) * 0.45,
          phase: i * 0.37,
        });
      } else {
        // Dual inclined Keplerian orbital rings
        const ringIdx = i - coreCount;
        const ringFrac = ringIdx / Math.max(1, grainCount - coreCount);
        const isSecondRing = ringIdx % 2 === 1;
        grainSeeds.push({
          isRing: true,
          ringTilt: isSecondRing ? -0.46 : 0.42,
          radius: (isSecondRing ? 1.88 : 1.56) + (ringIdx % 3) * 0.09,
          dirX: 0,
          dirY: 0,
          dirZ: 0,
          angle: ringFrac * Math.PI * 2,
          speed: isSecondRing ? -0.26 : 0.31,
          scale: 0.56 + (ringIdx % 4) * 0.11,
          phase: ringIdx * 0.51,
        });
      }

      if (isDark) {
        tmpColor.setHex(i % 4 === 0 ? 0xf7d78a : i % 2 === 0 ? 0xf2b84b : 0xe38a35);
      } else {
        tmpColor.setHex(i % 4 === 0 ? 0xc97c18 : i % 2 === 0 ? 0xa65e0e : 0x8a4b08);
      }
      grainMesh.setColorAt(i, tmpColor);
    }
    if (grainMesh.instanceColor) grainMesh.instanceColor.needsUpdate = true;

    const huskSeeds: HuskSeed[] = [];
    for (let i = 0; i < huskCount; i++) {
      // Deterministic pseudo-random distribution for consistent balanced silhouette
      const seedA = Math.sin(i * 12.9898) * 43758.5453;
      const r1 = seedA - Math.floor(seedA);
      const seedB = Math.sin(i * 78.233 + 1.7) * 24634.6345;
      const r2 = seedB - Math.floor(seedB);
      const seedC = Math.sin(i * 39.425 + 3.1) * 19283.4123;
      const r3 = seedC - Math.floor(seedC);

      huskSeeds.push({
        lane: (i % 19) / 19,
        radial: 0.7 + r1 * 1.45,
        angle: r2 * Math.PI * 2,
        speed: 0.36 + r3 * 0.62,
        spinX: 0.9 + r1 * 2.1,
        spinY: 0.7 + r2 * 1.8,
        sx: 1.55 + r3 * 0.85,
        sy: 0.16 + r1 * 0.14,
        sz: 0.4 + r2 * 0.28,
        phase: r1 * Math.PI * 2,
      });
      if (isDark) {
        tmpColor.setHex(i % 5 === 0 ? 0x4c3a6e : i % 3 === 0 ? 0x2c2c36 : 0x1a1a22);
      } else {
        tmpColor.setHex(i % 5 === 0 ? 0x6d28d9 : i % 3 === 0 ? 0x45413a : 0x292622);
      }
      huskMesh.setColorAt(i, tmpColor);
    }
    if (huskMesh.instanceColor) huskMesh.instanceColor.needsUpdate = true;

    scene.add(grainMesh, huskMesh);

    const viewState = {
      isWide: container.clientWidth >= 1024,
      halfW: 5.5,
      halfH: 3.3,
    };

    const syncSize = () => {
      const rect = container.getBoundingClientRect();
      const w = Math.max(1, Math.floor(rect.width));
      const h = Math.max(1, Math.floor(rect.height));
      const aspect = w / h;
      const isWide = w >= 1024;
      const camZ = isWide ? 8.8 : 9.4 + Math.max(0, 1 - aspect) * 4.4;

      camera.aspect = aspect;
      camera.position.set(0, 0.08, camZ);
      camera.updateProjectionMatrix();

      const halfH = Math.tan((42 * Math.PI) / 360) * camZ;
      viewState.isWide = isWide;
      viewState.halfH = halfH;
      viewState.halfW = halfH * aspect;

      renderer.setPixelRatio(gov.getEffectivePixelRatio());
      renderer.setSize(w, h, false);
    };

    syncSize();
    const resizeObserver =
      typeof ResizeObserver !== 'undefined' ? new ResizeObserver(syncSize) : null;
    resizeObserver?.observe(container);

    const onPointerMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      pointerRef.current.tx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      pointerRef.current.ty = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
    };
    window.addEventListener('pointermove', onPointerMove, { passive: true });

    const onContextLost = (e: Event) => {
      e.preventDefault();
      onWebGLUnavailable?.();
    };
    canvas.addEventListener('webglcontextlost', onContextLost);

    const dummy = new Object3D();
    const startTime = performance.now();

    const controller = gov.attach(canvas, (now) => {
      if (!grainMesh || !huskMesh) return;
      const elapsed = (now - startTime) * 0.001;
      const windNorm = Math.max(0, Math.min(1, windRef.current / 100));

      const ptr = pointerRef.current;
      ptr.x += (ptr.tx - ptr.x) * 0.075;
      ptr.y += (ptr.ty - ptr.y) * 0.075;

      const { isWide, halfW, halfH } = viewState;
      const sculptureScale = isWide ? 1.0 : 0.72;
      const anchorX = isWide ? Math.min(2.35, halfW * 0.44) : halfW * 0.24;
      const anchorY = isWide ? 0.04 : halfH * 0.34;

      const cursorWorldX = ptr.x * halfW;
      const cursorWorldY = ptr.y * halfH;

      // Population A: Geodesic Golden Grain Core & Keplerian Orbital Rings
      for (let i = 0; i < grainMesh.count; i++) {
        const g = grainSeeds[i];
        const tightness = 1 - windNorm * 0.16;
        let lx: number;
        let ly: number;
        let lz: number;

        if (!g.isRing) {
          const rotY = elapsed * g.speed;
          const cosY = Math.cos(rotY);
          const sinY = Math.sin(rotY);
          const breath = g.radius * tightness + Math.sin(elapsed * 1.15 + g.phase) * 0.05;
          const rx = g.dirX * cosY - g.dirZ * sinY;
          const rz = g.dirX * sinY + g.dirZ * cosY;
          lx = rx * breath * sculptureScale;
          ly = g.dirY * breath * sculptureScale;
          lz = rz * breath * sculptureScale;
        } else {
          const theta = g.angle + elapsed * g.speed;
          const r = g.radius * tightness * sculptureScale;
          const ox = Math.cos(theta) * r;
          const oz = Math.sin(theta) * r;
          const cosT = Math.cos(g.ringTilt);
          const sinT = Math.sin(g.ringTilt);
          lx = ox;
          ly = oz * sinT + Math.sin(elapsed * 1.4 + g.phase) * 0.04;
          lz = oz * cosT;
        }

        let x = anchorX + lx;
        let y = anchorY + ly;
        const z = lz;

        const dx = x - cursorWorldX;
        const dy = y - cursorWorldY;
        const distSq = dx * dx + dy * dy;
        if (distSq < 2.25 && distSq > 0.001) {
          const dist = Math.sqrt(distSq);
          const force = (1.5 - dist) * 0.34;
          x += (dx / dist) * force;
          y += (dy / dist) * force;
        }

        dummy.position.set(x, y, z);
        dummy.rotation.set(
          elapsed * 0.42 + g.phase,
          elapsed * 0.58 + g.angle,
          g.phase * 0.4
        );
        dummy.scale.setScalar(g.scale * sculptureScale);
        dummy.updateMatrix();
        grainMesh.setMatrixAt(i, dummy.matrix);
      }
      grainMesh.instanceMatrix.needsUpdate = true;

      // Population B: Fractured Obsidian & Violet Husk Shards peeling into curl-wind ribbon
      const windSpeed = 0.24 + windNorm * 1.65;
      const windSpread = (isWide ? 1.15 : 0.6) + windNorm * (isWide ? 2.45 : 1.25);

      for (let i = 0; i < huskMesh.count; i++) {
        const h = huskSeeds[i];
        const cycle = (elapsed * h.speed * windSpeed * 0.34 + h.lane) % 1;
        const sweep = cycle * (1.2 + windSpread);
        const curlAngle = h.angle + cycle * (2.4 + windNorm * 2.8) + elapsed * 0.25;

        let x =
          anchorX +
          Math.cos(curlAngle) * (h.radial * sculptureScale * 0.72) +
          sweep * (isWide ? 1.18 : 0.48);
        let y =
          anchorY +
          Math.sin(curlAngle * 1.35 + elapsed * 1.25 + h.phase) *
            (0.42 + windNorm * 0.75) *
            sculptureScale +
          cycle * (0.4 + windNorm * 0.9) * sculptureScale;
        const z = Math.sin(curlAngle) * h.radial * 0.75 * sculptureScale - cycle * 0.9;

        const dx = x - cursorWorldX;
        const dy = y - cursorWorldY;
        const distSq = dx * dx + dy * dy;
        if (distSq < 3.6 && distSq > 0.001) {
          const dist = Math.sqrt(distSq);
          const push = (1.9 - dist) * (0.55 + windNorm * 0.5);
          // Tangential curl swirl + radial repulsion
          x += (dx / dist) * push - (dy / dist) * push * 0.42;
          y += (dy / dist) * push + (dx / dist) * push * 0.42;
        }

        const fadeScale = Math.sin(cycle * Math.PI);
        const s = (0.3 + fadeScale * 0.85) * sculptureScale;

        dummy.position.set(x, y, z);
        dummy.rotation.set(
          elapsed * h.spinX * (0.6 + windNorm),
          elapsed * h.spinY * (0.6 + windNorm),
          h.phase + cycle * 4.2
        );
        dummy.scale.set(h.sx * s, h.sy * s, h.sz * s);
        dummy.updateMatrix();
        huskMesh.setMatrixAt(i, dummy.matrix);
      }
      huskMesh.instanceMatrix.needsUpdate = true;

      renderer.render(scene, camera);
    });

    return () => {
      controller.detach();
      resizeObserver?.disconnect();
      window.removeEventListener('pointermove', onPointerMove);
      canvas.removeEventListener('webglcontextlost', onContextLost);
      grainMesh?.dispose();
      huskMesh?.dispose();
      dispose(scene);
      dispose(renderer);
      canvas.remove();
      sceneRefs.current = {};
    };
  }, [deviceTier, onWebGLUnavailable]);

  return (
    <div
      ref={containerRef}
      className="pointer-events-none absolute inset-0 w-full h-full overflow-hidden"
    />
  );
}
