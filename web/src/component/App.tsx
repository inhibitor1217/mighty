import { BrowserRouter as Router } from "react-router-dom";

import GNB from "component/layout/GNB";
import { ContentRouter } from "component/router";
import { DeviceDimensionsProvider } from "context/DeviceDimensions";

const App = () => {
  return (
    <DeviceDimensionsProvider>
      <Router>
        <GNB />
        <ContentRouter />
      </Router>
    </DeviceDimensionsProvider>
  );
};

export default App;
