import { z } from 'zod';

export const createTokenInputSchema = z.object({
  client_id: z.string(),
  client_secret: z.string(),
});
