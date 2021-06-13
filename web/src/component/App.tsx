import { BrowserRouter as Router } from "react-router-dom";
import { FoundationProvider, LightFoundation } from "@channel.io/bezier-react";

import ErrorBoundary from "component/common/ErrorBoundary";
import GNB from "component/layout/GNB";
import { ContentRouter } from "component/router";
import { DeviceDimensionsProvider } from "context/DeviceDimensions";

const App = () => {
  return (
    <FoundationProvider foundation={LightFoundation}>
      <ErrorBoundary>
        <DeviceDimensionsProvider>
          <Router>
            <GNB />
            <ContentRouter />
          </Router>
        </DeviceDimensionsProvider>
      </ErrorBoundary>
    </FoundationProvider>
  );
};

export default App;
