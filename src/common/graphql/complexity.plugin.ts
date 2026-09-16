import { ApolloServerPlugin } from '@apollo/server';
import { DocumentNode, getOperationAST, GraphQLError, Kind } from 'graphql';
import { fieldExtensionsEstimator, getComplexity, simpleEstimator } from 'graphql-query-complexity';

const MAX_COMPLEXITY = 100;

function isIntrospectionOperation(document: DocumentNode, operationName?: string | null): boolean{
  const operation = getOperationAST(document, operationName ?? undefined);

  if (!operation){
    return false;
  }
  return operation.selectionSet.selections.some(selection => selection.kind === Kind.FIELD && (selection.name.value === '__schema' || selection.name.value == '__type'));
}

export const complexityPlugin = (): ApolloServerPlugin => ({
  async requestDidStart() {
    return {
      async didResolveOperation({request, document, schema}) {
        if (isIntrospectionOperation(document, request.operationName)){
          return;
        }
        const complexity = getComplexity({schema, operationName: request.operationName, query: document, variables: request.variables, estimators: [fieldExtensionsEstimator(), simpleEstimator({defaultComplexity: 1})]});

        if (complexity > MAX_COMPLEXITY) {
          throw new GraphQLError(`Сложность запроса ${complexity} превышает максимальное значение ${MAX_COMPLEXITY}`, {extensions: {code: 'QUERY_TOO_COMPLEX', http: {status: 400}}});
        }
      },
    };
  },
});
