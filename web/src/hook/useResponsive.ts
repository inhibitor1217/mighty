import { useContext, useMemo } from "react";
import { isMobile, isTablet } from "react-device-detect";
import _ from "lodash";
import { DeviceDimensionsContext } from "../context/DeviceDimensions";

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

interface MediaQueryComponent<P> {
  Component: React.ComponentType<P>;
  query: MediaQuery;
}

const useResponsive = <P>(
  BaseComponent: React.ComponentType<P>,
  responsiveComponents?: {
    Mobile?: React.ComponentType<P>;
    Tablet?: React.ComponentType<P>;
    mediaQueries?: MediaQueryComponent<P>[];
  }
) => {
  const { width: deviceWidth } = useContext(DeviceDimensionsContext);
  const { Mobile, Tablet, mediaQueries } = responsiveComponents ?? {};

  const matchQuery = useMemo(() => matchQueryFn(deviceWidth), [deviceWidth]);
  const MediaQueryMatchedComponent = useMemo(
    () =>
      _.isNil(mediaQueries) ? null : mediaQueries.find(({ query }) => matchQuery(query))?.Component,
    [matchQuery, mediaQueries]
  );

  if (!_.isNil(MediaQueryMatchedComponent)) {
    return MediaQueryMatchedComponent;
  }

  if (isTablet && !_.isNil(Tablet)) {
    return Tablet;
  }

  if (isMobile && !_.isNil(Mobile)) {
    return Mobile;
  }

  return BaseComponent;
};

export default useResponsive;
