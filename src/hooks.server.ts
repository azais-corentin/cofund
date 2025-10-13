import { configure, getConsoleSink } from '@logtape/logtape';
import { getPrettyFormatter } from '@logtape/pretty';
import type { Handle } from '@sveltejs/kit';
import { AsyncLocalStorage } from 'node:async_hooks';

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
