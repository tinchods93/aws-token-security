import { z } from 'zod';

export const createScopeInputSchema = z.object({
  scope_type: z.string(),
  api_name: z.string(),
  endpoints: z.array(z.string()),
  description: z.string().optional(),
  is_active: z.boolean().optional(),
});
