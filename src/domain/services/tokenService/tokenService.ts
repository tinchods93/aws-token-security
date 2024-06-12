import jwt from 'jsonwebtoken';
import { ClientType } from '../../entities/clientEntity/types/clientEntityTypes';

export default class TokenService {
  static createToken(client: ClientType) {
    // eslint-disable-next-line camelcase, @typescript-eslint/no-unused-vars
    const { client_secret, ...clientData } = client;
    const token = jwt.sign(
      { client: clientData },
      process.env.JWT_SECRET as string,
      {
        expiresIn: process.env.JWT_EXPIRATION_TIME as string,
      }
    );
    return token;
  }
}
