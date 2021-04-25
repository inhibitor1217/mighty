import { Route, Switch } from "react-router";
import { ROOT_PATH } from "../../const/path";
import RootPage from "./page/RootPage";

const ContentRouter = () => {
  return (
    <Switch>
      <Route exact path={ROOT_PATH} component={RootPage} />
    </Switch>
  );
};

export default ContentRouter;
