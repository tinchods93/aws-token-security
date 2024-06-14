import { z } from 'zod';
import { HttpMethodsEnum } from '../../../../commons/enums/httpMethodsEnum';

export const validateScopeInputSchema = z.object({
  scopesList: z.string(),
  endpoint: z.string(),
  endpointMethod: z.nativeEnum(HttpMethodsEnum),
});
