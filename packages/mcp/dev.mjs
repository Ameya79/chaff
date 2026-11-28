import { createServer } from 'node:http';
import { Readable } from 'node:stream';
import handler from './dist/http.js';

const server = createServer(async (incoming, outgoing) => {
  try {
    const method = incoming.method || 'GET';
    const request = new Request('http://localhost' + incoming.url, {
      method,
      headers: incoming.headers,
      ...(method === 'GET' || method === 'HEAD' ? {} : { body: Readable.toWeb(incoming), duplex: 'half' }),
    });
    const response = await handler.fetch(request);
    outgoing.writeHead(response.status, Object.fromEntries(response.headers));
    outgoing.end(Buffer.from(await response.arrayBuffer()));
  } catch {
    outgoing.writeHead(500).end();
  }
});

server.listen(Number(process.env.PORT || process.env.VERCEL_DEV_PORT || 3001), '127.0.0.1');
