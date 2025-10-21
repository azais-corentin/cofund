import { WS_PORT } from '$env/static/private';
import { PUBLIC_WS_URL } from '$env/static/public';
import { configure, getConsoleSink, getLogger } from '@logtape/logtape';
import { getPrettyFormatter } from '@logtape/pretty';
import type { Handle, ServerInit } from '@sveltejs/kit';
import { AsyncLocalStorage } from 'node:async_hooks';
import { createWsServer } from 'tinybase/synchronizers/synchronizer-ws-server';
import { WebSocketServer } from 'ws';
import { createPersisterForPath, destroyServerPersister, initializeServerPersister } from '$lib/db/db.server.js';

await configure({
  sinks: {
    console: getConsoleSink({
      formatter: getPrettyFormatter({ timestamp: 'rfc3339', icons: false, level: 'full' }),
    }),
  },
  loggers: [{ category: ['logtape', 'meta'], sinks: ['console'], lowestLevel: 'warning' }, {
    category: [],
    sinks: ['console'],
    lowestLevel: import.meta.env.NODE_ENV === 'development' ? 'debug' : 'info',
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

const wsLogger = getLogger(['cofund', 'ws']);
const dbLogger = getLogger(['cofund', 'db']);

export const init: ServerInit = async () => {
  dbLogger.info('Initializing PostgreSQL persister...');
  await initializeServerPersister();
  dbLogger.info('PostgreSQL persister initialized');

  wsLogger.info('Starting WebSocket synchronization server...');

  const wss = new WebSocketServer({ port: parseInt(WS_PORT), host: '0.0.0.0' });

  wss.on('close', () => {
    wsLogger.info('WebSocket server closed');
  });

  const server = createWsServer(wss, createPersisterForPath);

  wsLogger.info(`Websocket synchronization server started at ${PUBLIC_WS_URL}`);

  process.on('sveltekit:shutdown', async () => {
    await server.destroy();
    wsLogger.info('WebSocket server shut down');
    await destroyServerPersister();
    dbLogger.info('PostgreSQL persister destroyed');
  });
};
