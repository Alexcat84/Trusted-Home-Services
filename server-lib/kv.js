import { Redis } from '@upstash/redis';

/** @vercel/kv is deprecated; this is the Upstash Redis client it used to wrap.
 * Reads KV_REST_API_URL / KV_REST_API_TOKEN (set by the Upstash marketplace integration). */
export const kv = Redis.fromEnv();
