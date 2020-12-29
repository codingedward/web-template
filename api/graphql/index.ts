import express from 'express';
import { GraphQLSchema } from 'graphql';
import { buildSchema } from 'type-graphql';
import { ApolloServer } from 'apollo-server-express';

import appConfig from '../config';
import resolvers from '../graphql/types';
import authChecker from '../modules/authentication/authGuard';

class GraphQL {
  static async initialize(app: express.Application): Promise<void> {
    const graphqlServer = await this.createServer();
    graphqlServer.applyMiddleware({
      app,
      path: appConfig.graphql.path,
    });
  }

  private static async createServer(): Promise<ApolloServer> {
    const schema = await this.buildSchema();
    return new ApolloServer({
      schema,
      context: ({ req }) => req,
      tracing: appConfig.graphql.enableTracing,
      introspection: appConfig.graphql.enableIntrospection,
      playground: { endpoint: appConfig.graphql.path },
    });
  }

  private static async buildSchema(): Promise<GraphQLSchema> {
    return buildSchema({
      resolvers,
      authChecker,
      validate: false,
    });
  }
}

export default GraphQL;
