import styled from "styled-components";

import BaseBI from "component/base/BI";
import flexbox from "styles/flexbox";
import { DefaultPalette } from "styles/palette";
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
  background-color: ${DefaultPalette["bg-black-darkest"]};
  z-index: ${GNB_Z_INDEX};

  ${flexbox("row")}
`;

const Styled = {
  BI,
  Wrapper,
};

export default Styled;
