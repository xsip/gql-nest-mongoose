import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: 'http://localhost:3000/graphql',
  documents: {
    'http://localhost:3000/graphql': {
      loader: require('./generator-pipe.js'),
    },
  },
  generates: {
    '../v2-16/src/sdk/gql.ts': {
      plugins: [
        'typescript-apollo-angular',
        'typescript',
        'typescript-operations',
      ],
    },
  },
};
export default config;
