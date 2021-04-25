import type StyledComponentProps from "../../../type/StyledComponent";

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

export interface BIProps extends StyledComponentProps {
  shape?: BIShape;
  size?: BISize;
  link?: boolean;
  linkTo?: string;
}
