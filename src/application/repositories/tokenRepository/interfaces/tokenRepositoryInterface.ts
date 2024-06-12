export const TOKEN_REPOSITORY_TOKEN = Symbol('TokenRepositoryInterface');

export interface TokenRepositoryInterface {
  createToken(params: {
    client_id: string;
    client_secret: string;
  }): Promise<string>;
}
