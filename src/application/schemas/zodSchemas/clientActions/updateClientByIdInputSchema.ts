import { z } from 'zod';

export const updateclientByIdInputSchema = z.object({
  clientId: z.string(),
  client_type: z.string().optional(),
  client_name: z.string().optional(),
  scopes: z.string().optional(),
  client_secret: z.string().optional(),
  description: z.string().optional(),
  is_active: z.boolean().optional(),
  grant_types: z.array(z.string()).optional(),
  conditions: z
    .object({
      scopes: z.string().optional(),
    })
    .optional(),
});
