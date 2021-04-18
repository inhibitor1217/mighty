import React from "react";
import classNames from "classnames";
import { IconSize } from "./icon.types";

export interface IconProps {
  name: string;
  iconSize?: IconSize;
}

const Icon = ({ name, iconSize = IconSize.S }: IconProps) => {
  return (
    <i
      className={classNames(
        "material-icons",
        iconSize === IconSize.XS && "md-16",
        iconSize === IconSize.S && "md-24",
        iconSize === IconSize.M && "md-32",
        iconSize === IconSize.L && "md-48"
      )}
    >
      {name}
    </i>
  );
};

export default Icon;
