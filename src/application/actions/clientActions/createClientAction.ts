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
import { createclientInputSchema } from '../../schemas/zodSchemas/clientActions/createClientInputSchema';

@injectable()
export default class CreateClientAction implements ApplicationActionInterface {
  private actionResponse: ActionResponseInterface;

  constructor(
    @inject(CLIENT_REPOSITORY_TOKEN)
    private clientRepository: ClientRepositoryInterface
  ) {
    this.actionResponse = new ActionResponse();
  }

  public execute = async (commandPayload: HandlerCommandType) => {
    try {
      const payload = new ZodSchemaValidation(createclientInputSchema).validate(
        commandPayload.body
      );

      const response = await this.clientRepository.createClient(payload);

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
