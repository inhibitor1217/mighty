import { BrowserRouter as Router } from "react-router-dom";
import { FoundationProvider, LightFoundation } from "@channel.io/bezier-react";

import GNB from "component/layout/GNB";
import { ContentRouter } from "component/router";
import { DeviceDimensionsProvider } from "context/DeviceDimensions";

const App = () => {
  return (
    <FoundationProvider foundation={LightFoundation}>
      <DeviceDimensionsProvider>
        <Router>
          <GNB />
          <ContentRouter />
        </Router>
      </DeviceDimensionsProvider>
    </FoundationProvider>
  );
};

export default App;
