import path from 'node:path';
import {
  loadIdentity,
  buildIdentity,
  generateReportJson,
  RuleLevel,
  getRuleById,
  saveIdentity,
} from '@chaff/core';
import { runSourceChecks, checkRenderedBudgets } from '@chaff/checks';
import { generatePitches, validatePitchDiversity, ConceptPitch } from './pitches.js';

export interface McpContext {
  projectRoot: string;
}

// 1. Tool: audit
export async function handleAudit(ctx: McpContext, args: { level?: number; routes?: string[] }) {
  const level = (args.level || 2) as RuleLevel;
  let identity = await loadIdentity(ctx.projectRoot);
  if (!identity) identity = await buildIdentity(ctx.projectRoot);

  const findings = await runSourceChecks(ctx.projectRoot, identity, { routes: args.routes });
  const report = generateReportJson(ctx.projectRoot, findings, identity, level);

  return {
    content: [
      {
        type: 'text',
        text: JSON.stringify(report, null, 2),
      },
    ],
  };
}

// 2. Tool: plan
export async function handlePlan(ctx: McpContext, args: { level?: number; choose?: string }) {
  const level = (args.level || 2) as RuleLevel;
  let identity = await loadIdentity(ctx.projectRoot);
  if (!identity) identity = await buildIdentity(ctx.projectRoot);

  const findings = await runSourceChecks(ctx.projectRoot, identity);
  const openFindings = findings.filter((f) => f.status === 'open');

  let pitchesSummary: any = null;
  if (level >= 2) {
    const pitches = await generatePitches(ctx.projectRoot, level);
    const diversity = validatePitchDiversity(pitches);
    pitchesSummary = {
      pitchesGenerated: pitches.map((p: ConceptPitch) => ({ direction: p.direction, title: p.title })),
      diversityVerified: diversity.valid,
    };
  }

  const plan = {
    level,
    findingsToRemediate: openFindings.length,
    pitches: pitchesSummary,
    orderedSteps: openFindings.map((f, i) => ({
      step: i + 1,
      ruleId: f.ruleId,
      file: f.file,
      line: f.line,
      fixClass: f.fixClass,
      action: `Remediate ${f.ruleId} violation: ${f.message}`,
    })),
  };

  return {
    content: [
      {
        type: 'text',
        text: JSON.stringify(plan, null, 2),
      },
    ],
  };
}

// 3. Tool: gate
export async function handleGate(ctx: McpContext, args: { level?: number }) {
  const level = (args.level || 2) as RuleLevel;
  const gateReport = await checkRenderedBudgets(ctx.projectRoot, level);

  return {
    content: [
      {
        type: 'text',
        text: JSON.stringify(gateReport, null, 2),
      },
    ],
  };
}

// 4. Tool: get_rule
export async function handleGetRule(ctx: McpContext, args: { ruleId: string }) {
  const rulesDir = path.join(ctx.projectRoot, 'rules');
  const rule = await getRuleById(args.ruleId, rulesDir);

  if (!rule) {
    return {
      isError: true,
      content: [{ type: 'text', text: `Rule '${args.ruleId}' not found in rules directory.` }],
    };
  }

  return {
    content: [
      {
        type: 'text',
        text: JSON.stringify(
          {
            id: rule.id,
            title: rule.title,
            severity: rule.severity,
            levels: rule.levels,
            fix_class: rule.fix_class,
            bad: rule.bad,
            good: rule.good,
            why: rule.why,
            exceptions: rule.exceptions,
            remediationSteps: rule.remediationSteps,
          },
          null,
          2
        ),
      },
    ],
  };
}

// 5. Tool: explain_finding
export async function handleExplainFinding(ctx: McpContext, args: { ruleId: string; file?: string; line?: number }) {
  const rulesDir = path.join(ctx.projectRoot, 'rules');
  const rule = await getRuleById(args.ruleId, rulesDir);

  if (!rule) {
    return {
      isError: true,
      content: [{ type: 'text', text: `Rule '${args.ruleId}' not found.` }],
    };
  }

  const explanation = {
    ruleId: rule.id,
    title: rule.title,
    severity: rule.severity,
    whyFired: rule.why,
    smallestFix: rule.good,
    remediationGuide: rule.remediationSteps,
    exceptions: rule.exceptions,
  };

  return {
    content: [
      {
        type: 'text',
        text: JSON.stringify(explanation, null, 2),
      },
    ],
  };
}

// 6. Tool: waive
export async function handleWaive(ctx: McpContext, args: { ruleId: string; reason: string; token?: string }) {
  let identity = await loadIdentity(ctx.projectRoot);
  if (!identity) identity = await buildIdentity(ctx.projectRoot);

  const alreadyExists = identity.waivers.some(
    (w) => w.ruleId === args.ruleId && w.reason === args.reason
  );
  if (!alreadyExists) {
    identity.waivers.push({
      ruleId: args.ruleId,
      token: args.token,
      reason: args.reason,
      approvedBy: 'mcp-user',
    });
    await saveIdentity(ctx.projectRoot, identity);
  }

  return {
    content: [
      {
        type: 'text',
        text: `Recorded waiver for rule ${args.ruleId}: "${args.reason}". Saved to .chaff/identity.json.`,
      },
    ],
  };
}

// 7. Tool: revert
export async function handleRevert(ctx: McpContext, args: { ruleId: string }) {
  return {
    content: [
      {
        type: 'text',
        text: `Revert requested for rule ${args.ruleId}. Use git revert with commit tagged [${args.ruleId}].`,
      },
    ],
  };
}
