import { z } from 'zod';

export const deleteclientByIdInputSchema = z.object({
  clientId: z.string(),
});
