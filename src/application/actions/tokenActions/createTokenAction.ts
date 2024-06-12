import { StatusCodes } from 'http-status-codes';
import { inject, injectable } from 'tsyringe';
import { ApplicationActionInterface } from '../interfaces/applicationActionInterface';
import { HandlerCommandType } from '../../../infrastructure/primary/handlers/types/handlerTypes';
import ZodSchemaValidation from '../../schemas/ZodSchema';
import { ActionResponseInterface } from '../../entities/interfaces/actionResponseInterface';
import ActionResponse from '../../entities/actionResponse';
import {
  TOKEN_REPOSITORY_TOKEN,
  TokenRepositoryInterface,
} from '../../repositories/tokenRepository/interfaces/tokenRepositoryInterface';
import { createTokenInputSchema } from '../../schemas/zodSchemas/tokenActions/createTokenInputSchema';

@injectable()
export default class CreateTokenAction implements ApplicationActionInterface {
  private actionResponse: ActionResponseInterface;

  constructor(
    @inject(TOKEN_REPOSITORY_TOKEN)
    private tokenRepository: TokenRepositoryInterface
  ) {
    this.actionResponse = new ActionResponse();
  }

  public execute = async (commandPayload: HandlerCommandType) => {
    try {
      console.log('MARTIN_LOG=> action', JSON.stringify({ commandPayload }));
      const payload = new ZodSchemaValidation(createTokenInputSchema).validate(
        commandPayload.body
      );

      const response = await this.tokenRepository.createToken(payload);

      return this.actionResponse.success({
        statusCode: StatusCodes.OK,
        data: { access_token: response },
      });
    } catch (error) {
      return this.actionResponse.error({
        statusCode: error.status ?? StatusCodes.INTERNAL_SERVER_ERROR,
        data: error,
      });
    }
  };
}
