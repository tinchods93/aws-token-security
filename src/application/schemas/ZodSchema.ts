import { ZodIssue, ZodObject, ZodType } from 'zod';
import { SchemaInterface } from './interfaces/schemaInterface';
import SchemaValidationException from '../errors/SchemaValidationException';

export default class ZodSchemaValidation implements SchemaInterface {
  private schema: ZodObject<any> | ZodType;

  constructor(schema: ZodObject<any> | ZodType) {
    this.schema = schema;
  }

  validate(payload: any): any {
    try {
      console.log(
        'MARTIN_LOG=> ZodSchemaValidation -> validate -> payload',
        JSON.stringify(payload)
      );
      return this.schema.parse(payload);
    } catch (error) {
      console.log(
        'MARTIN_LOG=> ZodSchemaValidation -> validate -> error',
        JSON.stringify(error)
      );
      const finalMessage = error.issues?.map(
        (issue: ZodIssue) => `${issue.message} -> ${issue.path.join('.')}`
      );

      throw SchemaValidationException.handle({ message: finalMessage });
    }
  }
}
