import styled from "styled-components";
import flexbox from "../../../styles/flexbox";
import { DefaultPalette } from "../../../styles/palette/Palette";
import BaseBI from "../../base/BI";
import { GNB_MOBILE_HEIGHT } from "./GNB.const";

const BI = styled(BaseBI)`
  height: 100%;

  ${flexbox("column")}
`;

const Wrapper = styled.nav`
  height: ${GNB_MOBILE_HEIGHT}px;
  padding: 8px;
  background-color: ${DefaultPalette["bg-black-darkest"]};

  ${flexbox("row", "start")}
`;

const Styled = {
  BI,
  Wrapper,
};

export default Styled;
