import { z } from 'zod';

export const createclientInputSchema = z.object({
  client_type: z.string(),
  client_name: z.string(),
  scopes: z.string(),
  client_secret: z.string().optional(),
  description: z.string().optional(),
  is_active: z.boolean().optional(),
  grant_types: z.array(z.string()).optional(),
});
