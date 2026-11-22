import fs from 'node:fs/promises';
import path from 'node:path';
import { RuleLevel } from '@chaff/core';

export interface ConceptPitch {
  id: 'pitch-1' | 'pitch-2' | 'pitch-3';
  direction: 'A' | 'B' | 'C';
  title: string;
  typeModel: string;
  layoutStructure: string;
  motionModel: string;
  signatureInteraction: string;
  riskAssessment: string;
  filePath: string;
}

export interface DiversityValidationResult {
  valid: boolean;
  reasons: string[];
}

export function validatePitchDiversity(pitches: ConceptPitch[]): DiversityValidationResult {
  const reasons: string[] = [];

  if (pitches.length !== 3) {
    return {
      valid: false,
      reasons: [`Exactly 3 concept pitches required, found ${pitches.length}`],
    };
  }

  const [p1, p2, p3] = pitches;

  // Verify unique type models
  if (p1.typeModel === p2.typeModel || p1.typeModel === p3.typeModel || p2.typeModel === p3.typeModel) {
    reasons.push('Pitches must utilize distinct type models across all directions');
  }

  // Verify unique layout structures
  if (
    p1.layoutStructure === p2.layoutStructure ||
    p1.layoutStructure === p3.layoutStructure ||
    p2.layoutStructure === p3.layoutStructure
  ) {
    reasons.push('Pitches must utilize distinct layout structures across all directions');
  }

  // Verify unique motion models
  if (
    p1.motionModel === p2.motionModel ||
    p1.motionModel === p3.motionModel ||
    p2.motionModel === p3.motionModel
  ) {
    reasons.push('Pitches must utilize distinct motion models across all directions');
  }

  return {
    valid: reasons.length === 0,
    reasons,
  };
}

export async function generatePitches(
  projectRoot: string,
  level: RuleLevel = 2,
  theme: string = 'Editorial Workspace'
): Promise<ConceptPitch[]> {
  const pitchesDir = path.join(projectRoot, '.chaff', 'pitches');
  await fs.mkdir(pitchesDir, { recursive: true });

  const pitches: ConceptPitch[] = [
    {
      id: 'pitch-1',
      direction: 'A',
      title: 'Restrained Craft — Editorial Serif & Asymmetric Monospace',
      typeModel: 'Editorial serif display with tabular monospace metrics and 60ch prose measure',
      layoutStructure: 'Asymmetric 3-column editorial grid with full-bleed hairlines and generous whitespace',
      motionModel: 'Zero gratuitous motion; subtle transform/opacity micro-elevations on hover only',
      signatureInteraction: 'Instant tactile feedback on navigation with native View Transitions',
      riskAssessment: 'Low risk. Zero performance penalty, maximum reading comfort and typographic clarity.',
      filePath: path.join(pitchesDir, 'pitch-1.md'),
    },
    {
      id: 'pitch-2',
      direction: 'B',
      title: 'Kinetic Narrative — Scroll-Driven Chromatic Displacement',
      typeModel: 'Crisp grotesque display with negative tracking (-0.02em) and optical sizing',
      layoutStructure: 'Vertical editorial story flow with staggered pinned sidebars and full-bleed banners',
      motionModel: 'CSS scroll-driven progress animations linked to scroll timeline; prefers-reduced-motion respected',
      signatureInteraction: 'Smooth parallax section progression with synchronized metadata reveals',
      riskAssessment: 'Medium risk. CSS native scroll timelines require modern browser baseline; graceful fallback to static flow.',
      filePath: path.join(pitchesDir, 'pitch-2.md'),
    },
    {
      id: 'pitch-3',
      direction: 'C',
      title: 'Physical Tactility — Spring Physics & Spatial Canvas',
      typeModel: 'Geometric modernist display paired with dense tabular numeric data grids',
      layoutStructure: 'Modular fluid cards on a rigid 8px spatial rhythm with tactile draggable surfaces',
      motionModel: level === 3
        ? 'Interactive WebGL particle field island governed by @chaff/tier (caps DPR at 1.5, pauses offscreen)'
        : 'Spring physics micro-interactions via CSS transforms and spring-timed damping',
      signatureInteraction: 'Physical momentum scrolling on data cards with subtle inertia snaps',
      riskAssessment: level === 3
        ? 'High creative daring protected by the 5-part Fallback Contract (static poster rendered for Tier 0 devices).'
        : 'Low-to-medium risk. Pure CSS springs ensure 60fps main thread responsiveness.',
      filePath: path.join(pitchesDir, 'pitch-3.md'),
    },
  ];

  for (const p of pitches) {
    const md = `# Concept Pitch Direction ${p.direction}: ${p.title}

- **Operating Level:** Level ${level}
- **Theme:** ${theme}
- **Type Hierarchy:** ${p.typeModel}
- **Layout Architecture:** ${p.layoutStructure}
- **Motion Model:** ${p.motionModel}
- **Signature Interaction:** ${p.signatureInteraction}
- **Risk & Performance Assessment:** ${p.riskAssessment}

## Human Decision Gate
Review this direction against project goals. Select Direction ${p.direction} by running:
\`\`\`bash
npx chaff plan --choose ${p.direction}
\`\`\`
`;
    await fs.writeFile(p.filePath, md, 'utf-8');
  }

  return pitches;
}
