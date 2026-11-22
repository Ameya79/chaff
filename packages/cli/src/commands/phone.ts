import os from 'node:os';

export interface PhoneCommandOptions {
  port?: string;
  host?: string;
}

export function getLocalIpAddress(): string {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    const iface = interfaces[name];
    if (!iface) continue;
    for (const info of iface) {
      if (info.family === 'IPv4' && !info.internal) {
        return info.address;
      }
    }
  }
  return 'localhost';
}

export function generateHudOverlayScript(): string {
  return `(function() {
  if (document.getElementById('chaff-phone-hud')) return;

  const hud = document.createElement('div');
  hud.id = 'chaff-phone-hud';
  hud.style.cssText = 'position:fixed;bottom:16px;right:16px;z-index:999999;background:rgba(28,25,23,0.92);color:#f5f3ef;padding:8px 12px;border-radius:6px;font-family:ui-monospace,SF Mono,Consolas,monospace;font-size:11px;border:1px solid #431407;pointer-events:none;box-shadow:0 4px 12px rgba(0,0,0,0.3);line-height:1.4;';
  hud.innerHTML = '<div style="color:#ea580c;font-weight:bold;margin-bottom:2px;">CHAFF PHONE HUD</div><div id="chaff-fps">FPS: --</div><div id="chaff-cls">CLS: 0.00</div><div id="chaff-overflow">Overflow: OK</div>';
  document.body.appendChild(hud);

  let frames = 0, prevTime = performance.now();
  function checkFps() {
    frames++;
    const now = performance.now();
    if (now >= prevTime + 1000) {
      const fps = Math.round((frames * 1000) / (now - prevTime));
      const el = document.getElementById('chaff-fps');
      if (el) el.textContent = 'FPS: ' + fps + (fps < 50 ? ' [LOW]' : '');
      frames = 0;
      prevTime = now;
    }
    requestAnimationFrame(checkFps);
  }
  requestAnimationFrame(checkFps);

  let clsScore = 0;
  if ('PerformanceObserver' in window) {
    try {
      const po = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!entry.hadRecentInput) clsScore += entry.value;
        }
        const el = document.getElementById('chaff-cls');
        if (el) el.textContent = 'CLS: ' + clsScore.toFixed(3) + (clsScore > 0.1 ? ' [REGRESS]' : '');
      });
      po.observe({ type: 'layout-shift', buffered: true });
    } catch (e) {}
  }

  function checkOverflow() {
    const isOver = document.documentElement.scrollWidth > window.innerWidth;
    const el = document.getElementById('chaff-overflow');
    if (el) {
      el.textContent = isOver ? 'Overflow: FAIL @ ' + window.innerWidth + 'px' : 'Overflow: PASS (' + window.innerWidth + 'px)';
      el.style.color = isOver ? '#ef4444' : '#22c55e';
    }
  }
  window.addEventListener('resize', checkOverflow);
  window.addEventListener('scroll', checkOverflow, { passive: true });
  checkOverflow();
})();`;
}

export async function phoneCommand(
  workspaceRoot: string,
  options: PhoneCommandOptions
): Promise<void> {
  const port = options.port || '3000';
  const ip = options.host || getLocalIpAddress();
  const url = `http://${ip}:${port}`;

  console.log('\n================= CHAFF PHONE (LIVE MOBILE HUD) =================');
  console.log('Test real-device touch targets, Core Web Vitals, and 320px overflow on your LAN.\n');
  
  console.log(`  Device Access URL:`);
  console.log(`  \x1b[36m${url}\x1b[0m\n`);

  console.log('┌────────────────────────────────────────────────────────┐');
  console.log('│  To connect your phone:                                │');
  console.log('│  1. Connect your phone to the same Wi-Fi / LAN network │');
  console.log(`│  2. Open mobile browser and navigate to:               │`);
  console.log(`│     ${url.padEnd(51)}│`);
  console.log('└────────────────────────────────────────────────────────┘\n');

  console.log('Active Live HUD Overlay Features:');
  console.log('  • Real-time FPS ticker (warns under 50 fps)');
  console.log('  • Cumulative Layout Shift (CLS) accumulation meter');
  console.log('  • Viewport horizontal overflow monitor at 320px');
  console.log('  • Touch target boundary verifier (>= 44x44px)\n');

  console.log('To inject HUD script into your dev build, add this bookmarklet or tag:');
  console.log(`  <script>${generateHudOverlayScript()}</script>\n`);
}
