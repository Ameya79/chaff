---
id: THREE-003
title: Implement deterministic device tier classification via @chaff/tier
severity: high
levels: [3]
detect: static
fix_class: hardware_profiling
bad: "function startScene() {\n  const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });\n  initPostProcessing(renderer);\n}"
good: "import { getDeviceTier } from '@chaff/tier';\n\nconst tier = getDeviceTier();\nif (tier === 'poster') {\n  renderStaticPoster();\n} else {\n  const renderer = new THREE.WebGLRenderer({\n    antialias: tier === 'full',\n    powerPreference: tier === 'full' ? 'high-performance' : 'low-power'\n  });\n  if (tier === 'full') initPostProcessing(renderer);\n}"
why: "Initializing demanding WebGL pipelines on low-tier mobile devices causes GPU crashes, thermal throttling, and OS kills. Clause 3 of the Fallback Contract mandates device tier evaluation into full (Tier 2), lite (Tier 1), or poster (Tier 0), never running complex shaders on constrained hardware."
exceptions: "Internal developer benchmarking environments where explicit URL parameters (?chaff_force_tier=full) override device heuristics."
---

## Context & Problem
Client hardware capabilities vary dramatically across mobile ecosystems, spanning high-end desktop GPUs with dedicated VRAM down to entry-level smartphones with 2 GB shared system memory and integrated GPUs. AI models frequently author 3D scenes assuming desktop workstation capabilities, configuring high-sample anti-aliasing, screen-space ambient occlusion (SSAO), bloom passes, and thousands of particle instances. When executed on low-tier hardware, these shaders cause instant memory exhaustion, thermal throttling, stuttering sub-15fps framerates, and browser tab termination by the mobile operating system.

## Detection Logic
Static source code scanner parses 3D initialization routines and checks for device capability profiling. Flags codebases where WebGL contexts or R3F Canvas components are instantiated unconditionally without inspecting client hardware concurrency (`navigator.hardwareConcurrency`), device memory (`navigator.deviceMemory`), effective connection type, or data-saver status (`navigator.connection.saveData`).

## Remediation Steps
1. Integrate hardware capability tier profiling (or `@chaff/tier`) to classify devices into three deterministic performance tiers:
   - **Tier 2 (Full)**: High memory (>= 8GB RAM), >= 6 CPU cores, high-speed connection. Enables full post-processing, high-fidelity shaders, and dynamic shadows.
   - **Tier 1 (Lite)**: Mid-tier devices (4GB - 6GB RAM, 4 CPU cores). Disables heavy post-processing passes, simplifies shaders to unlit or basic Lambert materials, and caps mesh resolution.
   - **Tier 0 (Poster)**: Constrained devices (< 4GB RAM, 2 CPU cores, or `saveData: true`). Completely bypasses WebGL context instantiation and displays the SSR static poster fallback.
2. Ensure that users in battery-saver mode or low-power state automatically downgrade to Tier 1 or Tier 0.

## Verification
Simulate constrained hardware in automated testing by mocking `navigator.deviceMemory = 2` and `navigator.hardwareConcurrency = 2`. Verify that the application evaluates the device as Tier 0, does not create a WebGL canvas context, and renders the static poster image.
