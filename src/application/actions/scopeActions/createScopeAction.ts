import { StatusCodes } from 'http-status-codes';
import { inject, injectable } from 'tsyringe';
import { ApplicationActionInterface } from '../interfaces/applicationActionInterface';
import { HandlerCommandType } from '../../../infrastructure/primary/handlers/types/handlerTypes';
import { createScopeInputSchema } from '../../schemas/zodSchemas/scopeActions/createScopeInputSchema';
import ZodSchemaValidation from '../../schemas/ZodSchema';
import { ActionResponseInterface } from '../../entities/interfaces/actionResponseInterface';
import ActionResponse from '../../entities/actionResponse';
import {
  SCOPE_REPOSITORY_TOKEN,
  ScopeRepositoryInterface,
} from '../../repositories/scopeRepository/interfaces/scopeRepositoryInterface';

@injectable()
export default class CreateScopeAction implements ApplicationActionInterface {
  private actionResponse: ActionResponseInterface;

  constructor(
    @inject(SCOPE_REPOSITORY_TOKEN)
    private scopeRepository: ScopeRepositoryInterface
  ) {
    this.actionResponse = new ActionResponse();
  }

  public execute = async (commandPayload: HandlerCommandType) => {
    try {
      const payload = new ZodSchemaValidation(createScopeInputSchema).validate(
        commandPayload.body
      );

      const response = await this.scopeRepository.createScope(payload);

      return this.actionResponse.success({
        statusCode: StatusCodes.CREATED,
        data: response,
      });
    } catch (error) {
      return this.actionResponse.error({
        statusCode: error.status ?? StatusCodes.INTERNAL_SERVER_ERROR,
        data: error,
      });
    }
  };
}
