import { createEnv } from '@t3-oss/env-core';
import { z } from 'zod';

export const env = createEnv({
  server: {
    OPENAI_API_KEY: z.string().nonempty(),
    SERP_API_KEY: z.string().nonempty(),
    UPSTASH_REDIS_REST_URL: z.string().nonempty(),
    UPSTASH_REDIS_REST_TOKEN: z.string().nonempty(),
  },
  runtimeEnv: {
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    SERP_API_KEY: process.env.SERP_API_KEY,
    UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL,
    UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN,
  },
});
