import assert from 'node:assert/strict';
import { test } from 'node:test';
import service from '../http.js';

function post(message: unknown) {
  return service.fetch(new Request('http://mcp.local/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(message),
  }));
}

test('hosted MCP lists and serves only the two read-only rule tools', async () => {
  const list = await post({ jsonrpc: '2.0', id: 1, method: 'tools/list' });
  const { result } = await list.json();
  assert.deepEqual(result.tools.map((tool: { name: string }) => tool.name), ['get_rule', 'explain_finding']);
  for (const name of ['get_rule', 'explain_finding', 'revert']) {
    const response = await post({ jsonrpc: '2.0', id: 2, method: 'tools/call', params: { name, arguments: { ruleId: 'UI-001' } } });
    const reply = await response.json();
    if (name === 'revert') assert.equal(reply.error.code, -32602);
    else {
      assert.equal(response.status, 200);
      assert.match(reply.result.content[0].text, /UI-001/);
      assert.equal(reply.result.isError, undefined);
    }
  }
});

test('initialization, notifications and unsupported methods have distinct responses', async () => {
  const initialized = await post({ jsonrpc: '2.0', id: 1, method: 'initialize' });
  assert.equal((await initialized.json()).result.serverInfo.name, 'chaff-mcp');
  assert.equal((await post({ jsonrpc: '2.0', method: 'notifications/initialized' })).status, 202);
  assert.equal((await service.fetch(new Request('http://mcp.local/'))).status, 405);
});
