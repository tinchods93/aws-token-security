import moment from 'moment-timezone';
import jwt from 'jsonwebtoken';
import { ClientType } from '../../entities/clientEntity/types/clientEntityTypes';
import { TokenServiceInterface } from './interfaces/tokenServiceInterfaces';

export default class TokenService implements TokenServiceInterface {
  createToken(client: ClientType): string {
    console.log(
      'MARTIN_LOG=> TokenService -> createToken -> client',
      JSON.stringify(client)
    );
    // TODO: IMPLEMENTAR CACHEO DE TOKENS
    // eslint-disable-next-line camelcase, @typescript-eslint/no-unused-vars
    const { client_secret, ...clientData } = client;

    console.log(
      'MARTIN_LOG=> TokenService -> createToken -> clientData',
      JSON.stringify(clientData)
    );

    const currentTime = moment().tz('America/Argentina/Buenos_Aires');

    const expirationInUTC3 = currentTime.clone().add(10, 'hours');

    const expiresIn = expirationInUTC3.diff(moment(), 'seconds');

    const token = jwt.sign(
      {
        client: {
          client_id: clientData.client_id,
          client_name: clientData.client_name,
          scopes: clientData.scopes,
          grant_types: clientData.grant_types,
        },
      },
      process.env.JWT_SECRET as string,
      {
        expiresIn: expiresIn,
      }
    );
    return token;
  }
}
