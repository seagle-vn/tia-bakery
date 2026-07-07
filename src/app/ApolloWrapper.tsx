'use client';
import {
  ApolloLink,
  HttpLink,
} from '@apollo/client';
import {
  ApolloClient,
  ApolloNextAppProvider,
  InMemoryCache,
} from '@apollo/client-integration-nextjs';
import { SSRMultipartLink } from '@apollo/client-react-streaming';
import React from 'react';

import { GRAPHQL_ENDPOINT } from '@/lib/apollo-client';
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
    >
      {children}
    </ApolloNextAppProvider>
  );

  function makeClient() {
    const httpLink = new HttpLink({
      uri: GRAPHQL_ENDPOINT,
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
      cache: new InMemoryCache({
        dataIdFromObject(responseObject) {
          // Don't normalize objects that look like Cloudinary assets
          if (responseObject.__typename === 'Asset' ||
              (responseObject.public_id && responseObject.url)) {
            return undefined;
          }
          // Don't normalize RichText objects (keep them embedded in their parent)
          if (responseObject.__typename === 'RichText') {
            return undefined;
          }
          // Use default normalization for everything else
          return `${responseObject.__typename}:${responseObject.id}`;
        },
        typePolicies: {
          Product: {
            fields: {
              image: {
                read(existing) {
                  return existing;
                },
              },
            },
          },
          Page: {
            fields: {
              heroBackground: {
                read(existing) {
                  return existing;
                },
              },
              descriptionImage: {
                read(existing) {
                  return existing;
                },
              },
            },
          },
        },
      }),
      link,
    });
  }
}
