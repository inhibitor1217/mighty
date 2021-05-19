import { lazy } from "react";
import { Redirect, Route, Switch } from "react-router";
import type { RouteComponentProps } from "react-router";

import { GOOGLE_OAUTH_REDIRECT_PATH, NOT_FOUND_PATH, SIGN_IN_PATH } from "const/path";

const SignInPage = lazy(() => import("./SignInPage"));
const GoogleOAuthRedirectPage = lazy(() => import("./GoogleOAuthRedirectPage"));

const AuthPage = ({ match: { path } }: RouteComponentProps) => {
  return (
    <Switch>
      <Route path={`${path}${SIGN_IN_PATH}`} component={SignInPage} />
      <Route path={`${path}${GOOGLE_OAUTH_REDIRECT_PATH}`} component={GoogleOAuthRedirectPage} />
      <Redirect to={NOT_FOUND_PATH} />
    </Switch>
  );
};

export default AuthPage;
