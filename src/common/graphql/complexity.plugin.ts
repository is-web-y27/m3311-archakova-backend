import { ApolloServerPlugin } from '@apollo/server';
import { GraphQLError } from 'graphql';
import { fieldExtensionsEstimator, getComplexity, simpleEstimator } from 'graphql-query-complexity';

const MAX_COMPLEXITY = 100;

export const complexityPlugin = (): ApolloServerPlugin => ({
  async requestDidStart() {
    return {
      async didResolveOperation({request, document, schema}) {
        const complexity = getComplexity({schema, operationName: request.operationName, query: document, variables: request.variables, estimators: [fieldExtensionsEstimator(), simpleEstimator({defaultComplexity: 1})]});

        if (complexity > MAX_COMPLEXITY) {
          throw new GraphQLError(`Сложность запроса ${complexity} превышает максимальное значение ${MAX_COMPLEXITY}`, {extensions: {code: 'QUERY_TOO_COMPLEX', http: {status: 400}}});
        }
      },
    };
  },
});
