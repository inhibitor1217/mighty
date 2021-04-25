import React from "react";
import { BISize } from "../../base/BI/BI.type";
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
