import { styled } from "@channel.io/bezier-react";

import BaseBI from "component/base/BI";
import flexbox from "styles/flexbox";
import { GNB_Z_INDEX } from "styles/zIndex";

import { GNB_MOBILE_HEIGHT } from "./GNB.const";

const BI = styled(BaseBI)`
  height: 100%;

  ${flexbox("column")}
`;

const Wrapper = styled.nav`
  position: absolute;
  top: 0;
  width: 100%;
  height: ${GNB_MOBILE_HEIGHT}px;
  padding: 8px;
  background-color: ${({ foundation }) => foundation?.theme?.["bgtxt-absolute-black-dark"]};
  z-index: ${GNB_Z_INDEX};

  ${flexbox("row")}
`;

const Styled = {
  BI,
  Wrapper,
};

export default Styled;
