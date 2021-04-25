import {
  quicktype,
  InputData,
  JSONSchemaInput,
  JSONSchemaStore,
  jsonInputForTargetLanguage
} from 'quicktype-core';

/**
 * @description Create Quicktype-converted file from JSON schema string.
 * @see https://blog.dennisokeeffe.com/blog/2020-09-20-generating-types-with-quicktype/
 */
export async function convertToQuicktype(schema: string) {
  const targetLanguage = 'typescript';
  const name = 'Contract'; // Short-use, ugly type name
  const inputData = new InputData();

  // JSON schema ("OpenAPI")
  if (JSON.parse(schema).hasOwnProperty('properties')) {
    const schemaInput = await generateJsonSchemaInput(name, schema);
    inputData.addInput(schemaInput);
  }
  // Basic JSON object
  else {
    const jsonInput = await generateJsonInput(targetLanguage, name, schema);
    inputData.addInput(jsonInput);
  }

  return await quicktype({
    inputData,
    lang: targetLanguage
  });
}

const generateJsonSchemaInput = async (name: string, schema: any) => {
  // @ts-ignore
  const schemaInput = new JSONSchemaInput(new JSONSchemaStore());
  await schemaInput.addSource({ name, schema });
  return schemaInput;
};

const generateJsonInput = async (targetLanguage: string, name: string, schema: any) => {
  const jsonInput = jsonInputForTargetLanguage(targetLanguage);
  await jsonInput.addSource({
    name,
    samples: [schema]
  });
  return jsonInput;
};
