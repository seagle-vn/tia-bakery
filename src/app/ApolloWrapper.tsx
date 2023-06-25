'use client';
import {
  ApolloClient,
  ApolloLink,
  HttpLink,
  SuspenseCache,
} from '@apollo/client';
import {
  ApolloNextAppProvider,
  NextSSRInMemoryCache,
  SSRMultipartLink,
} from '@apollo/experimental-nextjs-app-support/ssr';
import React from 'react';

import { loadDevMessages, loadErrorMessages } from '@apollo/client/dev';
import { setVerbosity } from 'ts-invariant';

if (process.env.NODE_ENV === 'development') {
  setVerbosity('debug');
  loadDevMessages();
  loadErrorMessages();
}

export function ApolloWrapper({
  children,
  delay: delayProp,
}: React.PropsWithChildren<{
  delay: number;
}>) {
  return (
    <ApolloNextAppProvider
      makeClient={makeClient}
      makeSuspenseCache={makeSuspenseCache}
    >
      {children}
    </ApolloNextAppProvider>
  );

  function makeClient() {
    const httpLink = new HttpLink({
      uri: 'https://api-ca-central-1.hygraph.com/v2/cljabf7co288y01t24ejkdc80/master',
      fetchOptions: { cache: 'no-store' },
    });

    const delayLink = new ApolloLink((operation, forward) => {
      const delay = typeof window === 'undefined' ? delayProp : delayProp;
      operation.setContext(({ headers = {} }) => {
        return {
          headers: {
            ...headers,
            'x-custom-delay': delay,
          },
        };
      });

      return forward(operation);
    });
    const link =
      typeof window === 'undefined'
        ? ApolloLink.from([
            new SSRMultipartLink({
              stripDefer: false,
              cutoffDelay: 100,
            }),
            delayLink,
            httpLink,
          ])
        : ApolloLink.from([delayLink, httpLink]);

    return new ApolloClient({
      cache: new NextSSRInMemoryCache(),
      link,
    });
  }

  function makeSuspenseCache() {
    return new SuspenseCache();
  }
}
