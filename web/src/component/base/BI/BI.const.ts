import { BISize } from "./BI.type";

export const BI_HEIGHTS: { [key in BISize]: number } = {
  [BISize.XS]: 16,
  [BISize.S]: 24,
  [BISize.M]: 36,
  [BISize.L]: 48,
};

export const BI_DEFAULT_ASPECT_RATIO = 4.0;
export const BI_COMPACT_ASPECT_RATIO = 1.0;
