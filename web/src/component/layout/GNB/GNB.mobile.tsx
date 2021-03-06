import { BIShape, BISize } from "component/base/BI";

import Styled from "./GNB.mobile.styled";
import type GNBProps from "./GNB.type";

const GNB = ({ className }: GNBProps) => {
  return (
    <Styled.Wrapper className={className}>
      <Styled.BI shape={BIShape.Compact} size={BISize.M} />
    </Styled.Wrapper>
  );
};

export default GNB;
