import { test, describe } from 'node:test';
import assert from 'node:assert';
import path from 'node:path';
import fs from 'node:fs';
import { processJsonRpcMessage, MCP_TOOLS_DEFINITIONS } from '../index.js';

function findRepoRoot(dir = process.cwd()): string {
  let cur = path.resolve(dir);
  while (cur !== path.dirname(cur)) {
    if (fs.existsSync(path.join(cur, 'pnpm-workspace.yaml'))) {
      return cur;
    }
    cur = path.dirname(cur);
  }
  return cur;
}

describe('@chaff/mcp Server & Tools Protocol', () => {
  const rootDir = findRepoRoot();
  const ctx = { projectRoot: rootDir };

  test('responds to initialize with protocol version and serverInfo', async () => {
    const res = await processJsonRpcMessage(ctx, {
      jsonrpc: '2.0',
      id: 1,
      method: 'initialize',
      params: {},
    });

    assert.strictEqual(res.id, 1);
    assert.strictEqual(res.result.serverInfo.name, 'chaff-mcp');
    assert.ok(res.result.capabilities.tools);
  });

  test('responds to tools/list with all 7 required MCP tools', async () => {
    const res = await processJsonRpcMessage(ctx, {
      jsonrpc: '2.0',
      id: 2,
      method: 'tools/list',
      params: {},
    });

    assert.strictEqual(res.id, 2);
    const tools = res.result.tools;
    assert.strictEqual(tools.length, 7, 'Must define exactly 7 tools');

    const toolNames = tools.map((t: any) => t.name);
    const requiredTools = ['audit', 'plan', 'gate', 'get_rule', 'explain_finding', 'waive', 'revert'];
    for (const req of requiredTools) {
      assert.ok(toolNames.includes(req), `Tool '${req}' must be defined in tools/list`);
    }
  });

  test('calls get_rule and returns rule definition', async () => {
    const res = await processJsonRpcMessage(ctx, {
      jsonrpc: '2.0',
      id: 3,
      method: 'tools/call',
      params: {
        name: 'get_rule',
        arguments: { ruleId: 'UI-001' },
      },
    });

    assert.strictEqual(res.id, 3);
    const data = JSON.parse(res.result.content[0].text);
    assert.strictEqual(data.id, 'UI-001');
    assert.ok(data.bad.length > 5);
    assert.ok(data.good.length > 5);
    assert.ok(data.why.length > 15);
  });

  test('calls explain_finding with smallest fix guidance', async () => {
    const res = await processJsonRpcMessage(ctx, {
      jsonrpc: '2.0',
      id: 4,
      method: 'tools/call',
      params: {
        name: 'explain_finding',
        arguments: { ruleId: 'THREE-004' },
      },
    });

    assert.strictEqual(res.id, 4);
    const data = JSON.parse(res.result.content[0].text);
    assert.strictEqual(data.ruleId, 'THREE-004');
    assert.ok(data.smallestFix.includes('IntersectionObserver'));
  });

  test('calls plan and generates 3 diverse Concept Pitches at Level 2', async () => {
    const res = await processJsonRpcMessage(ctx, {
      jsonrpc: '2.0',
      id: 5,
      method: 'tools/call',
      params: {
        name: 'plan',
        arguments: { level: 2 },
      },
    });

    assert.strictEqual(res.id, 5);
    const plan = JSON.parse(res.result.content[0].text);
    assert.strictEqual(plan.level, 2);
    assert.ok(plan.pitches, 'Pitches must be generated at Level 2');
    assert.strictEqual(plan.pitches.pitchesGenerated.length, 3);
    assert.strictEqual(plan.pitches.diversityVerified, true);
  });

  test('calls gate and returns budget evaluation', async () => {
    const res = await processJsonRpcMessage(ctx, {
      jsonrpc: '2.0',
      id: 6,
      method: 'tools/call',
      params: {
        name: 'gate',
        arguments: { level: 2 },
      },
    });

    assert.strictEqual(res.id, 6);
    const gateReport = JSON.parse(res.result.content[0].text);
    assert.ok(Array.isArray(gateReport.results));
    assert.strictEqual(typeof gateReport.passed, 'boolean');
  });

  test('calls waive and persists waiver to identity file', async () => {
    const res = await processJsonRpcMessage(ctx, {
      jsonrpc: '2.0',
      id: 7,
      method: 'tools/call',
      params: {
        name: 'waive',
        arguments: {
          ruleId: 'UI-004',
          reason: 'Client corporate color palette is purple',
        },
      },
    });

    assert.strictEqual(res.id, 7);
    assert.ok(res.result.content[0].text.includes('Recorded waiver for rule UI-004'));
  });

  test('calls revert and returns instruction', async () => {
    const res = await processJsonRpcMessage(ctx, {
      jsonrpc: '2.0',
      id: 8,
      method: 'tools/call',
      params: {
        name: 'revert',
        arguments: { ruleId: 'COPY-001' },
      },
    });

    assert.strictEqual(res.id, 8);
    assert.ok(res.result.content[0].text.includes('Revert requested for rule COPY-001'));
  });
});
