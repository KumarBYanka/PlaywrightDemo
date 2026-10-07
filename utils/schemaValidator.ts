import Ajv from 'ajv';
import addFormats from 'ajv-formats';

const ajv = new Ajv({ allErrors: true });
addFormats(ajv);

export class SchemaValidator {

  /**
   * Validates data against a JSON schema.
   * Returns a readable list of violations; empty when valid.
   */
  static validate(schema: object, data: unknown): string[] {
    const validate = ajv.compile(schema);

    if (validate(data)) {
      return [];
    }

    return (validate.errors ?? []).map(
      error => `${error.instancePath || '(root)'} ${error.message}`
    );
  }
}
