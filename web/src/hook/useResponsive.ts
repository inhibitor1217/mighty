import { useContext, useMemo } from "react";
import { isMobile, isTablet } from "react-device-detect";
import _ from "lodash";
import DeviceDimensionsContext from "../context/DeviceDimensions/DeviceDimensions.context";

interface MediaQuery {
  minWidth?: number;
  maxWidth?: number;
}

function matchQueryFn(width: number): (mediaQuery: MediaQuery) => boolean {
  return function matchQuery(mediaQuery: MediaQuery) {
    const { minWidth, maxWidth } = mediaQuery;
    return (
      (_.isNumber(minWidth) ? minWidth <= width : true) &&
      (_.isNumber(maxWidth) ? maxWidth >= width : true)
    );
  };
}

interface MediaQueryElement {
  element: React.ReactElement;
  query: MediaQuery;
}

const useResponsive = (
  baseElement: React.ReactElement,
  responsiveElements?: {
    mobile?: React.ReactElement;
    tablet?: React.ReactElement;
    mediaQueries?: MediaQueryElement[];
  }
): React.ReactElement => {
  const { width: deviceWidth } = useContext(DeviceDimensionsContext);
  const { mobile, tablet, mediaQueries } = responsiveElements ?? {};

  const matchQuery = useMemo(() => matchQueryFn(deviceWidth), [deviceWidth]);
  const mediaQueryMatchedElement = useMemo(
    () =>
      _.isNil(mediaQueries)
        ? null
        : mediaQueries.find(({ query }) => matchQuery(query))?.element,
    [matchQuery, mediaQueries]
  );

  if (!_.isNil(mediaQueryMatchedElement)) {
    return mediaQueryMatchedElement;
  }

  if (isTablet && !_.isNil(tablet)) {
    return tablet;
  }

  if (isMobile && !_.isNil(mobile)) {
    return mobile;
  }

  return baseElement;
};

export default useResponsive;
