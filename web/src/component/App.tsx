import React from "react";
import DeviceDimensionsProvider from "../context/DeviceDimensions/DeviceDimensions.provider";

const App = () => {
  return (
    <DeviceDimensionsProvider>
      <div>Hello, world!</div>
    </DeviceDimensionsProvider>
  );
};

export default App;
