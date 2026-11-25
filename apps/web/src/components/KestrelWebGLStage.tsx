'use client';

import React, { useEffect, useRef } from 'react';
import { governor, dispose, DeviceTier } from '@chaff/tier';

export interface KestrelWebGLStageProps {
  deviceTier: Exclude<DeviceTier, 'poster'>;
  wipePercent: number;
  windBoost: number;
  stageMode: 'side' | 'curtain' | 'before' | 'after';
  onWebGLUnavailable?: () => void;
}

const VERTEX_SHADER_SRC = `#version 300 es
precision mediump float;
in vec2 a_pos;
in vec4 a_meta; // x: speed, y: mass (0=husk, 1=grain), z: phase, w: size
uniform float u_time;
uniform float u_wipe;
uniform float u_wind;
uniform float u_sideMode;
uniform vec2 u_pointer;
out float v_mass;
out float v_alpha;

void main() {
  float t = u_time * (0.4 + a_meta.x * 0.65);
  float isGrain = a_meta.y;
  float curtainX = (u_wipe * 2.0 - 1.0);
  float cycle = fract(a_pos.x + t * (0.18 + u_wind * 0.28));

  float x;
  float y;
  float alphaBase;

  if (u_sideMode > 0.5) {
    // Side-by-side mode: focus particles strictly along the center winnowing seam
    float spread = 0.09 + u_wind * 0.04;
    if (isGrain > 0.5) {
      x = 0.015 + a_pos.x * 0.065 + sin(u_time * 1.6 + a_meta.z) * 0.008;
      y = 1.02 - fract(a_pos.y + t * 0.24) * 2.04;
      alphaBase = 0.65 * (1.0 - a_pos.x * 0.6);
    } else {
      x = -0.01 - cycle * spread;
      float flutter = sin(cycle * 9.0 + u_time * 2.4 + a_meta.z) * 0.09;
      y = (a_pos.y * 2.0 - 1.0) + flutter;
      alphaBase = (1.0 - cycle) * 0.72;
    }
  } else {
    // Curtain / Before / After mode: particles stream actively off the moving winnowing front
    if (isGrain > 0.5) {
      x = curtainX + 0.02 + a_pos.x * 0.28 + sin(u_time * 1.4 + a_meta.z) * 0.012;
      y = 1.04 - fract(a_pos.y + t * 0.22) * 2.08;
      alphaBase = (1.0 - abs(y) * 0.45) * (1.0 - a_pos.x * 0.55);
    } else {
      x = curtainX + (cycle - 0.15) * (0.55 + u_wind * 0.45);
      float curl = sin(x * 5.2 + u_time * 2.3 + a_meta.z) * 0.15;
      y = (a_pos.y * 2.0 - 1.0) + curl * (0.4 + u_wind);
      alphaBase = (1.0 - cycle) * 0.92;
    }
  }

  // Interactive pointer wake
  vec2 delta = vec2(x, y) - u_pointer;
  float dist = length(delta);
  if (dist < 0.30 && dist > 0.001) {
    vec2 push = normalize(delta) * (0.30 - dist) * 0.24;
    x += push.x;
    y += push.y;
  }

  gl_Position = vec4(x, y, 0.0, 1.0);
  gl_PointSize = a_meta.w * (isGrain > 0.5 ? 1.05 : (1.0 - cycle * 0.4));

  v_mass = isGrain;
  v_alpha = clamp(alphaBase, 0.0, 1.0) * (0.55 + u_wind * 0.35);
}
`;

const FRAGMENT_SHADER_SRC = `#version 300 es
precision mediump float;
in float v_mass;
in float v_alpha;
out vec4 outColor;

void main() {
  vec2 uv = gl_PointCoord * 2.0 - 1.0;
  float d = dot(uv, uv);
  if (d > 1.0) discard;

  float soft = smoothstep(1.0, 0.12, d);
  // Heavy grain: warm archival gold; Dispersed slop husk: violet-ash fading to ember
  vec3 grainColor = vec3(0.82, 0.63, 0.25);
  vec3 huskColor = mix(vec3(0.45, 0.18, 0.88), vec3(0.76, 0.28, 0.08), 0.48);
  vec3 color = mix(huskColor, grainColor, v_mass);
  outColor = vec4(color, soft * v_alpha * 0.82);
}
`;

function compileShader(gl: WebGL2RenderingContext, type: number, source: string): WebGLShader | null {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

/**
 * Custom lightweight WebGL2 GLSL Particle & Winnowing Displacement Engine (~5KB).
 * Complies with all 5 parts of Chaff's Level 3 Fallback Contract:
 * lazy-imported with ssr:false, @chaff/tier profiling, 1.5 DPR ceiling,
 * IntersectionObserver + document.hidden pausing, and full GPU disposal.
 */
export default function KestrelWebGLStage({
  deviceTier,
  wipePercent,
  windBoost,
  stageMode,
  onWebGLUnavailable,
}: KestrelWebGLStageProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const wipeRef = useRef(wipePercent / 100);
  const windRef = useRef(windBoost);
  const sideModeRef = useRef(stageMode === 'side' ? 1.0 : 0.0);
  const pointerRef = useRef<[number, number]>([2, 2]);
  const degradedCountRef = useRef<number | null>(null);

  useEffect(() => {
    wipeRef.current = wipePercent / 100;
  }, [wipePercent]);

  useEffect(() => {
    windRef.current = windBoost;
  }, [windBoost]);

  useEffect(() => {
    sideModeRef.current = stageMode === 'side' ? 1.0 : 0.0;
  }, [stageMode]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl2', {
      alpha: true,
      antialias: false,
      powerPreference: 'low-power',
    });

    if (!gl) {
      onWebGLUnavailable?.();
      return;
    }

    const vs = compileShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER_SRC);
    const fs = compileShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER_SRC);
    if (!vs || !fs) {
      if (vs) gl.deleteShader(vs);
      if (fs) gl.deleteShader(fs);
      onWebGLUnavailable?.();
      return;
    }

    const program = gl.createProgram();
    if (!program) {
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      onWebGLUnavailable?.();
      return;
    }

    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      onWebGLUnavailable?.();
      return;
    }

    const maxParticles = deviceTier === 'full' ? 320 : 100;
    const posData = new Float32Array(maxParticles * 2);
    const metaData = new Float32Array(maxParticles * 4);

    for (let i = 0; i < maxParticles; i++) {
      posData[i * 2] = Math.random();
      posData[i * 2 + 1] = Math.random();
      const isGrain = i % 3 === 0 ? 1.0 : 0.0;
      metaData[i * 4] = Math.random();
      metaData[i * 4 + 1] = isGrain;
      metaData[i * 4 + 2] = Math.random() * Math.PI * 2;
      metaData[i * 4 + 3] = isGrain > 0.5 ? 4.0 + Math.random() * 2.8 : 4.8 + Math.random() * 4.2;
    }

    // Upload static particle buffers once (never re-allocated per frame)
    const posBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, posData, gl.STATIC_DRAW);

    const metaBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, metaBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, metaData, gl.STATIC_DRAW);

    const posLoc = gl.getAttribLocation(program, 'a_pos');
    const metaLoc = gl.getAttribLocation(program, 'a_meta');
    const uTimeLoc = gl.getUniformLocation(program, 'u_time');
    const uWipeLoc = gl.getUniformLocation(program, 'u_wipe');
    const uWindLoc = gl.getUniformLocation(program, 'u_wind');
    const uSideLoc = gl.getUniformLocation(program, 'u_sideMode');
    const uPtrLoc = gl.getUniformLocation(program, 'u_pointer');

    const gov = governor({
      level: deviceTier,
      maxPixelRatio: 1.5,
      targetFps: 60,
      onDegrade: () => {
        degradedCountRef.current = Math.max(48, Math.floor(maxParticles * 0.45));
      },
    });

    const syncCanvasSize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = gov.getEffectivePixelRatio();
      const w = Math.max(1, Math.floor(rect.width * dpr));
      const h = Math.max(1, Math.floor(rect.height * dpr));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
      gl.viewport(0, 0, w, h);
    };

    syncCanvasSize();
    const resizeObserver =
      typeof ResizeObserver !== 'undefined'
        ? new ResizeObserver(syncCanvasSize)
        : null;
    resizeObserver?.observe(canvas);

    const onPointerMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      pointerRef.current = [nx, ny];
    };
    const parentEl = canvas.parentElement;
    parentEl?.addEventListener('pointermove', onPointerMove, { passive: true });

    const onContextLost = (e: Event) => {
      e.preventDefault();
      onWebGLUnavailable?.();
    };
    canvas.addEventListener('webglcontextlost', onContextLost);

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    const startTime = performance.now();
    const controller = gov.attach(canvas, (now) => {
      if (gl.isContextLost()) return;
      const elapsed = (now - startTime) * 0.001;

      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.useProgram(program);

      gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
      gl.enableVertexAttribArray(posLoc);
      gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

      gl.bindBuffer(gl.ARRAY_BUFFER, metaBuffer);
      gl.enableVertexAttribArray(metaLoc);
      gl.vertexAttribPointer(metaLoc, 4, gl.FLOAT, false, 0, 0);

      gl.uniform1f(uTimeLoc, elapsed);
      gl.uniform1f(uWipeLoc, wipeRef.current);
      gl.uniform1f(uWindLoc, windRef.current);
      gl.uniform1f(uSideLoc, sideModeRef.current);
      gl.uniform2f(uPtrLoc, pointerRef.current[0], pointerRef.current[1]);

      const drawCount = degradedCountRef.current ?? maxParticles;
      gl.drawArrays(gl.POINTS, 0, drawCount);
    });

    return () => {
      controller.detach();
      resizeObserver?.disconnect();
      parentEl?.removeEventListener('pointermove', onPointerMove);
      canvas.removeEventListener('webglcontextlost', onContextLost);
      if (!gl.isContextLost()) {
        if (posBuffer) gl.deleteBuffer(posBuffer);
        if (metaBuffer) gl.deleteBuffer(metaBuffer);
        gl.deleteProgram(program);
        gl.deleteShader(vs);
        gl.deleteShader(fs);
      }
      dispose({
        forceContextLoss: () => {
          if (!gl.isContextLost()) {
            gl.getExtension('WEBGL_lose_context')?.loseContext();
          }
        },
      });
    };
  }, [deviceTier, onWebGLUnavailable]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-20 w-full h-full"
    />
  );
}
