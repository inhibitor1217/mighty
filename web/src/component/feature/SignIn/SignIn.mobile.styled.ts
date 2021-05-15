import styled from "styled-components";

import flexbox from "styles/flexbox";
import { DefaultPalette } from "styles/palette";

const Title = styled.div`
  ${flexbox("row", "flex-start")}
`;

const Subtitle = styled.div`
  padding-left: 4px;
  margin-top: 4px;

  span {
    color: ${DefaultPalette["txt-black-light"]};
  }
`;

const LoginButtonWrapper = styled.div`
  margin-top: 8px;
`;

const Wrapper = styled.div`
  width: 100%;
  height: 480px;

  ${flexbox("column", "flex-start")}

  ${Title},
  ${Subtitle} {
    align-self: flex-start;
  }
`;

const Styled = {
  Wrapper,
  Title,
  Subtitle,
  LoginButtonWrapper,
};

export default Styled;
