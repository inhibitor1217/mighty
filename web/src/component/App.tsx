import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import DeviceDimensionsProvider from "../context/DeviceDimensions/DeviceDimensions.provider";
import GNB from "./layout/GNB";

const App = () => {
  return (
    <DeviceDimensionsProvider>
      <Router>
        <GNB />
      </Router>
    </DeviceDimensionsProvider>
  );
};

export default App;
