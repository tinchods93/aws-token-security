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
import { getScopeInputSchema } from '../../schemas/zodSchemas/scopeActions/getScopeInputSchema';

@injectable()
export default class GetScopeAction implements ApplicationActionInterface {
  private actionResponse: ActionResponseInterface;

  constructor(
    @inject(SCOPE_REPOSITORY_TOKEN)
    private scopeRepository: ScopeRepositoryInterface
  ) {
    this.actionResponse = new ActionResponse();
  }

  public execute = async (commandPayload: HandlerCommandType) => {
    try {
      console.log(
        'MARTIN_LOG=> commandPayload.query',
        JSON.stringify(commandPayload.query)
      );

      const payload = new ZodSchemaValidation(getScopeInputSchema).validate(
        commandPayload.query
      );

      if (
        (!payload.scopeId && !payload.apiName) ||
        (payload.scopeId && payload.apiName)
      ) {
        throw {
          status: StatusCodes.BAD_REQUEST,
          message: 'You must provide either scopeId or apiName',
        };
      }

      console.log('MARTIN_LOG=> payload', JSON.stringify({ payload }));

      let response: any;

      if (payload.scopeId) {
        response = await this.scopeRepository.getScopeById(payload);
      } else if (payload.apiName) {
        response = await this.scopeRepository.getScopeByApiName(payload);
      }

      return this.actionResponse.success({
        statusCode: StatusCodes.OK,
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
