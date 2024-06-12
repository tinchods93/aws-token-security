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
import { updateclientByIdInputSchema } from '../../schemas/zodSchemas/clientActions/updateClientByIdInputSchema';

@injectable()
export default class UpdateClientAction implements ApplicationActionInterface {
  private actionResponse: ActionResponseInterface;

  constructor(
    @inject(CLIENT_REPOSITORY_TOKEN)
    private clientRepository: ClientRepositoryInterface
  ) {
    this.actionResponse = new ActionResponse();
  }

  public execute = async (commandPayload: HandlerCommandType) => {
    try {
      console.log('MARTIN_LOG=> action', JSON.stringify({ commandPayload }));
      const payload = new ZodSchemaValidation(
        updateclientByIdInputSchema
      ).validate({ ...commandPayload.parameters, ...commandPayload.body });

      const { clientId, ...rest } = payload;

      const response = await this.clientRepository.updateClientById(
        clientId,
        rest
      );

      return this.actionResponse.success({
        statusCode: StatusCodes.OK,
        data: { message: 'Client updated successfully', client: response },
      });
    } catch (error) {
      return this.actionResponse.error({
        statusCode: error.status ?? StatusCodes.INTERNAL_SERVER_ERROR,
        data: error,
      });
    }
  };
}
