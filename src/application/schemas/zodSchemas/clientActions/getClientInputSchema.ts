import { z } from 'zod';

export const getclientInputSchema = z.object({
  clientId: z.string().optional(),
  clientName: z.string().optional(),
});
