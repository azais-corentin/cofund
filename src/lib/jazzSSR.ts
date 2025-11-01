import { PUBLIC_WS_URL } from '$env/static/public';
import { createSSRJazzAgent } from 'jazz-tools/ssr';

export const jazzSSR = createSSRJazzAgent({
  peer: PUBLIC_WS_URL,
});
