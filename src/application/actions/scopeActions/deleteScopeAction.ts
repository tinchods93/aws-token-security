import { StatusCodes } from 'http-status-codes';
import { inject, injectable } from 'tsyringe';
import { ApplicationActionInterface } from '../interfaces/applicationActionInterface';
import { HandlerCommandType } from '../../../infrastructure/primary/handlers/types/handlerTypes';
import ZodSchemaValidation from '../../schemas/ZodSchema';
import { ActionResponseInterface } from '../../entities/interfaces/actionResponseInterface';
import ActionResponse from '../../entities/actionResponse';
import {
  SCOPE_REPOSITORY_TOKEN,
  ScopeRepositoryInterface,
} from '../../repositories/scopeRepository/interfaces/scopeRepositoryInterface';
import { deleteScopeByIdInputSchema } from '../../schemas/zodSchemas/scopeActions/deleteScopeByIdInputSchema';

@injectable()
export default class DeleteScopeAction implements ApplicationActionInterface {
  private actionResponse: ActionResponseInterface;

  constructor(
    @inject(SCOPE_REPOSITORY_TOKEN)
    private scopeRepository: ScopeRepositoryInterface
  ) {
    this.actionResponse = new ActionResponse();
  }

  public execute = async (commandPayload: HandlerCommandType) => {
    try {
      const payload = new ZodSchemaValidation(
        deleteScopeByIdInputSchema
      ).validate(commandPayload.parameters);

      const response = await this.scopeRepository.deleteScopeById(payload);

      return this.actionResponse.success({
        statusCode: StatusCodes.OK,
        data: { message: 'Scope deleted successfully', scope: response },
      });
    } catch (error) {
      return this.actionResponse.error({
        statusCode: error.status ?? StatusCodes.INTERNAL_SERVER_ERROR,
        data: error,
      });
    }
  };
}
