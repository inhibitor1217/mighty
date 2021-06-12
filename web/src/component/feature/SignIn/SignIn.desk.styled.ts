import { styled } from "@channel.io/bezier-react";

import flexbox from "styles/flexbox";

const Title = styled.div`
  ${flexbox("row", "flex-start")}
`;

const Subtitle = styled.div`
  padding-left: 8px;
  margin-top: 8px;
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
