export enum IconSize {
  XS,
  S,
  M,
  L,
}

interface IconProps {
  name: string;
  iconSize?: IconSize;
}

export default IconProps;
