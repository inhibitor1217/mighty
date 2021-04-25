import { lazy, Suspense, useMemo } from "react";
import { Route, Switch } from "react-router";
import { ROOT_PATH } from "../../const/path";
import ContentSpinner from "../common/ContentSpinner";
import ScrollView from "../layout/ScrollView";

const RootPage = lazy(() => import("./page/RootPage"));

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
      <Switch>
        <Route exact path={ROOT_PATH} component={RootPage} />
      </Switch>
    </Suspense>
  );
};

export default ContentRouter;
