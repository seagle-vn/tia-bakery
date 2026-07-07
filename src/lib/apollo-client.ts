import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';

export const GRAPHQL_ENDPOINT =
  'https://api-ca-central-1.hygraph.com/v2/cljabf7co288y01t24ejkdc80/master';

export function createApolloClient() {
  return new ApolloClient({
    cache: new InMemoryCache({
      dataIdFromObject(responseObject) {
        // Don't normalize objects that look like Cloudinary assets
        if (responseObject.__typename === 'Asset' ||
            (responseObject.public_id && responseObject.url)) {
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
    link: new HttpLink({
      uri: GRAPHQL_ENDPOINT,
      fetchOptions: { cache: 'no-store' },
    }),
  });
}
