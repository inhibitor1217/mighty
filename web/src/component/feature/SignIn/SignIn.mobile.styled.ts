import { styled } from "@channel.io/bezier-react";

import flexbox from "styles/flexbox";

const Title = styled.div`
  ${flexbox("row", "flex-start")}
`;

const Subtitle = styled.div`
  padding-left: 4px;
  margin-top: 4px;

  span {
    color: ${({ foundation }) => foundation?.theme?.["txt-black-dark"]};
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
