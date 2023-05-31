import { buildClientSchema, getIntrospectionQuery, parse, print } from 'graphql';
import { buildOperationNodeForField } from '@graphql-tools/utils';
import got from 'got';
import {default as axios} from "axios";
async function getSchemaFromUrl(url) {
    const response = await axios
        .post(url, { query: getIntrospectionQuery().toString() })
        .catch((e) => console.log(e));

    return buildClientSchema(response.data.data);
}
const main = async (schemaUrl) => {
    var _a, _b, _c, _d, _e, _f;
    const schema = await getSchemaFromUrl(schemaUrl);
    const operationsDictionary = {
        query: Object.assign({}, ((_b = (_a = schema.getQueryType()) === null || _a === void 0 ? void 0 : _a.getFields()) !== null && _b !== void 0 ? _b : {})),
        mutation: Object.assign({}, ((_d = (_c = schema.getMutationType()) === null || _c === void 0 ? void 0 : _c.getFields()) !== null && _d !== void 0 ? _d : {})),
        subscription: Object.assign({}, ((_f = (_e = schema.getSubscriptionType()) === null || _e === void 0 ? void 0 : _e.getFields()) !== null && _f !== void 0 ? _f : {})),
    };
    let documentString = ``;
    for (const [operationKind, operationValue] of Object.entries(operationsDictionary)) {
        for (const operationName of Object.keys(operationValue)) {
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
export default main;