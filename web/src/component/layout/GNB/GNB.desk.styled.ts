import styled from "styled-components";
import flexbox from "../../../styles/flexbox";
import { DefaultPalette } from "../../../styles/palette/Palette";
import { GNB_Z_INDEX } from "../../../styles/zIndex";
import BaseBI from "../../base/BI";
import { GNB_DESKTOP_HEIGHT } from "./GNB.const";

const BI = styled(BaseBI)`
  height: 100%;

  ${flexbox("column")}
`;

const Wrapper = styled.nav`
  position: absolute;
  top: 0;
  width: 100%;
  height: ${GNB_DESKTOP_HEIGHT}px;
  padding: 8px 16px;
  z-index: ${GNB_Z_INDEX};
  background-color: ${DefaultPalette["bg-black-darkest"]};

  ${flexbox("row", "flex-start")}
`;

const Styled = {
  BI,
  Wrapper,
};

export default Styled;
