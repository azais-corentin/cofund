import { configure, getConsoleSink } from '@logtape/logtape';
import { getPrettyFormatter } from '@logtape/pretty';
import { AsyncLocalStorage } from 'node:async_hooks';

await configure({
  sinks: {
    console: getConsoleSink({
      formatter: getPrettyFormatter({
        timestamp: 'rfc3339',
        icons: false,
        level: 'full',
      }),
    }),
  },
  loggers: [
    {
      category: ['logtape', 'meta'],
      sinks: ['console'],
      lowestLevel: 'warning',
    },
    {
      category: [],
      sinks: ['console'],
      lowestLevel: process.env.NODE_ENV === 'development' ? 'debug' : 'info',
    },
  ],
  reset: true,
  contextLocalStorage: new AsyncLocalStorage(),
});
