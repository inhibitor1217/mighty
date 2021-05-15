import type StyledComponentProps from "type/StyledComponent";

export enum BIShape {
  Default = "default",
  Compact = "compact",
}

export enum BISize {
  XS,
  S,
  M,
  L,
}

export enum BIColor {
  White = "white",
  Black = "black",
}

interface BIProps extends StyledComponentProps {
  shape?: BIShape;
  size?: BISize;
  color?: BIColor;
  link?: boolean;
  linkTo?: string;
}

export default BIProps;
