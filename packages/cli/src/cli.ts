import { Command } from 'commander';
import { initCommand } from './commands/init.js';
import { doctorCommand } from './commands/doctor.js';
import { auditCommand } from './commands/audit.js';
import { levelCommand } from './commands/level.js';
import { gateCommand } from './commands/gate.js';
import { mcpCommand } from './commands/mcp.js';
import { phoneCommand } from './commands/phone.js';
import { revertCommand } from './commands/revert.js';

const program = new Command();

program
  .name('chaff')
  .description('Chaff — design audit and level enforcement toolkit for AI coding agents')
  .version('0.1.0');

program
  .command('init')
  .description('Initialize Chaff in the workspace, create Identity Lock and generate agent adapters')
  .option('-a, --agents <agents>', 'Comma-separated target agents (cursor,claude,windsurf,copilot,antigravity,all)')
  .option('-l, --level <level>', 'Operational level: 1 (Clean), 2 (Authored), 3 (Risk)', '2')
  .option('-f, --force', 'Force initialization even if git working tree is dirty')
  .action(async (options) => {
    await initCommand(process.cwd(), options);
  });

program
  .command('doctor')
  .description('Inspect framework, router, git status, and configured agent adapters')
  .action(async () => {
    await doctorCommand(process.cwd());
  });

program
  .command('audit')
  .description('Execute source code audit against Chaff rules and Identity Lock')
  .option('--json', 'Output report as JSON to stdout')
  .option('-l, --level <level>', 'Override operational level (1, 2, or 3)')
  .option('-r, --routes <routes>', 'Comma-separated routes to audit')
  .option('--strict', 'Exit with non-zero code if score is below 80')
  .action(async (options) => {
    await auditCommand(process.cwd(), options);
  });

program
  .command('gate')
  .description('Run automated performance, mobile, and Fallback Contract budgets gate')
  .option('-l, --level <level>', 'Override operational level (1, 2, or 3)')
  .action(async (options) => {
    await gateCommand(process.cwd(), options);
  });

program
  .command('mcp')
  .description('Start the Chaff MCP server over stdio for agent integration')
  .action(() => {
    mcpCommand(process.cwd());
  });

program
  .command('level <level>')
  .description('Switch the active operational level (1, 2, or 3)')
  .action(async (levelStr) => {
    await levelCommand(process.cwd(), levelStr);
  });

program
  .command('phone')
  .description('Serve dev build on LAN with live mobile HUD for real-device testing')
  .option('-p, --port <port>', 'Port number of your running dev server', '3000')
  .option('-h, --host <host>', 'Override host/IP address')
  .action(async (options) => {
    await phoneCommand(process.cwd(), options);
  });

program
  .command('revert <ruleId>')
  .description('Rollback fix for a specific rule and add it to Taste Memory rejection list')
  .option('-r, --reason <reason>', 'Optional reason for rejection')
  .action(async (ruleId, options) => {
    await revertCommand(process.cwd(), ruleId, options);
  });

program.parse(process.argv);
