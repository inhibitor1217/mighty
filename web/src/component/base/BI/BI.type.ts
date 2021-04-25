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

export interface BIProps {
  shape?: BIShape;
  size?: BISize;
  link?: boolean;
  linkTo?: string;
}
