import type StyledComponentProps from "../../../type/StyledComponent";

export enum SimpleSpinnerSize {
  XS,
  S,
  M,
  L,
}

export interface SpinnerSvgProps {
  size: number;
}

interface SimpleSpinnerProps extends StyledComponentProps {
  size?: SimpleSpinnerSize;
  pixelSize?: number;
}

export default SimpleSpinnerProps;
