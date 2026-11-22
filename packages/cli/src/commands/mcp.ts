import { startMcpServer } from '@chaff/mcp';

export function mcpCommand(projectRoot: string) {
  startMcpServer(projectRoot);
}
