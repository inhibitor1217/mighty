import { styled } from "@channel.io/bezier-react";

import flexbox from "styles/flexbox";

const TitleWrapper = styled.div`
  ${flexbox("row")}

  gap: 8px;
`;

const Wrapper = styled.div`
  ${flexbox("column", "center", "flex-start")}

  padding-right: 48px;
`;

const Styled = {
  TitleWrapper,
  Wrapper,
};

export default Styled;
