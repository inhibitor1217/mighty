import React from "react";
import DeviceDimensionsProvider from "../context/DeviceDimensions/DeviceDimensions.provider";
import Icon from "./base/Icon/Icon";

const App = () => {
  return (
    <DeviceDimensionsProvider>
      <Icon name="face" />
    </DeviceDimensionsProvider>
  );
};

export default App;
