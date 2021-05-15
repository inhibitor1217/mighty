import { BISize } from "component/base/BI";

import Styled from "./GNB.desk.styled";
import type GNBProps from "./GNB.type";

const GNB = ({ className }: GNBProps) => {
  return (
    <Styled.Wrapper className={className}>
      <Styled.BI size={BISize.M} />
    </Styled.Wrapper>
  );
};

export default GNB;
