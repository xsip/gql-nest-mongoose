"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config = {
    overwrite: true,
    schema: 'http://localhost:3000/graphql',
    documents: {
        'http://localhost:3000/graphql': {
            loader: require('./gen.js'),
        },
    },
    generates: {
        './sdk/graphql.ts': {
            plugins: ['typescript-apollo-angular'],
        },
    },
};
exports.default = config;
//# sourceMappingURL=codegen.js.map