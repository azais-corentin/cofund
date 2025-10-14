import { configure, getConsoleSink, getLogger } from '@logtape/logtape';
import { getPrettyFormatter } from '@logtape/pretty';
import type { Handle, ServerInit } from '@sveltejs/kit';
import { AsyncLocalStorage } from 'node:async_hooks';
import { createWsServer } from 'tinybase/synchronizers/synchronizer-ws-server';
import { WebSocketServer } from 'ws';

await configure({
  sinks: {
    console: getConsoleSink({
      formatter: getPrettyFormatter({ timestamp: 'rfc3339', icons: false, level: 'full' }),
    }),
  },
  loggers: [{ category: ['logtape', 'meta'], sinks: ['console'], lowestLevel: 'warning' }, {
    category: [],
    sinks: ['console'],
    lowestLevel: process.env.NODE_ENV === 'development' ? 'debug' : 'info',
  }],
  reset: true,
  contextLocalStorage: new AsyncLocalStorage(),
});

export const handle: Handle = async ({ event, resolve }) => {
  let userid = event.cookies.get('userid');

  if (!userid) {
    // if this is the first time the user has visited this app,
    // set a cookie so that we recognise them when they return
    userid = crypto.randomUUID();
    event.cookies.set('userid', userid, { path: '/' });
  }

  event.locals.userid = userid;

  return resolve(event);
};

const wsLogger = getLogger(['logtape', 'ws']);

export const init: ServerInit = async () => {
  wsLogger.info('Starting WebSocket synchronization server...');

  // Get port from environment or use default
  const WS_PORT = process.env.WS_PORT ? parseInt(process.env.WS_PORT) : 8043;

  // Create WebSocket server
  const wss = new WebSocketServer({ port: WS_PORT });

  wss.on('close', () => {
    wsLogger.info('WebSocket server closed');
  });

  // Create TinyBase WebSocket synchronization server
  const server = createWsServer(wss);

  wsLogger.info(`Websocket synchronization server started at ws://localhost:${WS_PORT}`);

  process.on('sveltekit:shutdown', async () => {
    await server.destroy();
    wsLogger.info('WebSocket server shut down');
  });
};
