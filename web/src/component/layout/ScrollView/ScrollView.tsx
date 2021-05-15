import useResponsive from "hook/useResponsive";

import DeskScrollView from "./ScrollView.desk";
import MobileScrollView from "./ScrollView.mobile";
import ScrollViewProps from "./ScrollView.type";

const ScrollView = (props: ScrollViewProps) => {
  const Responsive = useResponsive<ScrollViewProps>(DeskScrollView, {
    Mobile: MobileScrollView,
  });

  return <Responsive {...props} />;
};

export default ScrollView;
