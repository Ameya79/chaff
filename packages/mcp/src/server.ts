import readline from 'node:readline';
import {
  handleAudit,
  handlePlan,
  handleGate,
  handleGetRule,
  handleExplainFinding,
  handleWaive,
  handleRevert,
  McpContext,
} from './tools.js';

export const MCP_TOOLS_DEFINITIONS = [
  {
    name: 'audit',
    description: 'Run Chaff source and rendered-page design audit, returning findings and 4-category scores.',
    inputSchema: {
      type: 'object',
      properties: {
        level: { type: 'number', description: 'Operating level: 1 (Clean), 2 (Authored), 3 (Risk)' },
        routes: { type: 'array', items: { type: 'string' }, description: 'Specific routes to audit' },
      },
    },
  },
  {
    name: 'plan',
    description: 'Build an ordered remediation plan for a level, generating 3 Concept Pitches at Level 2 and Level 3.',
    inputSchema: {
      type: 'object',
      properties: {
        level: { type: 'number', description: 'Operating level (1, 2, or 3)' },
        choose: { type: 'string', description: 'Chosen pitch direction (A, B, or C)' },
      },
    },
  },
  {
    name: 'gate',
    description: 'Evaluate performance, mobile, and Fallback Contract budgets, returning pass/fail with measured numbers.',
    inputSchema: {
      type: 'object',
      properties: {
        level: { type: 'number', description: 'Operating level (1, 2, or 3)' },
      },
    },
  },
  {
    name: 'get_rule',
    description: 'Retrieve complete rule definition by ID with bad and good code snippets, why, and exceptions.',
    inputSchema: {
      type: 'object',
      properties: {
        ruleId: { type: 'string', description: 'Rule ID, e.g. UI-001, COPY-001, THREE-004' },
      },
      required: ['ruleId'],
    },
  },
  {
    name: 'explain_finding',
    description: 'Explain why an audit finding fired, its impact, and the smallest genuine code fix.',
    inputSchema: {
      type: 'object',
      properties: {
        ruleId: { type: 'string', description: 'Rule ID of the finding' },
        file: { type: 'string', description: 'File path where the finding occurred' },
        line: { type: 'number', description: 'Line number' },
      },
      required: ['ruleId'],
    },
  },
  {
    name: 'waive',
    description: 'Record a waiver with a reason in .chaff/identity.json so intentional brand design is not penalized.',
    inputSchema: {
      type: 'object',
      properties: {
        ruleId: { type: 'string', description: 'Rule ID to waive' },
        reason: { type: 'string', description: 'Business or brand justification for the waiver' },
        token: { type: 'string', description: 'Optional design token name' },
      },
      required: ['ruleId', 'reason'],
    },
  },
  {
    name: 'revert',
    description: 'Revert the commit associated with a specific rule finding.',
    inputSchema: {
      type: 'object',
      properties: {
        ruleId: { type: 'string', description: 'Rule ID to revert' },
      },
      required: ['ruleId'],
    },
  },
];

export async function processJsonRpcMessage(
  ctx: McpContext,
  msg: any
): Promise<any> {
  const { id, method, params } = msg;

  if (method === 'initialize') {
    return {
      jsonrpc: '2.0',
      id,
      result: {
        protocolVersion: '2024-11-05',
        capabilities: { tools: {} },
        serverInfo: {
          name: 'chaff-mcp',
          version: '0.1.0',
        },
      },
    };
  }

  if (method === 'tools/list') {
    return {
      jsonrpc: '2.0',
      id,
      result: {
        tools: MCP_TOOLS_DEFINITIONS,
      },
    };
  }

  if (method === 'tools/call') {
    const name = params?.name;
    const args = params?.arguments || {};

    let toolResult: any;
    switch (name) {
      case 'audit':
        toolResult = await handleAudit(ctx, args);
        break;
      case 'plan':
        toolResult = await handlePlan(ctx, args);
        break;
      case 'gate':
        toolResult = await handleGate(ctx, args);
        break;
      case 'get_rule':
        toolResult = await handleGetRule(ctx, args);
        break;
      case 'explain_finding':
        toolResult = await handleExplainFinding(ctx, args);
        break;
      case 'waive':
        toolResult = await handleWaive(ctx, args);
        break;
      case 'revert':
        toolResult = await handleRevert(ctx, args);
        break;
      default:
        return {
          jsonrpc: '2.0',
          id,
          error: { code: -32601, message: `Unknown tool: ${name}` },
        };
    }

    return {
      jsonrpc: '2.0',
      id,
      result: toolResult,
    };
  }

  return {
    jsonrpc: '2.0',
    id,
    error: { code: -32601, message: `Method not found: ${method}` },
  };
}

export function startMcpServer(projectRoot: string) {
  const ctx: McpContext = { projectRoot };
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false,
  });

  rl.on('line', async (line) => {
    if (!line.trim()) return;
    try {
      const msg = JSON.parse(line);
      const res = await processJsonRpcMessage(ctx, msg);
      process.stdout.write(JSON.stringify(res) + '\n');
    } catch (err: any) {
      process.stdout.write(
        JSON.stringify({
          jsonrpc: '2.0',
          id: null,
          error: { code: -32700, message: err.message },
        }) + '\n'
      );
    }
  });
}
