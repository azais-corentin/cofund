import { createWsServer } from 'tinybase/synchronizers/synchronizer-ws-server';
import { WebSocketServer } from 'ws';

// Get port from environment or use default
const WS_PORT = process.env.WS_PORT ? parseInt(process.env.WS_PORT) : 8043;

// Create WebSocket server
const wss = new WebSocketServer({ port: WS_PORT });

// Create TinyBase WebSocket synchronization server
const server = createWsServer(wss);

console.log(`✓ WebSocket synchronization server started on port ${WS_PORT}`);
console.log(`  Clients can connect to: ws://localhost:${WS_PORT}`);

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n✓ Shutting down WebSocket server...');
  await server.destroy();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n✓ Shutting down WebSocket server...');
  await server.destroy();
  process.exit(0);
});
