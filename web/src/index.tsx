import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import App from "./component/App";
import store from "./redux";
import { GlobalStyle } from "./styles/global";

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <GlobalStyle />
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);
