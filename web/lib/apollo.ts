import { useMemo } from 'react';
import {
  ApolloClient,
  HttpLink,
  InMemoryCache,
  NormalizedCacheObject,
} from '@apollo/client';
import { concatPagination } from '@apollo/client/utilities';

import appConfig from '../config';

const isServer: boolean = typeof window === 'undefined';

type ApolloClientType = ApolloClient<NormalizedCacheObject>;
let apolloClient: ApolloClientType;

function createApolloClient(): ApolloClientType {
  return new ApolloClient({
    ssrMode: isServer,
    link: new HttpLink({
      uri: appConfig.graphql.uri,
      credentials: appConfig.graphql.credentials,
    }),
    cache: new InMemoryCache({
      typePolicies: {
        Query: {
          fields: {
            allPosts: concatPagination(),
          },
        },
      },
    }),
  });
}

export function initializeApollo(initialState = null): ApolloClientType {
  const _apolloClient = apolloClient ?? createApolloClient();

  if (initialState) {
    const existingCache = _apolloClient.extract();
    _apolloClient.cache.restore({ ...existingCache, ...initialState });
  }

  if (isServer) {
    return _apolloClient;
  }

  if (!apolloClient) {
    apolloClient = _apolloClient;
  }

  return _apolloClient;
}

export function useApollo(initialState = null): ApolloClientType {
  const store = useMemo<ApolloClientType>(
    () => initializeApollo(initialState),
    [initialState]
  );
  return store;
}
