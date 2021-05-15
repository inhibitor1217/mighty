import { createContext } from "react";

import type DeviceDimensions from "./DeviceDimensions.type";

const initialValue: DeviceDimensions = {
  width: 0,
  height: 0,
};

const DeviceDimensionsContext = createContext(initialValue);

export default DeviceDimensionsContext;
