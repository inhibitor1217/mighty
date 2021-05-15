import useResponsive from "hook/useResponsive";

import DeskGNB from "./GNB.desk";
import MobileGNB from "./GNB.mobile";
import type GNBProps from "./GNB.type";

const GNB = (props: GNBProps) => {
  const Responsive = useResponsive<GNBProps>(DeskGNB, { Mobile: MobileGNB });

  return <Responsive {...props} />;
};

export default GNB;
