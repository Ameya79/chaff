'use client';

import React, { useEffect, useRef } from 'react';
import { tier, governor, dispose, DeviceTier } from '@chaff/tier';

export interface WinnowThreeSceneProps {
  tierOverride?: DeviceTier;
  rippleEnergy?: number;
  themeMode?: 'light' | 'dark';
  onTierResolved?: (resolved: DeviceTier) => void;
  onFallbackToPoster?: () => void;
}

const QUAD_VS = `#version 300 es
precision highp float;

in vec2 a_pos;
out vec2 v_ndc;

void main() {
  v_ndc = a_pos;
  gl_Position = vec4(a_pos, 0.0, 1.0);
}
`;

const ARTIFACT_FS = `#version 300 es
precision highp float;

in vec2 v_ndc;

uniform float u_time;
uniform float u_aspect;
uniform float u_tiltX;
uniform float u_tiltY;
uniform float u_ripple;
uniform float u_theme;
uniform float u_lite;

out vec4 outColor;

mat2 rot2(float a) {
  float c = cos(a), s = sin(a);
  return mat2(c, -s, s, c);
}

float sdTorus(vec3 p, vec2 t) {
  vec2 q = vec2(length(p.xz) - t.x, p.y);
  return length(q) - t.y;
}

float sdOctahedron(vec3 p, float s) {
  p = abs(p);
  float m = p.x + p.y + p.z - s;
  vec3 q;
  if (3.0 * p.x < m) q = p.xyz;
  else if (3.0 * p.y < m) q = p.yzx;
  else if (3.0 * p.z < m) q = p.zxy;
  else return m * 0.57735027;
  float k = clamp(0.5 * (q.z - q.y + s), 0.0, s);
  return length(vec3(q.x, q.y - s + k, q.z - k));
}

// Returns vec2(signedDistance, materialId)
// matId: 1.0 = Center Botanical Quartz Crystal, 2.0 = Inner Sage Astrolabe Ring & Nodes, 3.0 = Outer Hairline Calibration Rings
vec2 mapScene(vec3 p) {
  float t = u_time;
  float alignFactor = u_ripple * 0.35;

  // Global gentle optical gimbal tilt from pointer
  vec3 gp = p;
  gp.yz *= rot2(0.24 + u_tiltY * 0.36);
  gp.xz *= rot2(-0.32 + u_tiltX * 0.44);

  // 1. Sleek Elongated Botanical Quartz Obelisk Core
  vec3 cp = gp;
  cp.xz *= rot2(t * 0.28 + u_ripple * 1.4);
  cp.xy *= rot2(0.14 * sin(t * 0.38));
  float coreD = sdOctahedron(vec3(cp.x * 1.24, cp.y * 0.56, cp.z * 1.24), 0.33) - 0.0085;
  vec2 res = vec2(coreD, 1.0);

  // Subtle waist caliper collar around crystal equator
  float collarD = sdTorus(cp, vec2(0.295, 0.0048));
  if (collarD < res.x) res = vec2(collarD, 2.0);

  // 2. Inner Sage Astrolabe Ring + Two Orbital Index Beads
  vec3 r1 = gp;
  r1.xy *= rot2(0.76 - 0.22 * sin(t * 0.35) - alignFactor);
  r1.yz *= rot2(0.46 + t * 0.24);
  float dRing1 = sdTorus(r1, vec2(0.55, 0.0068));
  float beadA = length(r1 - vec3(0.55, 0.0, 0.0)) - 0.022;
  float beadB = length(r1 + vec3(0.55, 0.0, 0.0)) - 0.022;
  float dRing1All = min(dRing1, min(beadA, beadB));
  if (dRing1All < res.x) res = vec2(dRing1All, 2.0);

  // 3. Middle Hairline Titanium Ring
  vec3 r2 = gp;
  r2.yz *= rot2(-0.60 + t * 0.17 + alignFactor);
  r2.xz *= rot2(0.52);
  float dRing2 = sdTorus(r2, vec2(0.73, 0.0056));
  if (dRing2 < res.x) res = vec2(dRing2, 3.0);

  // 4. Outer Wide Hairline Meridian Ring
  vec3 r3 = gp;
  r3.xy *= rot2(-0.44 + t * 0.11);
  r3.xz *= rot2(-0.46 - 0.16 * cos(t * 0.28));
  float dRing3 = sdTorus(r3, vec2(0.91, 0.0048));
  if (dRing3 < res.x) res = vec2(dRing3, 3.0);

  return res;
}

vec3 calcNormal(vec3 p) {
  const vec2 e = vec2(0.0010, 0.0);
  return normalize(vec3(
    mapScene(p + e.xyy).x - mapScene(p - e.xyy).x,
    mapScene(p + e.yxy).x - mapScene(p - e.yxy).x,
    mapScene(p + e.yyx).x - mapScene(p - e.yyx).x
  ));
}

float calcAO(vec3 pos, vec3 nor) {
  float occ = 0.0;
  float sca = 1.0;
  for (int i = 0; i < 4; i++) {
    float h = 0.018 + 0.055 * float(i);
    float d = mapScene(pos + h * nor).x;
    occ += (h - d) * sca;
    sca *= 0.74;
  }
  return clamp(1.0 - 1.9 * occ, 0.22, 1.0);
}

void main() {
  // Fit sculpture centered with generous breathing room inside bounding sphere
  vec2 uv = v_ndc * 0.5;
  uv.x *= u_aspect;
  float zoom = u_aspect < 1.05 ? 1.15 / max(u_aspect, 0.65) : 1.04;
  vec3 ro = vec3(0.0, 0.0, 2.52 * zoom);
  vec3 rd = normalize(vec3(uv, -1.35));

  // Analytical bounding-sphere early exit (radius 1.04)
  float b = dot(ro, rd);
  float c = dot(ro, ro) - 1.04 * 1.04;
  float disc = b * b - c;
  if (disc < 0.0) {
    outColor = vec4(0.0);
    return;
  }

  float t = max(0.0, -b - sqrt(disc));
  float tMax = -b + sqrt(disc);

  int maxSteps = u_lite > 0.5 ? 28 : 50;
  float hitD = 1e5;
  float matId = 0.0;
  float minD = 1e5;

  for (int i = 0; i < 52; i++) {
    if (i >= maxSteps) break;
    vec3 p = ro + rd * t;
    vec2 h = mapScene(p);
    hitD = h.x;
    matId = h.y;
    minD = min(minD, hitD);
    if (hitD < 0.0008 || t > tMax) break;
    t += hitD * 0.88;
  }

  // Sharp hairline silhouette anti-aliasing so thin rings never fade out or blob
  float edgeMask = 1.0 - smoothstep(0.0008, 0.0055, minD);
  if (edgeMask <= 0.002) {
    outColor = vec4(0.0);
    return;
  }

  vec3 pos = ro + rd * t;
  vec3 N = calcNormal(pos);
  vec3 V = -rd;
  vec3 R = reflect(-V, N);

  vec3 L1 = normalize(vec3(-0.62, 0.86, 0.72));
  vec3 L2 = normalize(vec3(0.76, -0.34, 0.58));
  vec3 H1 = normalize(L1 + V);
  vec3 H2 = normalize(L2 + V);

  float wrap = clamp(dot(N, L1) * 0.5 + 0.5, 0.0, 1.0);
  float diff2 = max(dot(N, L2), 0.0);
  float specSharp = pow(max(dot(N, H1), 0.0), 136.0);
  float specBroad = pow(max(dot(N, H2), 0.0), 28.0);
  float fresnel = pow(1.0 - clamp(dot(N, V), 0.0, 1.0), 2.5);
  float ao = u_lite > 0.5 ? 0.90 : calcAO(pos, N);
  float horizon = smoothstep(-0.12, 0.14, R.y) * (1.0 - smoothstep(0.32, 0.76, R.y));
  float innerScatter = pow(1.0 - abs(dot(N, V)), 1.9);

  // Light Mode Palette (Translucent Botanical Quartz + Anodized Sage/Graphite Rings on Warm Off-White)
  vec3 colLight;
  if (matId < 1.5) {
    vec3 sageDeep = vec3(0.08, 0.23, 0.15);
    vec3 sageBody = vec3(0.20, 0.46, 0.32);
    vec3 sageQuartz = vec3(0.60, 0.84, 0.70);
    colLight = mix(sageDeep, sageBody, smoothstep(0.12, 0.74, wrap));
    colLight = mix(colLight, sageQuartz, horizon * 0.42 + innerScatter * 0.34 + specBroad * 0.32);
    colLight += vec3(0.90, 0.97, 0.92) * fresnel * 0.54;
    colLight += vec3(1.0) * specSharp * 1.05;
  } else if (matId < 2.5) {
    vec3 ringDeep = vec3(0.12, 0.30, 0.20);
    vec3 ringMid  = vec3(0.28, 0.56, 0.40);
    colLight = mix(ringDeep, ringMid, wrap);
    colLight += vec3(0.95, 0.99, 0.96) * (specSharp * 0.92 + fresnel * 0.28);
  } else {
    vec3 titDeep = vec3(0.24, 0.28, 0.25);
    vec3 titCrest = vec3(0.68, 0.72, 0.68);
    colLight = mix(titDeep, titCrest, smoothstep(0.12, 0.88, wrap));
    colLight += vec3(0.30, 0.55, 0.42) * (fresnel * 0.26 + diff2 * 0.08);
    colLight += vec3(1.0) * (specSharp * 0.88 + specBroad * 0.18);
  }
  colLight *= ao;

  // Dark Mode Palette (Luminous Emerald Quartz + Obsidian/Sage Instrument Rings)
  vec3 colDark;
  if (matId < 1.5) {
    vec3 dDeep = vec3(0.07, 0.19, 0.13);
    vec3 dMid  = vec3(0.23, 0.51, 0.36);
    vec3 dMint = vec3(0.66, 0.90, 0.75);
    colDark = mix(dDeep, dMid, smoothstep(0.12, 0.76, wrap));
    colDark = mix(colDark, dMint, horizon * 0.48 + innerScatter * 0.36 + fresnel * 0.45);
    colDark += vec3(0.96, 1.0, 0.98) * specSharp * 1.05;
  } else if (matId < 2.5) {
    colDark = mix(vec3(0.15, 0.34, 0.24), vec3(0.54, 0.82, 0.66), wrap);
    colDark += vec3(0.94, 0.99, 0.96) * (specSharp * 0.88 + fresnel * 0.36);
  } else {
    colDark = mix(vec3(0.18, 0.22, 0.19), vec3(0.56, 0.64, 0.59), smoothstep(0.12, 0.85, wrap));
    colDark += vec3(0.46, 0.72, 0.57) * fresnel * 0.42;
    colDark += vec3(0.98) * specSharp * 0.85;
  }
  colDark *= mix(1.0, ao, 0.85);

  vec3 finalCol = mix(colLight, colDark, u_theme);
  outColor = vec4(finalCol, edgeMask);
}
`;

function compileShader(
  gl: WebGL2RenderingContext,
  type: number,
  source: string
): WebGLShader {
  const shader = gl.createShader(type);
  if (!shader) throw new Error('Shader creation failed');
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const info = gl.getShaderInfoLog(shader) || 'Compile failed';
    gl.deleteShader(shader);
    throw new Error(info);
  }
  return shader;
}

function linkProgram(
  gl: WebGL2RenderingContext,
  vsSrc: string,
  fsSrc: string
): WebGLProgram {
  const vs = compileShader(gl, gl.VERTEX_SHADER, vsSrc);
  const fs = compileShader(gl, gl.FRAGMENT_SHADER, fsSrc);
  const program = gl.createProgram();
  if (!program) throw new Error('Program creation failed');
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  gl.deleteShader(vs);
  gl.deleteShader(fs);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const info = gl.getProgramInfoLog(program) || 'Link failed';
    gl.deleteProgram(program);
    throw new Error(info);
  }
  return program;
}

export default function WinnowThreeScene({
  tierOverride,
  rippleEnergy = 0,
  themeMode = 'light',
  onTierResolved,
  onFallbackToPoster,
}: WinnowThreeSceneProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef<{
    targetX: number;
    targetY: number;
    currX: number;
    currY: number;
    ripplePulse: number;
    themeTarget: number;
    themeCurr: number;
    isLite: number;
  }>({
    targetX: 0,
    targetY: 0,
    currX: 0,
    currY: 0,
    ripplePulse: 0,
    themeTarget: themeMode === 'dark' ? 1 : 0,
    themeCurr: themeMode === 'dark' ? 1 : 0,
    isLite: 0,
  });

  useEffect(() => {
    stateRef.current.themeTarget = themeMode === 'dark' ? 1 : 0;
  }, [themeMode]);

  useEffect(() => {
    if (rippleEnergy > 0) {
      stateRef.current.ripplePulse = 1.0;
    }
  }, [rippleEnergy]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const detected = tier();
    const effective: DeviceTier = tierOverride ?? detected;
    stateRef.current.isLite = effective === 'lite' ? 1 : 0;
    onTierResolved?.(effective);

    if (effective === 'poster') {
      onFallbackToPoster?.();
      return;
    }

    const gl = canvas.getContext('webgl2', {
      alpha: true,
      antialias: false,
      premultipliedAlpha: false,
      powerPreference: 'high-performance',
    });

    if (!gl) {
      onFallbackToPoster?.();
      return;
    }

    let program: WebGLProgram;
    try {
      program = linkProgram(gl, QUAD_VS, ARTIFACT_FS);
    } catch {
      onFallbackToPoster?.();
      return;
    }

    const quadVerts = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);
    const quadBuf = gl.createBuffer();
    if (!quadBuf) {
      dispose({ dispose: () => gl.deleteProgram(program) });
      onFallbackToPoster?.();
      return;
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, quadBuf);
    gl.bufferData(gl.ARRAY_BUFFER, quadVerts, gl.STATIC_DRAW);

    const aPosLoc = gl.getAttribLocation(program, 'a_pos');
    const uTimeLoc = gl.getUniformLocation(program, 'u_time');
    const uAspectLoc = gl.getUniformLocation(program, 'u_aspect');
    const uTiltXLoc = gl.getUniformLocation(program, 'u_tiltX');
    const uTiltYLoc = gl.getUniformLocation(program, 'u_tiltY');
    const uRippleLoc = gl.getUniformLocation(program, 'u_ripple');
    const uThemeLoc = gl.getUniformLocation(program, 'u_theme');
    const uLiteLoc = gl.getUniformLocation(program, 'u_lite');

    const gov = governor({
      level: effective,
      maxPixelRatio: 1.5,
      targetFps: 60,
      onDegrade: () => {
        stateRef.current.isLite = 1;
      },
    });

    const handleContextLost = (e: Event) => {
      e.preventDefault();
      onFallbackToPoster?.();
    };
    canvas.addEventListener('webglcontextlost', handleContextLost);

    const handlePointerMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      stateRef.current.targetX = Math.max(-1, Math.min(1, nx));
      stateRef.current.targetY = Math.max(-1, Math.min(1, ny));
    };

    const handlePointerLeave = () => {
      stateRef.current.targetX = 0;
      stateRef.current.targetY = 0;
    };

    canvas.addEventListener('pointermove', handlePointerMove, { passive: true });
    canvas.addEventListener('pointerleave', handlePointerLeave);

    const syncCanvasSize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = gov.getEffectivePixelRatio();
      const w = Math.max(1, Math.floor(rect.width * dpr));
      const h = Math.max(1, Math.floor(rect.height * dpr));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
      gl.viewport(0, 0, canvas.width, canvas.height);
    };

    syncCanvasSize();
    const ro = new ResizeObserver(syncCanvasSize);
    ro.observe(canvas);

    let elapsedSec = 0;
    let lastTs = performance.now();

    const loopHandle = gov.attach(canvas, (now: number) => {
      const dt = Math.min(0.05, Math.max(0.001, (now - lastTs) / 1000));
      lastTs = now;
      elapsedSec += dt;

      const s = stateRef.current;
      s.currX += (s.targetX - s.currX) * Math.min(1, dt * 6.0);
      s.currY += (s.targetY - s.currY) * Math.min(1, dt * 6.0);
      s.ripplePulse *= Math.pow(0.2, dt);
      s.themeCurr += (s.themeTarget - s.themeCurr) * Math.min(1, dt * 10.0);

      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

      gl.useProgram(program);
      gl.bindBuffer(gl.ARRAY_BUFFER, quadBuf);
      gl.enableVertexAttribArray(aPosLoc);
      gl.vertexAttribPointer(aPosLoc, 2, gl.FLOAT, false, 0, 0);

      const aspect = canvas.width / Math.max(1, canvas.height);
      gl.uniform1f(uTimeLoc, elapsedSec);
      gl.uniform1f(uAspectLoc, aspect);
      gl.uniform1f(uTiltXLoc, s.currX);
      gl.uniform1f(uTiltYLoc, s.currY);
      gl.uniform1f(uRippleLoc, s.ripplePulse);
      gl.uniform1f(uThemeLoc, s.themeCurr);
      gl.uniform1f(uLiteLoc, s.isLite);

      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    });

    return () => {
      loopHandle.detach();
      ro.disconnect();
      canvas.removeEventListener('pointermove', handlePointerMove);
      canvas.removeEventListener('pointerleave', handlePointerLeave);
      canvas.removeEventListener('webglcontextlost', handleContextLost);
      dispose({
        dispose: () => {
          gl.deleteBuffer(quadBuf);
          gl.deleteProgram(program);
        },
      });
    };
  }, [tierOverride, onTierResolved, onFallbackToPoster]);

  return (
    <canvas
      ref={canvasRef}
      aria-label="Botanical sage crystal core inside concentric calibration rings"
      className="w-full h-full block touch-pan-y cursor-grab active:cursor-grabbing"
    />
  );
}
