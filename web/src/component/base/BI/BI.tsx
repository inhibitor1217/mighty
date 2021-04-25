import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { ROOT_PATH } from "../../../const/path";
import { ReactComponent as BICompactWhiteSvg } from "./res/bi-compact-white.svg";
import { ReactComponent as BIWhiteSvg } from "./res/bi-white.svg";
import {
  BI_COMPACT_ASPECT_RATIO,
  BI_DEFAULT_ASPECT_RATIO,
  BI_HEIGHTS,
} from "./BI.const";
import { BIProps, BIShape, BISize } from "./BI.type";

const BI = ({
  shape = BIShape.Default,
  size = BISize.S,
  link = true,
  linkTo = ROOT_PATH,
}: BIProps) => {
  const element = useMemo(() => {
    switch (shape) {
      case BIShape.Default:
        return (
          <BIWhiteSvg
            width={BI_HEIGHTS[size] * BI_DEFAULT_ASPECT_RATIO}
            height={BI_HEIGHTS[size]}
          />
        );
      case BIShape.Compact:
        return (
          <BICompactWhiteSvg
            width={BI_HEIGHTS[size] * BI_COMPACT_ASPECT_RATIO}
            height={BI_HEIGHTS[size]}
          />
        );
    }
  }, [shape, size]);

  if (link) {
    return <Link to={linkTo}>{element}</Link>;
  }

  return element;
};

export default BI;
