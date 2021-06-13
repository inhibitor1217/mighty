import { lazy, Suspense, useMemo } from "react";
import { Redirect, Route, Switch } from "react-router";

import { AUTH_PATH, NOT_FOUND_PATH, ROOT_PATH } from "const/path";
import ContentSpinner from "component/common/ContentSpinner";
import ErrorBoundary from "component/common/ErrorBoundary";
import ScrollView from "component/layout/ScrollView";

import NotFoundPage from "./page/NotFoundPage";

const RootPage = lazy(() => import("./page/RootPage"));
const AuthPage = lazy(() => import("./page/auth"));

const ContentRouter = () => {
  const fallbackElement = useMemo(
    () => (
      <ScrollView center>
        <ContentSpinner />
      </ScrollView>
    ),
    []
  );

  return (
    <Suspense fallback={fallbackElement}>
      <ErrorBoundary>
        <Switch>
          <Route exact path={ROOT_PATH} component={RootPage} />
          <Route path={AUTH_PATH} component={AuthPage} />
          <Route path={NOT_FOUND_PATH} component={NotFoundPage} />
          <Redirect to={NOT_FOUND_PATH} />
        </Switch>
      </ErrorBoundary>
    </Suspense>
  );
};

export default ContentRouter;
