import styled from "styled-components";

import BaseSimpleSpinner from "component/common/SimpleSpinner";
import fadeStyle from "styles/fade";
import flexbox from "styles/flexbox";

import { ReactComponent as BaseCardSpinner } from "./res/card-spinner.svg";
import { CARD_SPINNER_DESK_SIZE } from "./ContentSpinner.const";
import type { StyledWrapperProps } from "./ContentSpinner.type";

const CardSpinner = styled(BaseCardSpinner)`
  margin: auto;
`;

const SimpleSpinner = styled(BaseSimpleSpinner)`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
`;

const Wrapper = styled.div<StyledWrapperProps>`
  position: relative;
  width: ${CARD_SPINNER_DESK_SIZE}px;
  height: ${CARD_SPINNER_DESK_SIZE}px;

  ${flexbox("row")}
  ${fadeStyle}
`;

const Styled = {
  CardSpinner,
  SimpleSpinner,
  Wrapper,
};

export default Styled;
