import { ApolloClient, ApolloLink, InMemoryCache } from "@apollo/client";
import { RestLink } from "apollo-link-rest";
import { withScalars } from "apollo-link-scalars";
import { buildClientSchema } from "graphql";
import type { IntrospectionQuery } from "graphql";
import { DateTimeResolver } from "graphql-scalars";

import { apiServerHost } from "const/env";
import { __UNSAFE__cast } from "util/cast";

import introspection from "./graphql/introspection.json";

const schema = buildClientSchema(__UNSAFE__cast<IntrospectionQuery>(introspection));

const link = ApolloLink.from([
  withScalars({
    schema,
    typesMap: { DateTime: DateTimeResolver },
  }),
  new RestLink({ uri: apiServerHost() }),
]);

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link,
});

export default client;
