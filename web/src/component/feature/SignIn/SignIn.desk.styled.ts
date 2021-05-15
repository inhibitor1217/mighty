import styled from "styled-components";

import flexbox from "styles/flexbox";
import { DefaultPalette } from "styles/palette";

const Title = styled.div`
  ${flexbox("row", "flex-start")}
`;

const Subtitle = styled.div`
  padding-left: 8px;
  margin-top: 8px;

  span {
    font-size: 16px;
    line-height: 24px;
    color: ${DefaultPalette["txt-black-light"]};
  }
`;

const LoginButtonWrapper = styled.div`
  margin-top: 16px;
`;

const Wrapper = styled.div`
  width: 400px;

  ${flexbox("column")}
`;

const Styled = {
  Wrapper,
  Title,
  Subtitle,
  LoginButtonWrapper,
};

export default Styled;
