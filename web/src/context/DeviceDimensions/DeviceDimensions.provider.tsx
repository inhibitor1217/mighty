import React, { useEffect, useState } from "react";
import _ from "lodash";
import { RESIZE_HANDLER_THROTTLE_MS } from "./DeviceDimensions.const";
import DeviceDimensionsContext from "./DeviceDimensions.context";
import type DeviceDimensions from "./DeviceDimensions.type";

function getDeviceDimensions(): DeviceDimensions {
  const { innerWidth, innerHeight } = window;
  return {
    width: innerWidth,
    height: innerHeight,
  };
}

interface DeviceDimensionsProviderProps {
  children: React.ReactNode;
}

const DeviceDimensionsProvider = ({ children }: DeviceDimensionsProviderProps) => {
  const [dimensions, setDimensions] = useState<DeviceDimensions>(getDeviceDimensions());

  useEffect(function attachResizeHandler() {
    const updateDimensions = _.throttle(
      () => setDimensions(getDeviceDimensions()),
      RESIZE_HANDLER_THROTTLE_MS
    );
    window.addEventListener("resize", updateDimensions);

    return function clearResizeHandler() {
      window.removeEventListener("resize", updateDimensions);
    };
  }, []);

  return (
    <DeviceDimensionsContext.Provider value={dimensions}>
      {children}
    </DeviceDimensionsContext.Provider>
  );
};

export default DeviceDimensionsProvider;
