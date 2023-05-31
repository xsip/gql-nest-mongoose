const {
  getIntrospectionQuery,
  parse,
  buildClientSchema,
  print,
} = require('graphql');
const { buildOperationNodeForField } = require('@graphql-tools/utils');
const axios = require('axios').default;

async function getSchemaFromUrl(url) {
  const response = await axios
    .post(url, { query: getIntrospectionQuery().toString() })
    .catch((e) => console.log(e));

  return buildClientSchema(response.data.data);
}

module.exports = async function (schemaUrl) {
  const schema = await getSchemaFromUrl(schemaUrl);
  const operationsDictionary = {
    query: { ...(schema.getQueryType()?.getFields() || {}) },
    mutation: { ...(schema.getMutationType()?.getFields() || {}) },
    subscription: { ...(schema.getSubscriptionType()?.getFields() || {}) },
  };

  let documentString = '';
  for (const operationKind in operationsDictionary) {
    for (const operationName in operationsDictionary[operationKind]) {
      const operationAST = buildOperationNodeForField({
        schema,
        kind: operationKind,
        field: operationName,
      });

      documentString += print(operationAST);
    }
  }

  return parse(documentString);
};
