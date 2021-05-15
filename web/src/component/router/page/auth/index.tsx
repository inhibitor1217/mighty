import { lazy } from "react";
import { Route, Switch } from "react-router";
import type { RouteComponentProps } from "react-router";

import { SIGN_IN_PATH } from "const/path";

const SignInPage = lazy(() => import("./SignInPage"));

const AuthPage = ({ match: { path } }: RouteComponentProps) => {
  return (
    <Switch>
      <Route path={`${path}${SIGN_IN_PATH}`} component={SignInPage} />
    </Switch>
  );
};

export default AuthPage;
