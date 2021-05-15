import React from "react";
import ReactDOM from "react-dom";
import { ApolloProvider } from "@apollo/client";

import client from "api/client";
import App from "component/App";
import { GlobalStyle } from "styles/global";

ReactDOM.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <GlobalStyle />
      <App />
    </ApolloProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
