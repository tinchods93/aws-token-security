import { z } from 'zod';

export const updateScopeByIdInputSchema = z.object({
  scopeId: z.string(),
  scope_type: z.string().optional(),
  api_name: z.string().optional(),
  endpoints: z.array(z.string()).optional(),
  description: z.string().optional(),
  is_active: z.boolean().optional(),
  conditions: z
    .object({
      endpoints: z.string().optional(),
    })
    .optional(),
});
