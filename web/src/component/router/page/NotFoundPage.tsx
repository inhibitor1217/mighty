import { useCallback } from "react";
import { useHistory } from "react-router";

import { ROOT_PATH } from "const/path";
import NotFound from "component/feature/NotFound";
import ScrollView from "component/layout/ScrollView";
import useCountdown from "hook/useCountdown";

const REDIRECT_TIMEOUT_SECONDS = 5;

const NotFoundPage = () => {
  const history = useHistory();
  const redirectToRoot = useCallback(() => {
    history.push(ROOT_PATH);
  }, [history]);

  const [secondsUntilRedirect] = useCountdown(REDIRECT_TIMEOUT_SECONDS, redirectToRoot);

  return (
    <ScrollView center>
      <NotFound secondsUntilRedirect={secondsUntilRedirect} />
    </ScrollView>
  );
};

export default NotFoundPage;
