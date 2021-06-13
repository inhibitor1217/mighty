import { styled } from "@channel.io/bezier-react";

import flexbox from "styles/flexbox";

const SectionLabelContentWrapper = styled.div`
  ${flexbox("row")}

  > * + * {
    margin-left: 6px;
  }
`;

const Wrapper = styled.div`
  ${flexbox("column", "center", "flex-start")}
`;

const Styled = {
  SectionLabelContentWrapper,
  Wrapper,
};

export default Styled;
