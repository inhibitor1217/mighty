import { cloneElement, ComponentType, SVGProps, useMemo } from "react";
import { Link } from "react-router-dom";
import { ROOT_PATH } from "../../../const/path";
import { ReactComponent as BICompactBlackSvg } from "./res/bi-compact-black.svg";
import { ReactComponent as BIBlackSvg } from "./res/bi-black.svg";
import { ReactComponent as BICompactWhiteSvg } from "./res/bi-compact-white.svg";
import { ReactComponent as BIWhiteSvg } from "./res/bi-white.svg";
import {
  BI_COMPACT_ASPECT_RATIO,
  BI_DEFAULT_ASPECT_RATIO,
  BI_HEIGHTS,
} from "./BI.const";
import { BIColor, BIProps, BIShape, BISize } from "./BI.type";

const SVG_COMPONENTS: {
  [key in BIShape]: {
    [key in BIColor]: ComponentType<SVGProps<SVGSVGElement>>;
  };
} = {
  [BIShape.Default]: {
    [BIColor.White]: BIWhiteSvg,
    [BIColor.Black]: BIBlackSvg,
  },
  [BIShape.Compact]: {
    [BIColor.White]: BICompactWhiteSvg,
    [BIColor.Black]: BICompactBlackSvg,
  },
};

const BI = ({
  className,
  shape = BIShape.Default,
  size = BISize.S,
  color = BIColor.White,
  link = true,
  linkTo = ROOT_PATH,
}: BIProps) => {
  const element = useMemo(() => {
    switch (shape) {
      case BIShape.Default: {
        const Component = SVG_COMPONENTS[shape][color];
        return (
          <Component
            width={BI_HEIGHTS[size] * BI_DEFAULT_ASPECT_RATIO}
            height={BI_HEIGHTS[size]}
          />
        );
      }
      case BIShape.Compact: {
        const Component = SVG_COMPONENTS[shape][color];
        return (
          <Component
            width={BI_HEIGHTS[size] * BI_COMPACT_ASPECT_RATIO}
            height={BI_HEIGHTS[size]}
          />
        );
      }
    }
  }, [color, shape, size]);

  if (link) {
    return (
      <Link className={className} to={linkTo}>
        {element}
      </Link>
    );
  }

  return cloneElement(element, { className });
};

export default BI;
