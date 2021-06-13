import { styled } from "@channel.io/bezier-react";

import flexbox from "styles/flexbox";

const RightWrapper = styled.div`
  ${flexbox("column", "center", "flex-start")}
`;

const Wrapper = styled.div`
  ${flexbox("row")}

  padding: 16px 24px 16px 12px;
  background-color: ${({ foundation }) => foundation?.theme?.["bg-black-lighter"]};
  ${({ foundation }) => foundation?.rounding?.round8}

  ${RightWrapper} {
    margin-left: 12px;
  }
`;

const Styled = {
  RightWrapper,
  Wrapper,
};

export default Styled;
