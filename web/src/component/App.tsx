import { BrowserRouter as Router } from "react-router-dom";
import DeviceDimensionsProvider from "../context/DeviceDimensions/DeviceDimensions.provider";
import GNB from "./layout/GNB";
import { ContentRouter } from "./router";

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
