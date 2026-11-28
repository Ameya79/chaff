import fs from 'node:fs';
import path from 'node:path';
import { handleExplainFinding, handleGetRule } from './tools.js';
import { MCP_TOOLS_DEFINITIONS } from './server.js';

const names = new Set(['get_rule', 'explain_finding']);
const tools = MCP_TOOLS_DEFINITIONS.filter(tool => names.has(tool.name));

function error(id: unknown, code: number, message: string, status = 200) {
  return Response.json({ jsonrpc: '2.0', id, error: { code, message } }, { status });
}

export default {
  async fetch(request: Request): Promise<Response> {
    if (request.method !== 'POST') return new Response(null, { status: 405, headers: { Allow: 'POST' } });
    if (!request.headers.get('content-type')?.toLowerCase().startsWith('application/json')) {
      return new Response(null, { status: 415 });
    }

    let message;
    try {
      message = await request.json();
    } catch {
      return error(null, -32700, 'Invalid JSON', 400);
    }
    if (!message || message.jsonrpc !== '2.0' || typeof message.method !== 'string') {
      return error(null, -32600, 'Invalid JSON-RPC request', 400);
    }
    const { method, id, params } = message;
    if (id === undefined) return new Response(null, { status: 202 });
    if (typeof id !== 'string' && typeof id !== 'number') return error(null, -32600, 'Invalid request id', 400);
    let result: unknown;
    switch (method) {
      case 'initialize':
        result = { protocolVersion: '2025-03-26', capabilities: { tools: {} }, serverInfo: { name: 'chaff-mcp', version: '0.1.0' } };
        break;
      case 'ping':
        result = {};
        break;
      case 'tools/list':
        result = { tools };
        break;
      case 'tools/call': {
        if (!names.has(params?.name)) return error(id, -32602, 'Unknown hosted tool');
        const ruleId = params.arguments?.ruleId;
        if (typeof ruleId !== 'string' || !/^(UI|COPY|CODE|PERF|MOBILE|A11Y|MOTION|THREE)-\d{3}$/.test(ruleId)) {
          return error(id, -32602, 'Expected a Chaff rule ID');
        }
        const projectRoot = [path.resolve('dist'), path.resolve('packages/mcp/dist')].find(root =>
          fs.existsSync(path.join(root, 'rules', 'ui', 'UI-001.md')));
        if (!projectRoot) return error(id, -32603, 'Rule catalog unavailable', 500);
        const handler = params.name === 'get_rule' ? handleGetRule : handleExplainFinding;
        result = await handler({ projectRoot }, { ruleId });
        break;
      }
      default:
        return error(id, -32601, 'Method not found');
    }
    return Response.json({ jsonrpc: '2.0', id, result });
  },
};
