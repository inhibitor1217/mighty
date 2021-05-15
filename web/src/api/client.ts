import { ApolloClient, InMemoryCache } from "@apollo/client";
import { RestLink } from "apollo-link-rest";

import { apiServerHost } from "const/env";

const restLink = new RestLink({ uri: apiServerHost() });

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: restLink,
});

export default client;
