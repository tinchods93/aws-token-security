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
import { deleteclientByIdInputSchema } from '../../schemas/zodSchemas/clientActions/deleteClientByIdInputSchema';

@injectable()
export default class DeleteClientAction implements ApplicationActionInterface {
  private actionResponse: ActionResponseInterface;

  constructor(
    @inject(CLIENT_REPOSITORY_TOKEN)
    private clientRepository: ClientRepositoryInterface
  ) {
    this.actionResponse = new ActionResponse();
  }

  public execute = async (commandPayload: HandlerCommandType) => {
    try {
      const payload = new ZodSchemaValidation(
        deleteclientByIdInputSchema
      ).validate(commandPayload.parameters);

      const response = await this.clientRepository.deleteClientById(payload);

      return this.actionResponse.success({
        statusCode: StatusCodes.OK,
        data: { message: 'Client deleted successfully', client: response },
      });
    } catch (error) {
      return this.actionResponse.error({
        statusCode: error.status ?? StatusCodes.INTERNAL_SERVER_ERROR,
        data: error,
      });
    }
  };
}
