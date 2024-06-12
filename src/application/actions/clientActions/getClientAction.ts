import { StatusCodes } from 'http-status-codes';
import { inject, injectable } from 'tsyringe';
import { ApplicationActionInterface } from '../interfaces/applicationActionInterface';
import { HandlerCommandType } from '../../../infrastructure/primary/handlers/types/handlerTypes';
import ZodSchemaValidation from '../../schemas/ZodSchema';
import { ActionResponseInterface } from '../../entities/interfaces/actionResponseInterface';
import ActionResponse from '../../entities/actionResponse';
import {
  CLIENT_REPOSITORY_TOKEN,
  ClientRepositoryInterface,
} from '../../repositories/clientRepository/interfaces/clientRepositoryInterface';
import { getclientInputSchema } from '../../schemas/zodSchemas/clientActions/getClientInputSchema';

@injectable()
export default class GetClientAction implements ApplicationActionInterface {
  private actionResponse: ActionResponseInterface;

  constructor(
    @inject(CLIENT_REPOSITORY_TOKEN)
    private clientRepository: ClientRepositoryInterface
  ) {
    this.actionResponse = new ActionResponse();
  }

  public execute = async (commandPayload: HandlerCommandType) => {
    try {
      console.log(
        'MARTIN_LOG=> commandPayload.query',
        JSON.stringify(commandPayload.query)
      );

      const payload = new ZodSchemaValidation(getclientInputSchema).validate(
        commandPayload.query
      );

      if (
        (!payload.clientId && !payload.clientName) ||
        (payload.clientId && payload.clientName)
      ) {
        throw {
          status: StatusCodes.BAD_REQUEST,
          message: 'You must provide either clientId or clientName',
        };
      }

      console.log('MARTIN_LOG=> payload', JSON.stringify({ payload }));

      let response: any;

      if (payload.clientId) {
        response = await this.clientRepository.getClientById(payload);
      } else if (payload.clientName) {
        response = await this.clientRepository.getClientByName(payload);
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
