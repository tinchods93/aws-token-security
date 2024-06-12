import { z } from 'zod';

export const getScopeInputSchema = z.object({
  scopeId: z.string().optional(),
  apiName: z.string().optional(),
});
