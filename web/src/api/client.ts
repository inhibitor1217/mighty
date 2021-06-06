import { ApolloClient, ApolloLink, InMemoryCache } from "@apollo/client";
import { EnumApolloLink, EnumValueFormat } from "apollo-link-enums";
import { RestLink } from "apollo-link-rest";
import { ScalarApolloLink } from "apollo-link-scalars";
import { buildClientSchema } from "graphql";
import type { IntrospectionQuery } from "graphql";
import { DateTimeResolver } from "graphql-scalars";

import introspection from "__generated__/graphql/introspection.json";
import { apiServerHost } from "const/env";
import { __UNSAFE__cast } from "util/cast";

const schema = buildClientSchema(__UNSAFE__cast<IntrospectionQuery>(introspection));

const link = ApolloLink.from([
  new ScalarApolloLink({
    schema,
    typesMap: {
      DateTime: DateTimeResolver,
    },
    validateEnums: true,
  }),
  new EnumApolloLink({
    schema,
    valueFormat: {
      client: EnumValueFormat.ScreamingSnakeCase,
      server: EnumValueFormat.KebabCase,
    },
  }),
  new RestLink({ uri: apiServerHost() }),
]);

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link,
});

export default client;
