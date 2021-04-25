import styled from "styled-components";
import flexbox from "../../../styles/flexbox";
import { DefaultPalette } from "../../../styles/palette/Palette";

const Divider = styled.div`
  flex: 1;
  height: 1px;
  margin: 0 8px;
  background-color: ${DefaultPalette["bdr-white-normal"]};
`;

const DividerCenterCircle = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color ${DefaultPalette["bdr-white-normal"]};
`;

const DividerWrapper = styled.div`
  width: 240px;
  margin: 16px 0;

  ${flexbox("row", "center", "center")}
`;

const Wrapper = styled.div`
  ${flexbox("column", "center", "center")}

  h3 {
    margin-top: 8px;
  }

  span {
    color: ${DefaultPalette["txt-black-light"]};
  }
`;

const Styled = {
  Divider,
  DividerCenterCircle,
  DividerWrapper,
  Wrapper,
};

export default Styled;
