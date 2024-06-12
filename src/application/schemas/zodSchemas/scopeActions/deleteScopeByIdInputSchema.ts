import { z } from 'zod';

export const deleteScopeByIdInputSchema = z.object({
  scopeId: z.string(),
});
