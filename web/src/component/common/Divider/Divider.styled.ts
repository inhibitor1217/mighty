import styled from "styled-components";

import flexbox from "styles/flexbox";
import { DefaultPalette } from "styles/palette";

const Line = styled.div`
  flex: 1;
  height: 1px;
  margin: 0 8px;
  background-color: ${DefaultPalette["bdr-white-normal"]};
`;

const CenterCircle = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: ${DefaultPalette["bdr-white-normal"]};
`;

const Wrapper = styled.div`
  width: 240px;
  margin: 16px 0;

  ${flexbox("row", "center", "center")}
`;

const Styled = {
  Line,
  CenterCircle,
  Wrapper,
};

export default Styled;
